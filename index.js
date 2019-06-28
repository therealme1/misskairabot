require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const middlewares = ['admin', 'addUserToDb'];
const contexts = ['args', 'lang', 'mentionedUser'];
const plugins = ['ping']; // default plugins

contexts.forEach(ctx => {
    require(`./context/${ctx}`)(bot);
});
middlewares.forEach(mid => {
    bot.on('message', require(`./middleware/${mid}`));
});
plugins.forEach(plugin => {
    require(`./plguins/default/${plugin}`)(bot);
});

require('./handlers')(bot);
bot.launch();
