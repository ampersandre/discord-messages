const moment = require('moment');
const Papa = require('papaparse');
const data = require('./discord-data.json');

const users = data.meta.users;
const usersByIndex = {};
const messagesByUsersByDay = {};
const dates = {};

data.meta.userindex.forEach((uid, i) => {
    usersByIndex[i] = users[uid].name;
});
Object.keys(usersByIndex).forEach((index) => {
    const username = usersByIndex[index];
    messagesByUsersByDay[username] = {};
});

const discordKey = Object.keys(data.data)[0];
const messageData = data.data[discordKey];

Object.keys(messageData).forEach((messageKey) => {
const message = messageData[messageKey];
const date = moment(message.t).format('YYYY-MM-DD');
const user = usersByIndex[message.u];

dates[date] = true;
if (!messagesByUsersByDay[user][date]) {
    messagesByUsersByDay[user][date] = 0;
}

messagesByUsersByDay[user][date] = messagesByUsersByDay[user][date] + 1;
});

const sortedDates = Object.keys(dates).sort((a, b) => {
if(a < b) { return -1; }
if(a > b) { return 1; }
return 0;
});

const csvData = Object.keys(messagesByUsersByDay).map(username => {
const row = {
    name: username,
};
sortedDates.forEach(date => {
    row[date] = messagesByUsersByDay[username][date] || 0;
});

return row;
});
var csv = Papa.unparse(csvData);

console.log(csv);