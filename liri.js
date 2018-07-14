require("dotenv").config();
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let request = require("request");
let fs = require("fs");
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);
let programToRun = process.argv[2];
let action = process.argv[3];
let spotifyQuery;

if (programToRun == "spotify-this-song") {
    spotifyThisSong();
} else if (programToRun == "my-tweets") {
    myTweets();
} else if (programToRun == "movie-this") {
    if (action) {
        action = action;
    } else {
        action = "Mr. Nobody";
    };
    movieThis();
} else if (programToRun == "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("Invalid Program");
};

function movieThis() {//   * `movie-this`
    request("http://www.omdbapi.com/?t=" + action + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (error) {
            return console.log(error);
        };
        if (JSON.parse(body).Title !== undefined) {
            // console.log(JSON.parse(body));
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Released);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log(JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value);
            console.log("Countries: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log(" ");
        } else {
            console.log("Unable to find Requested Movie. (check spelling) example: 'Forrest Gump'");
            console.log(" ");
        };

    });
};

function doWhatItSays() {//   * `do-what-it-says`
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        let arr = data.split(",");
        // console.log(arr);
        let choice = Math.floor(Math.random()*6);
        // console.log(arr[choice]);
        action = arr[choice];
        if(choice > 2) {
            console.log("***movie-this "+arr[choice]+"***");
            movieThis();
        } else if (choice <= 2){
            console.log("***spotify-this-song "+arr[choice]+"***");
            spotifyThisSong();
        };

    });
};

function myTweets() {//   * `my-tweets`
    let params = { screen_name: 'Chance83526357' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            return console.log(error);
        };
        for (let i = 0; i < tweets.length; i++) {
            let counter = tweets.length - i;
            console.log("---" + (counter) + "---");
            console.log("@" + tweets[i].user.screen_name);
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
            console.log(" ");
        };
    });
};

function spotifyThisSong() {//   * `spotify-this-song`
    if (action) {
        spotifyQuery = action;
    } else {
        spotifyQuery = "The Sign Ace of Base"
    }

    spotify.search({ type: 'track', query: spotifyQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (data.tracks.items[0] !== undefined) {
            // console.log(data);
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
            console.log(" ");
        } else {
            console.log("Unable to find Requested Track. (check spelling) example: 'Cocaine Jesus'");
            console.log(" ");
        }
    });
};
