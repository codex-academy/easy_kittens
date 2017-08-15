var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/easy_kittens', {
    "useMongoClient" : true
});

mongoose.Promise = Promise;

var KittenStay = mongoose.model('KittenStay',
{
    name: String,
    arrivalDay : String,
    days : Number
});

function kittensArrivingOn(day){

}

function kittensStayingMoreThan(numberOfDays){

}

function bookedKittens(){

}

function createReport(day, duration){

}

/*
 * This should print:
 * We have 3 kittens arriving on Monday.
 * 5 kittens are staying longer than 3 days
 * And we have 13 kittens booked in total
 */

 createReport("Monday", 3);

 mongoose.connection.close();
