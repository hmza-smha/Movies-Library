'use strict';

// Get express from node model
const express = require("express");
const axios = require("axios");

// read data from JSON file
const movies = require("./MovieData/data.json");

const KEY = "668baa4bb128a32b82fe0c15b21dd699";

// initializing my server
const app = express();

app.get('/', moviesHandler);
app.get('/favorite', favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/searchMovies', searchMoviesHandler);

app.use("*", notFoundHandler);
app.use(errorHandler);

function searchMoviesHandler(req, res){
    const title = req.query.title

    let results = [];

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${title}`)
    .then(apiResponse=> {

        apiResponse.data.results.map(value => {
            let oneResult = new Movie(value.id, value.title,value.release_date, value.poster_path, value.overview);
            results.push(oneResult);
        });

        return res.status(200).json(results);
    })
    .catch(error => {
        errorHandler(req, res,error);
    })

}


function trendingHandler(request, response){
    let result = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${KEY}&language=en-US`)
    .then(apiResponse => {
        apiResponse.data.results.map(value => {
            let oneResult = new Movie(value.id, value.title,value.release_date, value.poster_path, value.overview);
            result.push(oneResult);
        });

        return response.status(200).json(result);

    }).catch(error => {
        errorHandler(request, response, error);
    });
}

function errorHandler(request, response, error){

    const err = {
        status : 500,
        message : error
    }

    return res.status(500).send(err);
}

function favoriteHandler(req, res) {
    return res.send("Welcome to Favorite Page");
}

function moviesHandler(request, response) {
    let oneMovies = new Movie(movies.title, movies.poster_path, movies.overview);
    return response.status(200).json(oneMovies);
};

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandler(error,req,res){
    const err = {
        status : 500,
        message : error
    }
    return res.status(500).send(err);
}

function notFoundHandler(req, res){
    return res.status(404).send("Not Found");
}

app.listen(8000, () => {
    console.log("Listen on 8000");
});