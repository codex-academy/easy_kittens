# Easier kittens

`'Taming that NodeJS callbacks kittens.'` - Kittens are cute, but they got nails!

Exploring:

* Callbacks
* Promises
* async/await

## The brief

Your local kitten cattery needs to send a daily email report. That looks like this:

`We have 3 kittens arriving on Monday.
5 kittens are staying longer than 3 days
And we have 13 kittens booked for the week.`

Write a function called `createReport` that can read data from MongoDB to create the string above for any day of the week. The function takes two parameters `weekDay` (the week day) and `duration` (how long a kitten is booked in for).
