const   express = require('express'),
        router  = express.Router(),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, './public/upload/');
            },
            filename: function(req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        imageFilter = function(req, file, callback) {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new Error('Only jpg, jpeg, png and gif'), false);
            }
            callback(null, true);
        },
        upload  = multer({storage: storage, fileFilter: imageFilter}),
        middleware = require('../middleware'),
        Print   = require('../models/print'),
        Cart    = require('../models/cart')
        User   = require('../models/user'),
        Order   = require('../models/order');

router.get("/", function(req, res) {
    // res.render("index.ejs", {prints:prints})
    Print.find({}, function(err, allPrints){
        if(err) {
            console.log(err);
        } else {
            res.render("print/index.ejs", {prints: allPrints})
        }
    })
});

router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    req.body.print.image = '/upload/' + req.file.filename;
    req.body.print.author = {
        id: req.user._id,
        username: req.user.username
    };
    Print.create(req.body.print, function(err, newlyAdded) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/prints");
        }
    });
    // res.redirect("/prints");
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("print/new.ejs");
});

router.get("/:id", (req, res) => {
    Print.findById(req.params.id).populate('comments').exec(function(err, foundPrint) {
    // Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err);
        } else {
            res.render("print/show.ejs", {print: foundPrint});
        }
    });
});

router.get('/:id/edit', middleware.checkPrintOwner, (req, res) => {
    Print.findById(req.params.id, (err, foundprint) => {
        if(err) {
            console.log(err)
        } else {
            res.render('print/edit.ejs', {print: foundprint})
        }
    })
})

router.put('/:id', upload.single('image'), (req,res) => {
    if(req.file) {
        req.body.print.image = '/upload/' + req.file.filename;
    }
    Print.findByIdAndUpdate(req.params.id, req.body.print, (err, updatedPrint) => {
        if(err) {
            console.log(err)
            res.redirect('/prints/');
        } else {
            res.redirect('/prints/' + req.params.id);
        }
    })
})

router.get('/:id/add-to-cart', middleware.isLoggedIn, function(req,res){
    Print.findById(req.params.id, function(err,foundPrint){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            Cart.findOne({user: {id: req.user._id}},function(err, foundCart){
                if(err){
                    console.log(err);
                }
                else{
                    if(!foundCart){
                        const newCart = {user:{id: req.user._id}};
                        Cart.create(newCart, function(err, newCart){
                            if(err){
                                console.log(err)
                            }
                            else{
                                newCart.product.push(foundPrint);
                                newCart.totalPrice =0;
                                newCart.totalPrice += foundPrint.price;
                                newCart.totalQty = 0;
                                newCart.totalQty++;
                                newCart.save();
                                req.flash('success','Product add to your cart');
                                res.redirect('/prints');
                            }
                        });
                    }
                    else{
                        foundCart.product.push(foundPrint);
                        foundCart.totalPrice += foundPrint.price;
                        foundCart.totalQty++;
                        foundCart.save();
                        req.flash('success','Product add to your cart');
                        res.redirect('/prints');
                    }
                }
            });
        }
    });
});

// router.get('/cart', middleware.isLoggedIn, function(req, res){
//     Cart.findOne({user: {id: req.user._id}}).populate("product").populate("user").exec(function(err, foundCart){
//         if(err){
//             console.log(err);
//         } else{
//             res.render('cart/cart.ejs', {showCart: foundCart});
//             console.log(foundCart);
//         }
//     });
// });

// router.get('/cart', middleware.isLoggedIn, () => {
//     if(err) {
//         console.log(err)
//     } else {
//         res.render('cart/cart.ejs')
//     }
// })

router.get('/:id/order', middleware.isLoggedIn, function(req, res){
    Cart.findOne({user: {id: req.user._id}}).populate("user").exec(function(err, foundCart){
        if(err){
            console.log(err);
        }
        else{
            foundCart.user.address = req.user.address;
            foundCart.user.phone = req.user.phone;
            res.render('order/order.ejs', {foundCart: foundCart});
        }
    });
});

router.post('/order/:id/createOrder',middleware.isLoggedIn, function(req, res){
    Cart.findById(req.params.id).populate("product").populate("user").exec(function(err, foundCart){
        if(err){
            console.log(err);
        }
        else{
            Order.create({user: {id: req.user._id}}, function(err, newOrder){
                if(err){
                    console.log(err);
                }
                else{
                    newOrder.cart.push(foundCart);
                    newOrder.phone = req.user.phone;
                    newOrder.address = req.user.address;
                    newOrder.paymentMethod = req.body.paymentMethod;
                    newOrder.save();
                    req.flash('success','Order success');
                    res.redirect('/');
                }
            });
        }
    })
})

router.delete('/:id', middleware.checkPrintOwner, (req, res) => {
    Print.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/prints/');
        } else {
            res.redirect('/prints/')
        }
    })
})

module.exports = router;