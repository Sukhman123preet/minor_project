const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, Exam,StudentDetails ,ExamAttempt} = require('../models/schema.js');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); 
    }
    console.log("NO");
    res.status(401).redirect('/');
};

router.get('/search/:user_id/:Exam_id', isAuthenticated, async (req, res) => {
  const examId = req.params.Exam_id;
  const studentId = req.params.user_id;

  try {
      // Find the exam using the correct field name 'Exam_id'
      const exam = await Exam.findOne({ Exam_id: examId });
      if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
      }

      // Check if the student has already attempted this exam
      const userAttempt = await ExamAttempt.findOne({ student: studentId, exam_id: examId });

      // Check if the student has exhausted attempts
      if (userAttempt) {
          if (userAttempt.attempt_no >= exam.maxAttempts) {
              return res.status(403).json({ message: "Attempt limit exceeded for this exam." });
          }
      }

      return res.status(200).json({ message: "Exam found", exam: exam, attemptsRemaining: userAttempt ? (exam.maxAttempts - userAttempt.attempt_no) : exam.maxAttempts });
      
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
});

router.post('/submit', isAuthenticated, async (req, res) => {
  const { studentId, examId, answers, timeSpent } = req.body;

  try {
    
      // Fetch the exam with questions and correct answers
      const exam = await Exam.findOne({ Exam_id: examId });
      if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
      }

      // Calculate score
      let score = 0;
      for (let i = 0; i < exam.questions.length; i++) {
          if (answers[i] && answers[i] === exam.questions[i].correctAnswer) {
              score += exam.questions[i].marks; // Add question's marks to score if correct
          }
      }

      // Check if an attempt already exists for this student and exam
      const existingAttempt = await ExamAttempt.findOne({ student: studentId, exam_id: examId });
      if (existingAttempt) {
          // Increment attempt number and update score and status
          existingAttempt.attempt_no += 1;
          existingAttempt.score = score; // Optionally update the score
          existingAttempt.status = 'completed'; // Update status
          await existingAttempt.save();

          console.log("help"); // Debugging statement
          return res.status(200).json({ message: 'Submission successful', score, redirect: `/Login/Student/${studentId}`});
      }

      // Create a new exam attempt if none exists
      const examAttempt = new ExamAttempt({
          student: studentId,
          exam_id: examId,
          score,
          status: 'completed', // Mark as completed
          attempt_no: 1 // First attempt
      });

      await examAttempt.save();
      return res.status(200).json({ message: 'Submission successful', score, redirect: `/`});

  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred during submission' });
  }
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
