// const fetch=require('node-fetch');
// // import fetch from "node-fetch";
// const TelegramBot=require('node-telegram-bot-api');

// // API URL
// const apiURL='https://prod-api.kosetto.com/lists/recently-joined';

// // Telegram Bot API Token and Group Chat ID
// const botToken='6417528779:AAE-MztIu0864iUTDLmh81gFzooRUTwN9yA';
// 


// // Initialize Telegram Bot
// const bot=new TelegramBot(botToken, { polling: false });

// // Function to send a message to the Telegram group
// const sendMessage=(text) => {
//     console.log('reached here')
//     bot.sendMessage(groupChatId, text)
//         .then(() => {
//             console.log('Message sent successfully to the Telegram group.');
//         })
//         .catch((error) => {
//             console.error('Failed to send message to the Telegram group:', error.message);
//         });
// };

// // // Function to fetch data from the API and send it to the group
// // const fetchDataAndSendMessage=() => {
// //     fetch(apiURL)
// //         .then((response) => response.json())
// //         .then((data) => {
// //             const message=`*${data.users} new members joined the group.*\n\n`;
// //             // console.log(data);
// //             sendMessage(message);

// //         })
// //         .catch((error) => {
// //             console.error('An error occurred while fetching data:', error.message);
// //         });
// // };
// const fetchDataAndSendMessage=() => {
//     fetch(apiURL)
//         .then((response) => response.json())

//         .then((data) => {
//             const message=`${data.users} new members joined the group.\n\n`;
//             sendMessage(message);
//             console.log(message)
//             const user=JSON.parse(data.users)
//             sendMessage(user, 'joined the group');
//         })
//         .catch((error) => {
//             console.error('An error occurred while fetching data:', error.message);
//         });
// };
// async function getapi(apiURL) {

//     // Storing response
//     const response=await fetch(apiURL);

//     // Storing data in form of JSON
//     var data=await response.json();
//     console.log(data);
//     if (response) {
//         hideloader();
//     }
//     show(data);
// }
// // Calling that async function
// getapi(apiURL);


// // Call fetchDataAndSendMessage every 20 seconds
// //setInterval(fetchDataAndSendMessage, 10000);
// function sendTelegramMessage(chat_id, text, bot_token) {
//     const url=`https://api.telegram.org/bot${bot_token}/sendMessage`;

//     const payload={
//         chat_id: chat_id,
//         text: text,
//         disable_notification: true
//     };

//     return fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//     })
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch(error => console.error('Error:', error));
// }

// // Usage:
// //sendTelegramMessage(groupChatId, message, botToken);
// import json
// const time=require('time')
const JSON=require('json')
const fs=require('fs')
const fetch=require('node-fetch')
const groupChatId='1586014380';
const botToken='6417528779:AAE-MztIu0864iUTDLmh81gFzooRUTwN9yA';
// import time
// import fetch from 'node-fetch';
// import fs from 'fs';

const API_URL='https://prod-api.kosetto.com/lists/recently-joined';
const DATA_FILE='fetched_data.json';

// Fetch users from the API endpoint
async function fetchUsers() {
    const response=await fetch(API_URL);
    const data=await response.json();
    return data.users;
}
console.log(fetchUsers())

function sendTelegramMessage(chat_id, text, bot_token) {
    const url=`https://api.telegram.org/bot${bot_token}/sendMessage`;

    const payload={
        chat_id: chat_id,
        text: text,
        disable_notification: true
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

// Save data to a local JSON file
function saveDataToDisk(data) {
    const fileData=JSON.stringify(data, null, 2);
    fs.writeFileSync(DATA_FILE, fileData);
}
// Load data from a local JSON file
function loadDataFromDisk() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const rawData=fs.readFileSync(DATA_FILE, 'utf8'); // Explicitly specify encoding
            console.log(rawData);
            return JSON.parse(rawData);
        }
    } catch (error) {
        fetchUsers
        console.error('Error while loading data:', error);
    }
    return [];
}

// Main loop
async function mainLoop() {
    const prevUsers=loadDataFromDisk();  // Load previously fetched data

    while (true) {
        const users=await fetchUsers();

        // Compare with previously fetched data
        const newUsers=users.filter(user =>
            !prevUsers.some(prevUser => prevUser.id===user.id)
        );

        if (newUsers.length>0) {
            console.log(`Found ${newUsers.length} new users.`);
            // You can handle the alert logic here.
            sendTelegramMessage(groupChatId, `{newUsers}`, botToken)
            // Append new users to previous users and save to disk
            const updatedUsers=[...prevUsers, ...newUsers];
            saveDataToDisk(updatedUsers);
        }

        await new Promise(resolve => setTimeout(resolve, 7000)); // 7 seconds sleep time
    }
}

mainLoop();