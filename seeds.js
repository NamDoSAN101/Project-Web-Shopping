const   mongoose    = require('mongoose'),
        Print       = require('./models/print'),
        User        = require('./models/user'),
        Comment     = require('./models/comment');

// const data = [
//         {
//             name:"Iron man 3", 
//             Artist:"Phantom City Creative", 
//             url:"https://img.kapook.com/u/itsada/movie/1sheet%20SF_re_2.jpg"
//         },
//         {
//             name:"The lord of the rings", 
//             Artist:"Gabz", 
//             url:"https://getreview.today/wp-content/uploads/2021/05/fellowship-1024x767.jpeg"
//         },
//         {
//             name:"Iron man", 
//             Artist:"Marko Manev", 
//             url:"https://upload.wikimedia.org/wikipedia/th/2/20/Ironmanposter.jpg"
//         }
// ];

function seedDB() {
    Print.remove({}, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("Data removal complete");
            // data.forEach(function(seed) {
            //     Print.create(seed, (err, print) => {
            //         if(err) {
            //             console.log(err);
            //         } else {
            //             console.log('New data added!');
            //             // Comment.create({
            //             //     author: "Tony Stark",
            //             //     text: "This is my FAV!"
            //             // }, function(err, comment) {
            //             //     if(err) {
            //             //         console.log(err);
            //             //     } else {
            //             //         print.comments.push(comment);
            //             //         print.save();
            //             //     }
            //             // })
            //         }
            //     })
            // })
        }
    })
}

module.exports = seedDB;