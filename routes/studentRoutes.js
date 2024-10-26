const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, StudentDetails } = require('../models/schema.js');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); 
    }
    res.status(401).redirect('/');
};

router.get('/:id',isAuthenticated, async (req, res) => {
    const user = await Student.findOne({ _id: req.params.id });
    res.render('profile.ejs', { user });
});

router.get('/check_details/:user_name', isAuthenticated, async (req, res) => {
    try {
        const studentName = req.params.user_name;
        const student = await StudentDetails.findOne({ studentName: studentName });
        if (student) {
            // If student exists, render the give_exam.ejs view
            const user = await Student.findOne({ username:studentName });
            return res.render('../views/give_exam.ejs', { user });
        } else {

            return res.render('../views/details/student.ejs',{ studentName });
        }
    } catch (error) {
        console.error("Error checking student details: ", error);
        return res.status(500).send("Server Error");
    }
});

// POST route to save student details
router.post('/save_details', async (req, res) => {
    const { studentName, email, currentLevelOfEducation, instituteName } = req.body;
    const newStudent = new StudentDetails({
        studentName,
        email,
        currentLevelOfEducation,
        instituteName,
    });

    try {
        await newStudent.save();
        const user = await Student.findOne({ username:studentName });
        console.log(user)
        // Send response indicating success
        return res.render('../views/give_exam.ejs', { user});
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error saving student details.'); // Ensure to send only one response
    }
});


module.exports = router;