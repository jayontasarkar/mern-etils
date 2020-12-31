const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { Team } = require('../models/team');
const { Invitation } = require('../models/invitation');
const { cleanUpEmailList } = require('../startup/helpers');
const { sendEmail } = require('../startup/mail');
const { User, validate: validateUser } = require('../models/user');

exports.postInvitation = async (req, res) => {
  const { team: teamId, _id: userId } = req.user;
  const team = await Team.findOne({ slug: teamId });
  const arr = req.body.emails.split(',');
  const emails = cleanUpEmailList(arr).filter((e) => e !== req.user.email);
  if (emails && emails.length > 0) {
    const invitations = [];
    for (let index = 0; index < emails.length; index++) {
      const obj = await Invitation.findOne({
        email: emails[index],
        team: team.id,
      });
      if (!obj) {
        const invitation = await Invitation.create({
          email: emails[index],
          team: team.id,
        });
        const subject = `${req.user.name} invited you to join ${team.slug}`;
        await sendEmail(invitation.email, subject, 'sendInvitation', {
          title: subject,
          link: `${process.env.CLIENT_URL}/organization/${team.slug}/join/${invitation.token}`,
        });
        const fromNow = moment(invitation.createdAt).fromNow();
        invitations.push({
          id: invitation.id,
          description: `${invitation.email} - ${fromNow}`,
        });
      }
    }
    res.json(invitations);
  } else {
    return res.status(400).send('Invalid emails found');
  }
};

exports.getInvitations = async (req, res) => {
  const team = await Team.findOne({ slug: req.user.team });
  const invitations = await Invitation.find({ team: team.id }).sort(
    '-createdAt'
  );
  const result = invitations.map((invitation) => {
    const fromNow = moment(invitation.createdAt).fromNow();
    return {
      id: invitation.id,
      description: `${invitation.email} - ${fromNow}`,
    };
  });
  res.json(result);
};

exports.checkInvitation = async (req, res) => {
  const invitation = await Invitation.findOne({
    token: req.params.id,
  }).populate('team');
  if (!invitation) {
    return res.status(422).send('Invalid invitation');
  }

  res.json(invitation.team);
};

exports.deleteInvitation = async (req, res) => {
  const { team: teamId, _id: userId } = req.user;
  const team = await Team.findOne({
    $and: [
      { slug: teamId },
      {
        $or: [{ owner: userId }, { members: userId }],
      },
    ],
  });
  if (!team) return res.status(400).send('Team not found');
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(400).send('Invitation not found');
  if (invitation.team != team.id)
    return res
      .status(400)
      .send('Only team owner is allowed to remove invitation.');

  await invitation.delete();
  res.send(`Invitation for <${invitation.email}> has removed.`);
};

exports.resend = async (req, res) => {
  const team = await Team.findOne({ owner: req.user._id });
  if (!team) return res.status(400).send('Team not found');
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(400).send('Invitation not found');
  if (invitation.team != team.id)
    return res
      .status(400)
      .send('Only team owner is allowed to resend invitation.');

  const subject = `${req.user.name} invited you to join ${team.slug}`;
  await sendEmail(invitation.email, subject, 'sendInvitation', {
    title: subject,
    link: `${process.env.CLIENT_URL}/organization/${team.slug}/join/${invitation.token}`,
  });
  res.send(`Invitation to <${invitation.email}> has sent again.`);
};

exports.confirm = async (req, res) => {
  const invitation = await Invitation.findOne({ token: req.params.invToken });
  if (!invitation) return res.status(400).send('Invitation not found.');

  let user = await User.findOne({ email: invitation.email });
  if (!user) {
    const { error } = validateUser(
      _.pick(req.body, ['name', 'email', 'password'])
    );
    if (error) {
      const errors = {};
      error.details.forEach((e) => {
        errors[e.path[0]] = e.message;
      });
      return res.status(400).send(errors);
    }
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  }
  const team = await Team.findOne({ slug: req.params.teamId });
  if (!team) return res.status(400).send('Team not found.');
  user = new User(_.pick(user, ['_id', 'name', 'email']));
  team.members.push(user);
  await team.save();

  res.send('Done!');
};
