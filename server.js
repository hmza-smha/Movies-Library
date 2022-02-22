'use strict';

const KEY = "668baa4bb128a32b82fe0c15b21dd699";
const DATABASE_URL = "postgres://hamza:0000@localhost:5432/moviesdb";
const PORT = 3000;

// Get express from node model
const express = require("express");

// initializing my server
const app = express();

// Get axios so we can send HTTP requests to an API
const axios = require("axios");

// connect to DB, and init the Client
const pg = require("pg");
const client = new pg.Client(DATABASE_URL);

// read data from JSON file
const movies = require("./MovieData/data.json");

// To get the data from the body object, it should be upove the paths
app.use(express.json());

// GET: paths
app.get('/', moviesHandler);
app.get('/favorite', favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/getMovies', getMoviesHandler);
app.get('/company', companyHandler);
app.get('/network', networkHandler);

// POST: paths
app.post("/addMovie", addMovieHandler);

app.use("*", notFoundHandler);
app.use(errorHandler);

function getMoviesHandler(req, res){
    const sql = `SELECT * FROM movies`;

    client.query(sql).then((result) => {
        return res.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}

function companyHandler(request, response){

    const companyID = request.query.companyid;

    axios.get(`https://api.themoviedb.org/${companyID}/company/5?api_key=${KEY}`)
    .then(apiResponse => {

        return response.status(200).json(apiResponse.data);

    }).catch(error => {
        errorHandler(request, response, error);
    });
}

function networkHandler(request, response){

    const networkID = request.query.networkid;

    axios.get(`https://api.themoviedb.org/${networkID}/company/5?api_key=${KEY}`)
    .then(apiResponse => {

        return response.status(200).json(apiResponse.data);

    }).catch(error => {
        errorHandler(request, response, error);
    });
}


function addMovieHandler(req, res){
    const movie = req.body;

    const sql = `INSERT INTO movies(title, release_date, poster_path, overview) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview];

    client.query(sql, values).then((result)=>{
        return res.status(201).json(result.rows);

    }).catch((error) => {
        errorHandler(req, res, error);
    });
}

function searchHandler(req, res){
    // the parameter in URL name should be `title`;
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
        errorHandler(req, res, error);
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

function errorHandler(req, res, error){

    return res.send("Something went wrong!");

    // const err = {
    //     status : 500,
    //     message : error
    // }
    // return res.status(500).send(err);
}

function notFoundHandler(req, res){
    return res.status(404).send("Not Found URL");
}


client.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Listen on ${PORT}`);
    });
});
