require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

require('./context/lang')(bot);
require('./handlers')(bot);

bot.launch();
