const { User, validate } = require('../models/user.js');
const { Team } = require('../models/team');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// login a user
exports.login = async (req, res) => {
  const { error } = validate(_.pick(req.body, ['email', 'password']));
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      email: 'Invalid email address found',
    });

  const team = await Team.findOne({
    $and: [
      { slug: req.body.team },
      {
        $or: [{ owner: user.id }, { 'members._id': user.id }],
      },
    ],
  });
  if (!team)
    return res.status(400).send({
      team: 'Invalid organization/team found',
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      password: 'Your password is incorrect',
    });

  const token = user.generateAuthToken(team.slug);

  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email']));
};

// register a user
exports.register = async (req, res) => {
  const { error } = validate(_.pick(req.body, ['name', 'email', 'password']));

  if (error) {
    const errors = {};
    error.details.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return res.status(400).send(errors);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send({
      email: 'Email address has already taken.',
    });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email']));
};
