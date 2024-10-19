const express = require('express');
const router = express.Router();
const { Student, Educator } = require('../models/schema.js');


// Route for Educator signup
router.get('/educator', (req, res) => {
    res.render('sign_up.ejs', { role: 'Educator' });  
});

// Route for Student signup
router.get('/student', (req, res) => {
    res.render('sign_up.ejs', { role: 'Student' });   // Create a separate signup page for Educators if necessary
});


router.post('', async (req, res) => {
    let user;
    if (req.body.role === "Student") {
        const check_user = await Student.findOne({ username: req.body.username });
        if (check_user) return res.status(400).send("User already exists");
        user = new Student(req.body);
    } else {
        const check_user = await Educator.findOne({ username: req.body.username });
        if (check_user) return res.status(400).send("User already exists");
        user = new Educator(req.body);
    }
    await user.save();
    console.log("User created successfully", req.body);
    res.redirect('/Login');
});





module.exports = router;
