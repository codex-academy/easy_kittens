const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/easy_kittens', {
    "useMongoClient": true
});

mongoose.Promise = Promise;

var KittenStay = mongoose.model('KittenStay', {
    name: String,
    arrivalDay: String,
    days: Number
});

module.exports = {
    KittenStay
};
