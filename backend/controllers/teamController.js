const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  Invitation,
  validate: validateInvitation,
} = require('../models/invitation');
const { Team, validate } = require('../models/team');
const { User, validate: userValidate } = require('../models/user');

exports.setup = async (req, res) => {
  const payload = _.pick(req.body, ['name', 'slug', 'maxSize']);
  const { error } = validate(payload);
  if (error) {
    const errors = {};
    error.details.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).send(errors);
  }

  const team = await Team.findOne({ slug: req.body.slug });
  if (team)
    return res.status(400).send({
      slug: 'Team ID is used by another user',
    });

  const newTeam = new Team({ ...payload, owner: req.user._id });
  await newTeam.save();

  const user = await User.findById(req.user._id);
  const token = user.generateAuthToken(newTeam.slug);

  res.json(token);
};

exports.join = async (req, res) => {
  const { error } = userValidate(
    _.pick(req.body, ['name', 'email', 'password'])
  );

  if (error) {
    const errors = {};
    error.details.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).send(errors);
  }

  const { email, name, password, invitation: inv } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(422).send('Email address has already taken');

  const invitation = await Invitation.findOne({ token: inv }).populate('team');
  if (!invitation) {
    return res.status(422).send('Invalid invitation');
  }
  if (invitation.email !== email) {
    return res.status(422).send('Email is different from invited email.');
  }

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const teamObj = invitation.team;
  teamObj.members.push(new User(_.pick(user, ['_id', 'name', 'email'])));
  await teamObj.save();
  await invitation.delete();

  const token = user.generateAuthToken(teamObj.slug);

  return res.json(token);
};

exports.joinLink = async (req, res) => {
  const payload = _.pick(req.body, ['email']);
  const { error } = validateInvitation(payload);
  if (error) {
    const errors = {};
    error.details.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).send(errors);
  }
  const { email, team: teamSlug } = req.body;
  const team = await Team.findOne({ slug: teamSlug });
  if (!team) return res.status(422).send('Team not found.');
  let invitation = await Invitation.findOne({ email, team: team.id });
  if (invitation) return res.status(422).send('Already invited for this team.');
  invitation = await Invitation.create({ email, team: team.id });

  return res.json(invitation);
};

exports.loginWithJoin = async (req, res) => {
  const { error } = userValidate(_.pick(req.body, ['email', 'password']));

  if (error) {
    const errors = {};
    error.details.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).send(errors);
  }

  const { email, password, invitation: inv } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ email: 'Email address not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send({
      password: 'Your password is incorrect',
    });

  const invitation = await Invitation.findOne({ token: inv }).populate('team');
  if (!invitation) {
    return res.status(422).send('Invalid invitation');
  }
  if (invitation.email !== email) {
    return res.status(422).send('Email is different from invited email.');
  }

  const teamObj = invitation.team;
  teamObj.members.push(new User(_.pick(user, ['id', 'name', 'email'])));
  await teamObj.save();
  await invitation.delete();

  const token = user.generateAuthToken(teamObj.slug);

  return res.json(token);
};

exports.members = async (req, res) => {
  const { except } = req.query;
  const team = await Team.findOne({ slug: req.user.team })
    .populate('member')
    .populate('owner');

  let members = [];
  const keys = ['_id', 'name', 'email'];
  if (team.owner) members.push({ ..._.pick(team.owner, keys), role: 'owner' });
  if (team.members) {
    const lists = team.members.map((member) => {
      return {
        ..._.pick(member, keys),
        role: 'member',
      };
    });
    members.push(...lists);
  }

  if (except && except === 'true') {
    members = members.filter((m) => m.email !== req.user.email);
  }
  return res.json({
    team: _.pick(team, ['_id', 'name', 'slug', 'owner']),
    members,
  });
};

exports.removeMember = async (req, res) => {
  await Team.findOneAndUpdate(
    { slug: req.user.team },
    {
      $pull: {
        members: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
    }
  );

  return res.send('Done');
};
