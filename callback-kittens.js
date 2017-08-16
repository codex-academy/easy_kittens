const mongoose = require('mongoose');
const createMessage = require('./create-message');

const models = require('./models');
const KittenStay = models.KittenStay;

function kittensBookedForWeekday(weekday, cb){
    return KittenStay.count({arrivalDay : weekday}, cb);
}

function kittensStayingMoreThan(numberOfDays, cb){
    return KittenStay.count({ days : { "$gt" :  numberOfDays } }, cb);
}

function bookedKittens(cb){
    return KittenStay.count({}, cb);
}

function createReport(day, duration, cb){

    kittensBookedForWeekday(day, function(err, bookedForDay){
        if (err){
            return cb(err);
        }
        kittensStayingMoreThan(duration, function(err, poorKittens){
            if (err){
                return cb(err);
            }
            bookedKittens(function(err, bookedKittens){
                if (err){
                    return cb(err);
                }
                let kittenData = {
                    kittensArriving : bookedForDay,
                    kittensStayingLonger : poorKittens,
                    booked : bookedKittens
                };
                let message = createMessage(day, duration, kittenData);
                cb(null, message);
            });
        });
    });

}

createReport("Monday", 3, function(err, message){
    console.log("Callback Kittens message");
    console.log("########################");
    console.log(message);
    mongoose.connection.close();
});




// function createReport(day, duration){
//     var reportString = "We have ";
//
//     let bookedForDay = kittensBookedForWeekday(day)
//     let kittensStaying = kittensStayingMoreThan(duration);
//     let booked = bookedKittens();
//
//     return Promise.all([
//         bookedForDay,
//         kittensStaying,
//         booked], function(results){
//         console.log("=====");
//         console.log(results);
//
//         let bookingsForWeek = results[0];
//         let poorKittens = results[1];
//         let allKittens = results[2];
//
//         let message = "";
//
//         message += "We have " + bookedForDay + " kittens arriving on Monday."
//         message += poorKittens + " kittens are staying longer than " + duration + " days. ";
//         message += " And we have " + allKittens.length + " kittens booked in total"
//         return message;
//         //console.log(message);
//     });
//
//     //return reportString;
// }


/*
 * This should print:
 * We have 3 kittens arriving on Monday.
 * 5 kittens are staying longer than 3 days
 * And we have 13 kittens booked in total
 */

// bookedKittens().then(function(kittens){
//     console.log("*******");
//     console.log(kittens);
// });
//
// kittensBookedForWeekday("Wednesday")
//     .then(function(kittenCount){
//         console.log("===========");
//         console.log(kittenCount);
//     })
//     .catch(function(err){
//         console.log(err);
//     })
//
// kittensStayingMoreThan(8).then(function(kittens){
//     console.log(kittens);
// });

//createReport("Monday", 3);
