const express = require('express');
const app = express();
const port = 3000;
const prompt = require('prompt-sync')();
const mineflayer = require('mineflayer');

app.get('/', (req, res) => {
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Monitor app listening on port ${port}`);
});

const ip = "damien3000.aternos.me";

let current_bot = null;

current_bot = newbot();

function newbot() {
    const name = "bot1";
    const bot = mineflayer.createBot({
        host: ip,
        username: name,
        port: 49774,
    });

    bot.on('kicked', (reason) => {
        console.log(`Bot was kicked for reason: ${reason}`);
        onKick();
    });

    bot.on('end', () => {
        console.log('Bot disconnected');
        onKick();
    });

    bot.on('error', (err) => {
        console.error('Bot encountered an error:', err);
        onKick();
    });

    // Anti-AFK movement
    bot.on('spawn', () => {
        setInterval(() => {
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
                bot.setControlState('back', true);
                setTimeout(() => {
                    bot.setControlState('back', false);
                }, 1000);
            }, 1000);
        }, 10000); // Move every 10 seconds
    });

    return bot;
}

function onKick() {
    try {
        current_bot = newbot();
    } catch (e) {
        console.error('Error creating new bot:', e);
        setTimeout(() => {
            current_bot = newbot();
        }, 5000); // Retry after 5 seconds
    }
}

console.log(`The Service is successfully started!\n`);