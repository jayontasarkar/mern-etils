const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const invitationCtrl = require('../controllers/invitationController');
const teamCtrl = require('../controllers/teamController');

// Teams
router.get('/members', [auth], teamCtrl.members);
router.delete('/members/:id', [auth], teamCtrl.removeMember);
router.post('/setup', [auth], teamCtrl.setup);
router.post('/join', teamCtrl.join);
router.post('/join-link', teamCtrl.joinLink);
router.post('/login-with-join', teamCtrl.loginWithJoin);

// Team invitations
router.get('/invitations', [auth], invitationCtrl.getInvitations);
router.get('/invitations/:id/check', invitationCtrl.checkInvitation);
router.post('/invitations', [auth], invitationCtrl.postInvitation);
router.delete('/invitations/:id', [auth], invitationCtrl.deleteInvitation);
router.post('/invitations/:id/resend', [auth], invitationCtrl.resend);
router.get('/:teamId/invitation/join/:invToken', invitationCtrl.confirm);

module.exports = router;
