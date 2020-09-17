var router = require('express').Router()
var passport = require('passport')
router.get('/google',passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/dashboard',failureFlash: true}));

module.exports = router



                            