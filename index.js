require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const middlewares = ['admin', 'addUserToDb'];
const contexts = ['lang', 'mentionedUser'];

contexts.forEach(ctx => {
    require(`./context/${ctx}`)(bot);
});
middlewares.forEach(mid => {
    bot.on('message', require(`./middleware/${mid}`));
});

require('./handlers')(bot);
bot.launch();
