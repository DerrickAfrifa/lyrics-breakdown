const Environment = require("./Environment.js");

const request = require('request');

// MongoDB
const mongod = require('mongodb');
const mongoClient = mongod.MongoClient;

const mongoDbUrl = Environment.MONGO_URI;

let db = null;
let artistCollection = null;
let userCollection = null;
let scoresCollection = null;
let userRelationCollection = null;
let userFavouriteArtistCollection = null;

class DatabaseService {
    // Database connections
    connectToDatabase() {
        if (db === null)
        //Connect to database
            mongoClient.connect(mongoDbUrl, function (err, database) {
                if (err) throw err;
                db = database.db('lt-db');
                artistCollection = db.collection('artists');
                userCollection = db.collection('users');
                scoresCollection = db.collection('scores');
                userRelationCollection = db.collection('relations');
                userFavouriteArtistCollection = db.collection('favouriteArtists');
                console.log('Connected to database ', mongoDbUrl);
            });
        else console.log('Already connected to database!')
    }

    disconnectFromDatabase() {
        db.close();
    }

    isConnectedToDatabase() {
        if (db === null) {
            console.log('You haven\'t connected to the database yet!');
            return false;
        }
        return true;
    }

    // User queries
    doesUsernameExist(username) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {username: username};
                return userCollection.find(query).limit(1).toArray().length > 0;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    doesEmailExist(email_address) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {email_address: email_address};
                return userCollection.find(query).limit(1).toArray().length > 0;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    createUser(country_id, email_address, username, password) {
        if (this.isConnectedToDatabase() && !this.doesUsernameExist(username) && !this.doesEmailExist(email_address)) {
            try {
                let ins = {
                    country_id: country_id,
                    email_address: email_address,
                    username: username,
                    password: password
                };
                let response = userCollection.insertOne(ins);
                return response.insertedCount === 1;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    deleteUserByEmailAddr(email_address) {
        if (this.isConnectedToDatabase() && this.doesUsernameExist(email_address)) {
            try {
                let del = {email_address: email_address};
                let response = userCollection.deleteOne(del);
                return response.deletedCount === 1;
            } catch (err) {
                console.log(err.stack)
            }
        }
        return false;
    }

    deleteUserByUsername(username) {
        if (this.isConnectedToDatabase() && this.doesUsernameExist(username)) {
            try {
                let del = {username: username};
                let response = userCollection.deleteOne(del);
                return response.deletedCount === 1;
            } catch (err) {
                console.log(err.stack)
            }
        }
        return false;
    }

    checkCredentialsEmailAddress(email_address, password) {
        if (this.isConnectedToDatabase())
            try {
                let query = {email_address: email_address, password: password};
                return 1 === userCollection.find(query).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        return false;
    }

    checkCredentialsUsername(username, password) {
        if (this.isConnectedToDatabase())
            try {
                let query = {username: username, password: password};
                return 1 === userCollection.find(query).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        return false;
    }

    getUser(username) {
        if (this.isConnectedToDatabase()) {
            let query = {username: username};
            return userCollection.find(query).toArray();
        }
        return null;
    }

    // Scores queries
    getScores() {
        if (this.isConnectedToDatabase()) {
            try {
                let lim = 10;
                return scoresCollection.find({}).limit(lim).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getHighScores(num_high_scores) {
        if (this.isConnectedToDatabase()) {
            try {
                // sort in descending order
                let sort = {score: -1};
                return scoresCollection.find({}).sort(sort).limit(num_high_scores).toArray();
            }
            catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getScoresByCountry(country_id) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {country_id: country_id};
                return scoresCollection.find(query).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getHighScoresByCountry(country_id, num_high_scores) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {country_id: country_id};
                let sort = {score: -1};
                return scoresCollection.find(query).sort(sort).limit(num_high_scores).toArray();
            }
            catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getScoresByUser(username) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {username: username};
                return scoresCollection.find(query).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getHighScoresByUser(username, num_high_scores) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {username: username};
                let sort = {score: -1};
                return scoresCollection.find(query).sort(sort).limit(num_high_scores).toArray();
            }
            catch (err) {
                console.log(err.stack);
            }
        }
    }

    addScore(username, score) {
        if (this.isConnectedToDatabase())
            try {
                let ins = {username: username, score: score};
                let response = scoresCollection.insertOne(ins);
                return response.insertedCount === 1;
            } catch (err) {
                console.log(err.stack);
            }
        return false;
    }

    // Artist queries
    addArtist(country_id, artist_id, artist_name) {
        if (this.isConnectedToDatabase())
            try {
                let ins = {country_id: country_id, artist_id: artist_id, artist_name: artist_name};
                let response = artistCollection.insertOne(ins);
                return response.insertedCount === 1;
            } catch (err) {
                console.log(err.stack);
            }
        return false;
    }

    deleteArtist(artist_id) {
        if (this.isConnectedToDatabase()) {
            try {
                let del = {artist_id: artist_id};
                let response1 = artistCollection.deleteOne(del);
                let response2 = userFavouriteArtistCollection.deleteMany(del);
                return response1.deletedCount === 1 && response2.deletedCount > 0;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    doesArtistExist(artist_id) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {artist_id: artist_id};
                return artistCollection.find(query).toArray().length === 1;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    getArtistById(artist_id) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {artist_id: artist_id};
                return artistCollection.find(query).toArray();
            }
            catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    getArtistsByCountry(country_id) {
        if (this.isConnectedToDatabase()) {
            try {
                let query = {country_id: country_id};
                return artistCollection.find(query).toArray();
            } catch (err) {
                console.log(err.stack);
            }
        }
        return null;
    }

    addArtistToUserFavourites(artist_id, username) {
        if (this.isConnectedToDatabase() && this.doesArtistExist(artist_id) && this.doesUsernameExist(username)) {
            try {
                let ins = {username: username, artist_id: artist_id};
                let response = userFavouriteArtistCollection.insertOne(ins);
                return response.insertedCount === 1;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }

    deleteArtistFromUserFavourites(artist_id, username) {
        if (this.isConnectedToDatabase() && this.doesArtistExist(artist_id) && this.doesUsernameExist(username)) {
            try {
                let del = {username: username, artist_id: artist_id};
                let response = userFavouriteArtistCollection.deleteOne(del);
                return response.deletedCount === 1;
            } catch (err) {
                console.log(err.stack);
            }
        }
        return false;
    }
}

module.exports = DatabaseService;