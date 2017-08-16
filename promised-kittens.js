const mongoose = require('mongoose');
const createMessage = require('./create-message');
const models = require('./models');
const KittenStay = models.KittenStay;

function kittensBookedForWeekday(weekday) {
    return KittenStay.count({
        arrivalDay: weekday
    });
}

function kittensStayingMoreThan(numberOfDays) {
    return KittenStay.count({
        days: {
            "$gt": numberOfDays
        }
    });
}

function bookedKittens() {
    return KittenStay.count({});
}

function createReport(day, duration) {
    let bookedForDay = kittensBookedForWeekday(day);
    let poorKittens = kittensStayingMoreThan(duration);
    let kittens = bookedKittens();

    return Promise.all([bookedForDay, poorKittens, kittens])
        .then(function(results) {
            console.log("Promised kitten");
            console.log("###############");
            let message = createMessage(day, duration, {
                kittensArriving: results[0],
                kittensStayingLonger: results[1],
                bookedKittens: results[2]
            });

            return message
        });
}

createReport("Monday", 3)
    .then(function(message) {
        console.log(message);
        mongoose.connection.close();
    });
