const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Student, Educator } = require('../models/schema.js');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/');
};

router.get('',(req, res) => {
    res.render('login.ejs');
});

router.get('/Student/:username', 
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
router.get('/Educator/:username', 
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
