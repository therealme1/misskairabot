require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const middlewares = ['admin', 'addUserToDb'];

require('./context/lang')(bot);
require('./handlers')(bot);
middlewares.forEach(mid => {
    bot.on('message', require(`./middleware/${mid}`));
});

bot.launch();
