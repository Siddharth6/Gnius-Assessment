const express = require("express");
const router = express.Router();

const subject = require('../controllers/Subject');

router.post('/create', subject.createEditsubject);
router.get('/details/all', subject.getAllSubjects);
router.get('/details/:_id', subject.getSingleSubject);

module.exports = router;