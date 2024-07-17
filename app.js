if(process.env.NODE_ENV!="production")
{
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./Models/user.js");

const listingsRouter=require("./Routes/listing.js");
const reviewsRouter=require("./Routes/review.js");
const userRouter=require("./Routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
//const MongoLink = "mongodb://127.0.0.1:27017/Wanderlust";

const dbUrl=process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
      await mongoose.connect(dbUrl)
    };

    const store=MongoStore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    });

    store.on("error",()=>{
        console.log("ERROR in MONGO SESSION STORE",err);
    });

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true
    }, 
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    let fakeUser=new User({
        email:"mai@gmail.com",
        username:"mavi11",
    });
    let registeredStudent=await User.register(fakeUser,"loworld");
    res.send(registeredStudent);
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
    console.log(err);
});

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
});

