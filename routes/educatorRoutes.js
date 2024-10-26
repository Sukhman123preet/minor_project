const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Educator, EducatorDetails } = require('../models/schema.js');


// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/');
};

// Routes related to educators
router.get('/:id', isAuthenticated, async (req, res) => {
    const user = await Educator.findOne({ _id: req.params.id });
    res.render('profile.ejs', { user });
});

router.get('/check_details/:user_name', async (req, res) => {
    const educator = await EducatorDetails.findOne({ educatorName: req.params.user_name });
    if (!educator) {
        res.render('./details/educator.ejs', { user_name: req.params.user_name });
    } else {
        res.redirect(`/create_test/${req.params.user_name}`);
    }
});

module.exports = router;
