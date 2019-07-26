let Subject = require("../models/subject");
let Post = require("../models/post");
let Profile = require("../models/profile");

exports.subject_post_view = function (req, res) {
    let subscribed = false
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Profile.find({
        username: req.session.user,
        subscribed: req.params.subject,
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            // res.send("Unable to find subject state")
            return;
        } else {
            subscribed = true
        }
    }).then(function () {
        Subject.find({
            name: req.params.subject
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.render('./subject/subject_post', {
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.subject_post = function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: "post",
        subject: req.params.subject,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subject}] post submitted!`)
        res.redirect(`/r/${req.params.subject}`)
    })
}
exports.subject_link_view = function (req, res) {
    let subscribed = false;
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });


    Profile.find({
        username: req.session.user,
        subscribed: req.params.subject,
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            // res.send("Unable to find subject state")
            return;
        } else {
            subscribed = true
        }
    }).then(function () {
        Subject.find({
            name: req.params.subject
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.render('./subject/subject_link', {
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.subject_link = function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: type,
        link: req.body.link,
        subject: req.params.subject,
    }).save(function (err, doc) {
        if (err) throw error;

        console.log(`[${req.params.subject}] link submitted!`)
        res.redirect(`/r/${req.params.subject}`)
    })
}

exports.subject_search = function (req, res) {
    let subject = undefined
    let posts = undefined
    let subscribed = false
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Subject.find({
        name: req.params.subject
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            subject = doc[0]
        }
    }).then(function () {
        Profile.find({
            username: req.session.user,
            subscribed: req.params.subject,
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                // res.send("Unable to find subject state")
                return;
            } else {
                subscribed = true
            }
        }).then(function () {
            Post.find({
                $and: [{
                        subject: req.params.subject
                    },
                    {
                        title: {
                            $regex: '.*' + req.body.query + '.*',
                            $options: 'i'
                        }
                    }
                ]
            }).sort({
                votes: '-1'
            }).exec(function (err, result) {
                if (err) throw err;
                if (result.length) {
                    posts = result
                }

                console.log(`[${req.params.subject}] searching for posts which contain '{${req.body.query}}'`)
                res.render("./subject/subject_search", {
                    info: subject,
                    posts: result,
                    karma: karma,
                    state: subscribed,
                    query: req.body.query,
                    isAuth: req.isAuthenticated(),
                })
            })
        })
    })
}


// SUBMITING A POST
exports.front_post = function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.text,
        username: req.session.user,
        type: "post",
        subject: req.body.subject,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[Frontpage] post submitted to [${req.body.subject}]`)
        res.redirect(`/r/${req.body.subject}/${doc._id}/comments`);
    });
}

// SUBMITING A LINK
exports.front_link = function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        link: req.body.link,
        username: req.session.user,
        type: type,
        subject: req.body.subject,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[Frontpage] link submitted to [${req.body.subject}]`)
        res.redirect(`/r/${req.body.subject}/${doc._id}/comments`);
    });
}


// SUBMITING A SUBREDDIT
exports.subject = function (req, res) {
    Profile.update({
            username: req.session.user
        }, {
            $push: {
                owned: req.body.subject
            }
        },
        function (err, doc) {
            if (err) throw err;

        }).then(function () {
        Subject({
            name: req.body.subject,
            description: req.body.description
        }).save(function (err, doc) {
            if (err) throw err

            console.log(`[Frontpage] ${req.body.subject} subject created`)
            res.redirect(`/r/${req.body.subject}`);
        });
    });
}

// SEARCHING FOR A POST
exports.front_search = function (req, res) {
    let subscribed = undefined;
    let subjects = undefined;
    let posts = undefined;
    let karma = 0;

    Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;
            if (result.length) {
                subscribed = result[0]['subscribed'];
                karma = result[0]['karma_post'] + result[0]['karma_comment']
            }
        })
        .then(function () {
            Subject.find({}, function (err, doc) {
                    if (err) throw err;

                    if (doc.length) {
                        subjects = doc
                    }
                })
                .then(function () {
                    Post.find({
                            title: {
                                $regex: '.*' + req.body.query + '.*',
                                $options: 'i'
                            }
                        })
                        .sort({
                            votes: '-1'
                        })
                        .exec(function (err, result) {
                            if (err) throw err;
                            if (result.length) {
                                posts = result
                            }

                            console.log(`[Frontpage] searching for posts which contain '{${req.body.query}}'`)
                            res.render("./front/front_search", {
                                posts: result,
                                subjects: subjects,
                                subscribed: subscribed,
                                karma: karma,
                                query: req.body.query,
                                isAuth: req.isAuthenticated()
                            })
                        });
                });
        });
}

exports.front_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.render("./front/front_post", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}

exports.front_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.render("./front/front_post", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}
exports.front_link_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.render("./front/front_link", {
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: subscribed
        });
    })
}
exports.subject_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.render("./front/front_subject", {
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: result[0]['subscribed']
        });
    })
}