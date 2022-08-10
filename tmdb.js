const express = require('express');
const router = express.Router();


const { Tmdb } = require('tmdb');


const apiKey  = '11df31d6a6ca0ba9a5a48329717c59bc';


// const MovieDB = require('node-themoviedb');
// // ES6 Style
// // import MovieDB from 'node-themoviedb';
// const mdb = new MovieDB(apiKey);


const tmdb = new Tmdb(apiKey);




router.get('/tmdb/moviedata/:movieid', async (req, res) => {
try{

  const name = req.params.movieid;
    // var movie = await tmdb.getMovie(1);
    // movies = movie['results'];


   var movie = await tmdb.get('movie/'+name);
   var movievid = await tmdb.get('movie/'+name+'/videos');

  var obj = {};


  obj['name'] = movie['title'];

  if(movievid["results"][0]){
  obj['trailer'] = movievid["results"][0]["key"];
  }

  obj['des'] = movie['overview'];
  obj['popularity'] = movie['popularity'];
  obj['tagline'] = movie['tagline'];
  obj['runtime'] = movie['runtime'];
  obj['vote'] = movie['voteAverage'];
  obj['poster'] = "https://image.tmdb.org/t/p/original"+movie['backdropPath'];
  obj['thumb'] = "https://image.tmdb.org/t/p/w500"+movie['posterPath'];

  if(movie['genres'][0]){
  obj['genre'] = movie['genres'][0]['id'];
  obj['genrename'] = movie['genres'][0]['name'];
  }
  
  obj['tmdb'] = movie['id'];
 
   res.send(obj );
    // res.send(movie);
    console.log();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  
});


router.get('/tmdb/searchmovie', async (req, res) => {
try{

  const name = req.query.name;
  const data = await searchMovie(name);
     res.send(data);

    // console.log();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  
});


const searchMovie = async (name) =>{
  // var movie = await tmdb.getMovie(1);
   var movie = await tmdb.get('search/movie', {
    query: name,
    // year:'2021'
   });

movies = movie['results'];

var finaldata  = [];

for (var element of movies) {
 var obj = {};


   var movie = await tmdb.get('movie/'+element['id']);
   var movievid = await tmdb.get('movie/'+element['id']+'/videos');

  obj['name'] = movie['title'];

  if(movievid["results"][0]){
  obj['trailer'] = movievid["results"][0]["key"];
  }

  obj['des'] = movie['overview'];
  obj['popularity'] = movie['popularity'];
  obj['vote'] = movie['voteAverage'];
  obj['tagline'] = movie['tagline'];
  obj['runtime'] = movie['runtime'];
  obj['poster'] = "https://image.tmdb.org/t/p/original"+movie['backdropPath'];
  obj['thumb'] = "https://image.tmdb.org/t/p/w500"+movie['posterPath'];

  if(movie['genres'][0]){
  obj['genre'] = movie['genres'][0]['id'];
  obj['genrename'] = movie['genres'][0]['name'];
  }

  obj['tmdb'] = movie['id'];
  obj['relasedate'] = movie['releaseDate'];

// console.log(movie)

  finaldata.push(obj);
  }
  // console.log('done finding');
  return  new Promise((resolve, reject) => {
  resolve(finaldata);
});

}



router.get('/tmdb/searchserie', async (req, res) => {
try{

  const name = req.query.name;
  const data = await searchSerie(name);
     res.send(data);

    // console.log();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  
});


const searchSerie = async (name) =>{
  // var movie = await tmdb.getMovie(1);
   var movie = await tmdb.get('search/tv', {
    query: name,
   });

movies = movie['results'];

var finaldata  = [];

for (var element of movies) {
 var obj = {};


   var movie = await tmdb.get('tv/'+element['id']);
   var movievid = await tmdb.get('tv/'+element['id']+'/videos');

  obj['name'] = movie['name'];

  if(movievid["results"][0]){
  obj['trailer'] = movievid["results"][0]["key"];
  }

  obj['des'] = movie['overview'];
  obj['popularity'] = movie['popularity'];
  obj['vote'] = movie['voteAverage'];
  obj['tagline'] = movie['tagline'];
  obj['runtime'] = movie['runtime'];
  obj['poster'] = "https://image.tmdb.org/t/p/original"+movie['backdropPath'];
  obj['thumb'] = "https://image.tmdb.org/t/p/w500"+movie['posterPath'];
  obj["relasedate"] = movie["firstAirDate"];

  if(movie['genres'][0]){
  obj['genre'] = movie['genres'][0]['id'];
  obj['genrename'] = movie['genres'][0]['name'];
  }

  obj['tmdb'] = movie['id'];


  finaldata.push(obj);
  }
  console.log('done finding');
  return  new Promise((resolve, reject) => {
  resolve(finaldata);
});

}



module.exports = router;
