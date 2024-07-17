const express=require("express");
const { route } = require("./listing");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const passport = require("passport");
const usersController=require("../controller/users");

const router=express.Router();

router
.route("/signup")
.get(usersController.renderSignupForm)
.post(wrapAsync(usersController.signup));


router
.route("/login")
.get(usersController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
usersController.login);


router.get("/logout",usersController.logout);
 


module.exports=router;