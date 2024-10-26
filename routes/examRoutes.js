const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, Exam,StudentDetails } = require('../models/schema.js');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); 
    }
    console.log("NO");
    res.status(401).redirect('/');
};

router.get('/search/:Exam_id', isAuthenticated, async (req, res) => {
  const examId = req.params.Exam_id; // Extracting the Exam_id from URL parameters
  try {
      // Searching for the exam using the correct field name 'Exam_id'
      const exam = await Exam.findOne({ Exam_id: examId });

      if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
      }
      
      return res.status(200).json({ message: "Exam found", exam: exam });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
});

router.post('/submit', isAuthenticated, async (req, res) => {
  return res.status(200).json({ message: "hello success" });
});

// Route to handle POST request for starting the exam
router.post('/start/:id/:examId',  isAuthenticated,async (req, res) => {
  const examId = req.params.examId;
  const userId = req.params.id; 
  try {
    const exam = await Exam.findOne({ Exam_id: examId });

    if (!exam) {
      return res.status(404).send({ message: 'Exam not found' });
      
    }
    else{
      var secureExamData = {
        Exam_id: exam.Exam_id,
        exam_name: exam.exam_name,
        timeLimit: exam.timeLimit,
        questions: exam.questions.map(q => ({
          questionText: q.questionText,
          options: q.options.map(option => ({
            optionText: option // Since options are strings
          }))
          // Correct answer is not included here
        }))
      };
      
    }
    const student = await Student.findById(userId); 
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    res.render("Exam_start.ejs",{exam:secureExamData ,student });

  } catch (error) {
    console.error('Error starting the exam:', error);
    return res.status(500).send({ message: 'An error occurred while starting the exam.' });
  }
});

module.exports = router;
