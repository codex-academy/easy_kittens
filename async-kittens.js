var mongoose = require('mongoose');
const createMessage = require('./create-message');
const models = require('./models');
const KittenStay = models.KittenStay;

function kittensBookedForWeekday(weekday){
    return KittenStay.count({arrivalDay : weekday})
}

function kittensStayingMoreThan(numberOfDays){
    return KittenStay.count({ days : { "$gt" :  numberOfDays } })
}

function bookedKittens(){
    return KittenStay.count({});
}

async function createReport(day, duration){

    let bookedForDay = await kittensBookedForWeekday(day)
    let poorKittens = await kittensStayingMoreThan(duration)
    let booked = await bookedKittens();
    let message = createMessage(day, duration,
        { kittensArriving : bookedForDay,
          kittensStayingMoreThan : poorKittens,
          bookedKittens : booked});

    return message;
}


(async function (){
    console.log("Async kittens");
    console.log("=============");

    let report = await createReport("Monday", 3);
    console.log(report);
    mongoose.connection.close();
})();

//createReport("Friday", 6)



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
