//PLUGINS
const express = require("express");

// EXPRESS CONFIGURATION
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// CONTROLLERS
const users = require("../controllers/users");

// MODELS
const User = require("../models/user");
const passport = require("passport");

//ROUTES

router
    .route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.createUser));
router
    .route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: "Incorrect username or password",
            failureRedirect: "/login",
        }),
        catchAsync(users.login)
    );
router.get("/logout", users.logout);

module.exports = router;
