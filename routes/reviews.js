//PLUGINS
const express = require("express");

// EXPRESS CONFIGURATION
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

//CONTROLLERS
const reviews = require("../controllers/reviews");

// MODELS
const Review = require("../models/review");
const Campground = require("../models/campground");

// MIDDLEWARES
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

//ROUTES

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;

// app.get(
//     "/campgrounds/:campgroundId/reviews/new",
//     catchAsync(async (req, res) => {
//         const { campgroundId } = req.params;
//         const campground = await Campground.findById(campgroundId);
//         if (!campground) {
//             throw new ExpressError("Review: No se encontro el campground", 404);
//         }
//         res.render("reviews/new", { campground });
//         // if (!campground)
//         //     throw new ExpressError(
//         //         "El campground al que intenta hacer una review no existe",
//         //         404
//         //     );
//     })
// );
