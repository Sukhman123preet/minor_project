const express = require('express');
const router = express.Router();
const { Educator, EducatorDetails, Exam } = require('../models/schema.js');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/'); // Redirect to home if not authenticated
};

// Route to display educator profile
router.get('/profile/:username', isAuthenticated, async (req, res) => {
    try {
        const educator = await Educator.findOne({ username: req.params.username });
        if (!educator) return res.status(404).send("Educator not found");

        const educatorDetails = await EducatorDetails.findOne({ educatorName: educator.name });
        res.render('educator_profile.ejs', { educator, educatorDetails });
    } catch (error) {
        console.error("Error fetching educator profile: ", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to display create exam page (GET)
router.get('/createExam', isAuthenticated, (req, res) => {
    res.render('create_exam.ejs');
});

// Route to handle exam creation (POST)
router.post('/createExam', isAuthenticated, async (req, res) => {
    try {
        const newExam = new Exam({
            Exam_id: req.body.Exam_id,
            title: req.body.title,
            course: req.body.course,
            createdBy: req.user.username,
            questions: req.body.questions,
            timeLimit: req.body.timeLimit,
            maxAttempts: req.body.maxAttempts,
            totalScore: req.body.totalScore
        });
        await newExam.save();
        res.redirect('/educator/exams'); // Redirect to educator exams page after creating an exam
    } catch (error) {
        console.error("Error creating exam: ", error);
        res.status(500).send("Error creating exam");
    }
});

// Route to view all exams created by the educator
router.get('/exams', isAuthenticated, async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user.username });
        res.render('educator_homepage.ejs', { exams });
    } catch (error) {
        console.error("Error retrieving exams: ", error);
        res.status(500).send("Error retrieving exams");
    }
});

// Route to check details and handle requests for creating tests
router.get('/check_details/:username', isAuthenticated, async (req, res) => {
    try {
        const educatorName = req.params.username;
        const educator = await EducatorDetails.findOne({ educatorName });

        if (educator) {
            return res.render('give_exam.ejs', { user: req.user });
        } else {
            return res.render('details/educator.ejs', { educatorName });
        }
    } catch (error) {
        console.error("Error checking educator details: ", error);
        return res.status(500).send("Server Error");
    }
});

module.exports = router;
