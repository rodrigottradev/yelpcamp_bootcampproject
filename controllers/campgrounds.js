// MODELS
const Campground = require("../models/campground");

// PLUGINS
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect("/campgrounds/" + newCampground.id);
};

module.exports.showCampground = async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!foundCampground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { foundCampground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground)
        throw new ExpressError("EDIT: Campground not found", 404);
    res.render("campgrounds/edit", { foundCampground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect("/campgrounds/" + id);
    }
    const toModifyCampground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    toModifyCampground.images.push(...imgs);
    await toModifyCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await toModifyCampground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
        await toModifyCampground.save();
    }
    req.flash("success", "Successfully updated campground");
    res.redirect("/campgrounds/" + id);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect("/campgrounds/" + id);
    }
    const campgroundToDelete = await Campground.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted campground!");
    res.redirect("/campgrounds");
};
