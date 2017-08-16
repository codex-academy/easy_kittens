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

function kittensBookedForWeekday(weekday){
    return KittenStay.count({arrivalDay : weekday})
}

function kittensStayingMoreThan(numberOfDays){
    return KittenStay.count({ days : { "$gt" :  numberOfDays } })
}

function bookedKittens(){
    return KittenStay.count({});
}

function createMessage(
        day,
        duration,
        kittensArriving,
        kittensStayingLonger,
        bookedKittens){
    let message = "";
    //
    message += "We have " + kittensArriving + " kittens arriving on Monday. \n"
    message += kittensStayingLonger + " kittens are staying longer than " + duration + " days. \n";
    message += "And we have " + bookedKittens + " kittens booked in total"
    return message;
}

async function createReport(day, duration){
    let bookedForDay = await kittensBookedForWeekday(day)
    let poorKittens = await kittensStayingMoreThan(duration)
    let booked = await bookedKittens();

    //console.log(bookedForDay);
    //console.log(poorKittens);
    //console.log(bookedKittens);

    let message = createMessage(day, duration, bookedForDay, poorKittens, booked);

    //console.log(message);

    return message;
}


(async function (){
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
