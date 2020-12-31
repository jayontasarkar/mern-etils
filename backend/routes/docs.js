const express = require('express');
const auth = require('../middleware/auth');
const isValidId = require('../middleware/isValidId');
const router = express.Router();
const docCtrl = require('../controllers/docController');

router.get('/', [auth], docCtrl.myDocs);
router.get('/shared', [auth], docCtrl.sharedDocs);
router.get('/:id', [auth, isValidId], docCtrl.find);
router.get('/preview/:id', [isValidId], docCtrl.preview);
router.post('/', [auth], docCtrl.save);
router.put('/:id', [auth, isValidId], docCtrl.update);
router.delete('/:id', [auth, isValidId], docCtrl.remove);
router.post('/uploadfiles', [auth], docCtrl.upload);

module.exports = router;
