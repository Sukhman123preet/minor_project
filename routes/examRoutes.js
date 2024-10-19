const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, Exam,StudentDetails } = require('../models/schema.js');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("yes"); 
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


// Route to handle POST request for starting the exam
router.post('/start/:id/:examId', async (req, res) => {
  const examId = req.params.examId;
  const userId = req.params.id; 
  try {
    const exam = await Exam.findOne({ Exam_id: examId });

    if (!exam) {
      return res.status(404).send({ message: 'Exam not found' });
    }

    const student = await Student.findById(userId); 

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    

    exam.studentsAttempted.push(student._id);
    await exam.save();

    // Step 4: Start the exam timer (could be handled on the frontend or via session tracking)
    // Example: Setting a session variable to track exam start time
    req.session.examStartTime = new Date();

    // Step 5: Redirect to the exam page or return a success message
    res.redirect(`/Exam/take/${examId}`); // Assuming you have a route to handle exam-taking

  } catch (error) {
    console.error('Error starting the exam:', error);
    return res.status(500).send({ message: 'An error occurred while starting the exam.' });
  }
});

module.exports = router;


module.exports = router;
