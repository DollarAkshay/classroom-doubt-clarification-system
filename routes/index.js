const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// CONTROLLERS
let post_controller = require('../controllers/post_controller')
let comment_controller = require('../controllers/comment_controller')
let subject_controller = require('../controllers/subject_controller')

// POSTS ROUTES
router.put('/edit/post/:id', post_controller.edit);
router.delete('/delete/post/:id', post_controller.delete);
router.put('/save/post/:id', post_controller.save);
router.put('/unsave/post/:id', post_controller.unsave);
router.put('/vote/post/:id', post_controller.vote);
router.get('/check/states/posts', post_controller.check);

// COMMENTS ROUTES
router.put('/edit/comment/:id', comment_controller.edit);
router.delete('/delete/comment/:id', comment_controller.delete);
router.put('/save/comment/:id', comment_controller.save);
router.put('/unsave/comment/:id', comment_controller.unsave);
router.put('/vote/comment/:id', comment_controller.vote);
router.get('/check/states/comments', comment_controller.check);

// SUBBREDDIT ROUTES
router.get('/submit/check/:subject', subject_controller.check_subject);
router.put('/subscribe/:subject', subject_controller.subscribe);
router.put('/unsubscribe/:subject', subject_controller.unsubscribe);

module.exports = router;