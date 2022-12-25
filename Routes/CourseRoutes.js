const express = require('express');
const passport = require('passport');
const router = express.Router();
const { createCourse, getCourse, getCoursebyid, updatecourse, deletecourse } = require('../Controllers/Account/Course.Controller');
const upload = require('../MiddleWares/multer')



router.post('/course', [upload.single('content'), passport.authenticate('bearer', { session: false })], createCourse)
router.get('/course', passport.authenticate('bearer', { session: false }), getCourse)
router.get('/course/:id', passport.authenticate('bearer', { session: false }), getCoursebyid)
router.put('/course/:id', [upload.single('content'), passport.authenticate('bearer', { session: false })], updatecourse)
router.delete('/course/:id', passport.authenticate('bearer', { session: false }), deletecourse)


module.exports = router;