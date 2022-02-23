DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies(
id SERIAL PRIMARY KEY,
title VARCHAR(255),
release_date DATE,
poster_path VARCHAR(255),
overview VARCHAR(500), 
comment VARCHAR(255)
);

/* FOR TESTING...
{
    "title": "Spider-Man",
    "release_date": "2021-12-15",
    "poster_path": "poster.jpg",
    "overview": "overview",
    "comment": "This is my comment"
}
*/