const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    images: [ImageSchema],
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

CampgroundSchema.post("findOneAndDelete", async function (deletedCampground) {
    if (deletedCampground) {
        await Review.remove({
            _id: {
                $in: deletedCampground.reviews,
            },
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
