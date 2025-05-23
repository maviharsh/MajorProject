const User=require("../Models/user");


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
 };

 module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Welcome To Wanderlust");
        res.redirect("/listings");
    })
    }
    catch(e)
    {
       req.flash("error",e.message);
       res.redirect("/signup");
       
    }
 };

 module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login");
 };

 module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    //console.log(redirectUrl);
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err)
        {
            return next(err);
        }
        else{
        req.flash("success","You Are Logged Out Successfully");
        res.redirect("/listings");
        }
    });
   
};