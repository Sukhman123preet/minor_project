const express =require('express');
const app =express();
const path=require("path");
const { connectMongoose, Educator, Student } = require('./models/schema.js');
const passport = require('passport');
const {intializingPassport}=require("./passportconfig.js");
const expressSession =require("express-session");

connectMongoose();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({secret:"hello",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

intializingPassport(passport);

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


isAuthenticated=(req, res, next) =>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/');
}

app.get('/animation.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'animation.svg'));
});


app.get("/",(req,res)=>{
    // res.render('profile.ejs')
    
    res.render("index.ejs")
})

app.get("/Educator",(req,res)=>{
    let role = req.path.split('/')[1]; 
    console.log(role);
    res.render("sign_up.ejs",{role});
})

app.get("/Student",(req,res)=>{
    let role = req.path.split('/')[1]; 
    console.log(role);
    res.render("sign_up.ejs",{role});
})

app.get('/login',(req, res) => {
    res.render('login.ejs');
});

app.post('/login/Student', passport.authenticate('Student-local', {
    failureRedirect: '/login',
    }),
    async(req,res)=>{
        const user =await Student.findOne({username:req.body.username})
        console.log(" req = ",req.body);
        console.log(" user = ",user);
        res.render("student_homepage",{user});
        
    } 
);

app.post('/login/Educator', passport.authenticate('Educator-local', {
    failureRedirect: '/login',}),
    async(req,res)=>{
        const user = await Educator.findOne({ username: req.body.username });
    
    res.render("educator_homepage",{user});
    }
);

app.get('/profile',async(req,res)=>{
    res.render('profile.ejs');
})



app.post("/signup", async (req, res) => {
    if (req.body.role === "Student") {
        var check_user = await Student.findOne({ username: req.body.username });
        if (check_user) return res.status(400).send("User already exists");
        var user = new Student(req.body);
    } else {
        var check_user = await Educator.findOne({ username: req.body.username });
        if (check_user) return res.status(400).send("User already exists");
         var user = new Educator(req.body);
    }
    await user.save();
    console.log("User created successfully", req.body);
    res.redirect('/login');
});

app.listen(8000,()=>{
    console.log("server started successfully");
})
