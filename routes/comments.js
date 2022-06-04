const   express = require('express'),
        router  = express.Router({mergeParams: true}),
        Print    = require('../models/print'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new.ejs", {print: foundPrint})
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundPrint.comments.push(comment);
                    foundPrint.save();
                    res.redirect("/prints/" + foundPrint._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('comments/edit.ejs', {print_id: req.params.id, comment: foundComment})
        }
    })
})

router.put('/:comment_id', middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/prints/' + req.params.id);
        }
    })
})

router.delete('/:comment_id', middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            req.flash('error', "There are something wrong!!!");
            res.redirect('/prints' + req.params.id);
        } else {
            req.flash('success', "Your comment was deleted.");
            res.redirect('/prints/' + req.params.id);
        }
    })
})

module.exports = router;