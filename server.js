'use strict';

// Get express from node model
const express = require("express");

// read data from JSON file
const movies = require("./MovieData/data.json");

// initializing my server
const app = express();

app.get('/', moviesHandler);
app.get('/favorite', favoriteHandler);

function favoriteHandler(req, res){
    return res.send("Welcome to Favorite Page");
}

function moviesHandler(request, response){
    let oneMovies = new Movie(movies.title, movies.poster_path,movies.overview);
    return response.status(200).json(oneMovies);
};

function Movie(title, poster_path, overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.listen(3000, () => {
    console.log("Listen on 3000");
});