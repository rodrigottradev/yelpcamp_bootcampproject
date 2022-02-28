//PLUGINS
const express = require("express");
const multer = require("multer");

// EXPRESS CONFIGURATION
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// CLOUDINARY
const { storage } = require("../cloudinary");

// CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

// MIDDLEWARES
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const upload = multer({ storage });

// MODELS
const Campground = require("../models/campground");

//ROUTES

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array("image"),
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .put(
        isLoggedIn,
        isAuthor,
        upload.array("image"),
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
