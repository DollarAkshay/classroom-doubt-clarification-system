const express = require("express");
const router = express.Router();

// CONTROLLERS
let subject_controller = require("../controllers/subject_controller")
let comment_controller = require("../controllers/comment_controller")
let submit_controller = require("../controllers/submit_controller")

// ROUTES
router.get('/:subject', subject_controller.get_all);
router.get('/:subject/:id/comments', subject_controller.get_post);
router.get('/:subject/submit/post', submit_controller.subject_post_view);
router.get('/:subject/submit/link', submit_controller.subject_link_view);

router.post('/:subject/submit/post', submit_controller.subject_post);
router.post('/:subject/:id/comments', comment_controller.comment);
router.post('/:subject/submit/link', submit_controller.subject_link);
router.post('/:subject/search', submit_controller.subject_search);

router.get('/:subject/:id', function (req, res) {
    res.redirect(`/r/${req.params.subject}/${req.params.id}/comments`)
});

module.exports = router