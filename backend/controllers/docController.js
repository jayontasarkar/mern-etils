const multer = require('multer');
const { Doc, validate } = require('../models/doc');
const { User } = require('../models/user');
const moment = require('moment');
const { Mongoose } = require('mongoose');

// my docs
exports.myDocs = async (req, res) => {
  const user = req.user;
  const docs = await Doc.find({ author: user._id })
    .sort('-updatedAt')
    .populate('author');

  const result = docs.map((item) => {
    const fromNow = moment(item.updatedAt).fromNow();
    return {
      id: item.id,
      title: item.title,
      meta: `${fromNow} by ${item.author.name}`,
    };
  });
  return res.json(result);
};

// shared docs
exports.sharedDocs = async (req, res) => {
  const user = req.user;
  const docs = await Doc.find({ 'editors._id': user._id })
    .sort('-updatedAt')
    .populate('author');

  const result = docs.map((item) => {
    const fromNow = moment(item.updatedAt).fromNow();
    return {
      id: item.id,
      title: item.title,
      meta: `${fromNow} by ${item.author.name}`,
    };
  });
  return res.json(result);
};

// save a doc
exports.save = async (req, res) => {
  const { title, content, public, editors } = req.body;
  const { error } = validate({ title });
  if (error) {
    const errors = {};
    error.details.forEach((e) => (errors[e.path[0]] = e.message));
    return res.status(400).send(errors);
  }
  const { _id } = req.user;
  const doc = new Doc({
    title,
    content,
    author: _id,
    public,
  });
  if (editors && editors.length > 0) {
    const users = await User.find()
      .where('_id')
      .in(editors)
      .select('_id name email')
      .exec();
    if (users && users.length > 0) {
      doc.editors = users;
    }
  }
  await doc.save();

  const fromNow = moment(doc.updatedAt).fromNow();
  const result = {
    id: doc.id,
    title: doc.title,
    meta: `${fromNow} by ${doc.author.name}`,
  };

  res.json(doc);
};

// find a doc
exports.find = async (req, res) => {
  const user = req.user;
  const docId = req.params.id;

  const doc = await Doc.findOne({
    $and: [
      { _id: docId },
      {
        $or: [{ author: user._id }, { 'editors._id': user._id }],
      },
    ],
  });
  if (!doc) return res.status(404).send('Doc not found');

  res.json(doc);
};

// remove doc
exports.remove = async (req, res) => {
  const user = req.user;
  const doc = await Doc.findById(req.params.id);
  if (!doc) return res.status(404).send('Doc not found');

  if (req.user._id != doc.author._id)
    return res.status(422).send('Not authorized');

  await doc.delete();

  res.json(doc);
};

// preview a doc
exports.preview = async (req, res) => {
  const docId = req.params.id;
  const doc = await Doc.findOne({ _id: docId, public: true });
  if (!doc) return res.status(404).send('Doc not found');

  res.json(doc);
};

// update a doc
exports.update = async (req, res) => {
  const user = req.user;
  const docId = req.params.id;
  const { title, content, public, editors } = req.body;

  const { error } = validate({ title });
  if (error) {
    const errors = {};
    error.details.forEach((e) => (errors[e.path[0]] = e.message));
    return res.status(400).send(errors);
  }

  const doc = await Doc.findOne({
    $and: [
      { _id: docId },
      {
        $or: [{ author: user._id }, { 'editors._id': user._id }],
      },
    ],
  });
  if (!doc) return res.status(404).send('Doc not found');
  doc.title = title;
  doc.content = content;
  doc.public = public;
  if (editors && editors.length > 0) {
    const users = await User.find()
      .where('_id')
      .in(editors)
      .select('_id name email')
      .exec();
    if (users && users.length > 0) {
      doc.editors = users;
    }
  } else {
    doc.editors = [];
  }
  await doc.save();

  res.json(doc);
};

// upload files
exports.upload = (req, res) => {
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
        return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
      }
      cb(null, true);
    },
  });

  const upload = multer({ storage: storage }).single('file');
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
};
