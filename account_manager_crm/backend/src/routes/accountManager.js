
const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountManagerController');

// Hybrid assignment: suggest manager (auto) then admin can confirm
router.post('/assign/suggest', controller.suggestManager);
router.post('/assign/confirm', controller.confirmAssignment);
router.get('/managers', controller.listManagers);
router.post('/lead/qualify', controller.qualifyLead);
router.post('/followup/add', controller.addFollowUp);
router.get('/followup/list/:managerId', controller.listFollowUps);
router.get('/reports/weekly/:supplierId', controller.weeklyReport);

module.exports = router;
