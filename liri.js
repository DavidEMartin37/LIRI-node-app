require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");
var action = process.argv[2];
var value = process.argv.slice(3).join(" ");
choices();
function choices() {
switch (action) {
  case "concert-this":
    concertThis(value);
    break;

  case "spotify-this-song":
    spotifyThis(value);
    break;

  case "movie-this":
    movieThis(value);
    break;

  case "do-what-it-says":
    doThis();
    break;
  }
}
function concertThis() {
  
  var concertQueryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
  console.log(concertQueryUrl);
  axios.get(concertQueryUrl)
    .then(function (response) {
    //  console.log(response.data);
      for (var i = 0; i < response.data.length; i++) {
        console.log("Venue Name " + response.data[i].venue.name);
        console.log("Venue Location " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
        console.log("Event Date " + response.data[i].datetime);
        console.log("Event Date " + moment(response.data[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY"));
      };
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else {
        console.log("Error", error.message);
      };
      console.log(error.config);
    });
};
function spotifyThis() {

  if (value === "" || value === undefined) {
    value = "The Sign";
  }
  spotify
    .search({ type: 'track', query: value })
    .then(function (response) {
      //  console.log(response.tracks.items)
      var songData = response.tracks.items;
      for (i = 0; i < songData.length; i++) {
        console.log("Artist: " + songData[i].artists[0].name);
        console.log("Song Name: " + songData[i].name);
        console.log("Preview Link: " + songData[i].preview_url);
        console.log("Album Name: " + songData[i].album.name);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};
function movieThis() {
  
  if (value === "" || value === undefined) {
    value = "Mr. Nobody";
    console.log("If you haven't watched 'Mr. Nobody,' then you should: It's on Netflix!")
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";
  console.log(queryUrl);
  axios.get(queryUrl)
    .then(function (response) {
      // console.log(response.data);
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country Produced In: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
function doThis() {

  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    action = dataArr[0]; 
    value = dataArr[1]; 
    choices();
  })
}
