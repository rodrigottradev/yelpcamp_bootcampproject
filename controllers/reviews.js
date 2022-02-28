// MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground)
        throw new ExpressError("Review: campground not found", 404);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect("/campgrounds/" + id);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted review!");
    res.redirect("/campgrounds/" + id);
};
