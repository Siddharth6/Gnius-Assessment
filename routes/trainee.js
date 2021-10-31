const express = require("express");
const router = express.Router();

var trainee = require("../controllers/trainee");

router.post('/enter',trainee.traineeenter);
router.post('/feedback',trainee.feedback);
router.post('/resend/testlink',trainee.resendmail);
router.post('/correct/answers',trainee.correctAnswers);
router.post('/answersheet',trainee.Answersheet);
router.post('/flags',trainee.flags);
router.post('/details',trainee.TraineeDetails);
router.post('/paper/questions',trainee.Testquestions);
router.post('/chosen/options',trainee.chosenOptions);
router.post('/update/answer',trainee.UpdateAnswers);
router.post('/end/test',trainee.EndTest);
router.post('/get/question',trainee.getQuestion);
router.post('/feedback/status',trainee.checkFeedback);

router.post('/jobpost/details', trainee.getSingleJobPost);
router.post('/coding/question/details', trainee.getQuestionData);
router.post('/coding/contest/question', trainee.getContestQuestion);
router.post('/coding/contest/submission', trainee.postSubmission);

router.post('/coding/start/section', trainee.startCoding);
router.post('/coding/submit/section', trainee.submitCoding);
router.post('/coding/section/details', trainee.getsubmitCoding);

module.exports = router;