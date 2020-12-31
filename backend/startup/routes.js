const express = require('express');
const authRoutes = require('../routes/auth');
const teamsRoutes = require('../routes/teams');
const docRoutes = require('../routes/docs');

module.exports = function (app) {
  app.use('/uploads', express.static('uploads'));
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/docs', docRoutes);
  app.use('/api/teams', teamsRoutes);
};
