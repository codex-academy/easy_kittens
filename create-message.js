module.exports = function createMessage(
        day,
        duration,
        kittenData){
    let message = "";
    message += "We have " + kittenData.kittensArriving + " kittens arriving on Monday. \n"
    message += kittenData.kittensStayingLonger + " kittens are staying longer than " + duration + " days. \n";
    message += "And we have " + kittenData.bookedKittens + " kittens booked in total."
    return message;
}
