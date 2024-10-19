const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, Educator } = require('../models/schema.js');


router.get('',(req, res) => {
    res.render('login.ejs');
});

router.post('/Student/:username', 
    passport.authenticate('Student-local', {
        failureRedirect: '/Login',
    }), 
    async (req, res) => {
        try {
            const user = await Student.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).redirect('/');
            }
            res.render('student_homepage.ejs', { user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Route for educator login
router.post('/Educator/:username', 
    passport.authenticate('Educator-local', {
        failureRedirect: '/Login',}),
    async (req, res) => {
        try {
            const user = await Educator.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).redirect('/');
            }
            res.render('educator_homepage.ejs', { user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;
