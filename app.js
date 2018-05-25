var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");


mongoose.connect("mongodb://localhost/yelpTutorial");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "nenatio es bien mameitio",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//CREATE
app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    });
});


app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});



// COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, function (err, campground) {
      if(err) {
        console.log(err);
      } else {
          res.render("comments/new", {campground: campground});
      }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
   Campground.findById(req.params.id, function (err, campground) {
      if(err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        Comment.create(req.body.comment, function (err, comment) {
           if(err) {
             console.log(err);
           } else {
             campground.comments.push(comment);
             campground.save();
             res.redirect('/campgrounds/' + campground._id);
           }
        });
      }
   });
});


// AUTH ROUTES
// Show register form
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username}); //Newly Created user//
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
app.get("/login", function(req, res) {
   res.render("login");
});
//Handling login logic
app.post("/login", function(req, res) {
    req.send("Login logic goes here");
});



app.listen(3000, function() {
  console.log('app is running in port 3000');
});






 



// HAVE TO GET MAILING ADDRESS AND SEND IT TO THE VA
// 800 741 8387 ext 5384 Celia Spencer from Loma Linda Va.

















