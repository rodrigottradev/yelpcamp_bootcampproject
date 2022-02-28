const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connection open");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const findUsers = async () => {
    listaDeUsuarios = await User.find({});
    const onlyUsersIds = listaDeUsuarios.map((user) => {
        return user._id;
    });
    return onlyUsersIds;
}

const seedDB = async () => {
    await Campground.deleteMany({});
    usuarios = await findUsers();
    let aux = 0;
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        aux = aux > usuarios.length ? aux = 0 : aux;
        const camp = new Campground({
            author: usuarios[aux],
            // let aux = i > (await listaDeUsuarios).length ? (await listaDeUsuarios).length
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, obcaecati at. Ratione sed quos molestias provident, animi sint ducimus officia facilis enim. Impedit adipisci asperiores minus tenetur quasi aut. Ea illo ad, ducimus vel sit aut sunt quos aliquam omnis animi nulla nostrum quisquam suscipit delectus, amet itaque, dolorem consectetur quod similique excepturi totam ex. Laboriosam reiciendis cumque numquam?",
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dlbj0fk4t/image/upload/v1638112306/YelpCamp/ovbhzbm8gykuu5d5tq63.jpg",
                    filename: "YelpCamp/ovbhzbm8gykuu5d5tq63",
                },
                {
                    url: "https://res.cloudinary.com/dlbj0fk4t/image/upload/v1638110258/YelpCamp/yhpxkhkmnqqamppodtig.jpg",
                    filename: "YelpCamp/yhpxkhkmnqqamppodtig",
                },
            ],
        });
        await camp.save();
        aux++;
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
