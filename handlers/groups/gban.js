const isSuperUser = require('../../utils/super-user');
const { Markup } = require('telegraf');
const db = require('../../db');
// Todo: Marge gmute and gban in one file
module.exports = bot => {
    bot.command('gban', async ctx => {
        const { chat, from } = ctx;
        if (isSuperUser(from.id)) {
            const mentioned = await ctx.getMentioned();
            if (!mentioned.user_id)
                return ctx.reply('Please tell me whom to gban 😈');
            let reason;
            if (ctx.message.reply_to_message) {
                reason = ctx.args().join(' ');
            } else {
                const message = ctx.args();
                message.shift();
                reason = message.join(' ');
            }
            if (reason === '')
                return ctx.reply('😐 Please provide a proper reason.');
            let count = 0,
                failed = 0,
                success = 0;
            db('groups')
                .select('*')
                .then(async groups => {
                    await groups.forEach(async group => {
                        try {
                            group.chat_id !== ctx.chat.id
                                ? bot.telegram.sendMessage(
                                      group.chat_id,
                                      `Incoming global ban for <a href="tg://user?id=${
                                          mentioned.user_id
                                      }">${
                                          mentioned.first_name
                                      }</a>.\nReason: <b>${reason}</b>`,
                                      {
                                          parse_mode: 'Html'
                                      }
                                  )
                                : null;
                            await bot.telegram.kickChatMember(
                                group.chat_id,
                                mentioned.user_id
                            );

                            await db('users')
                                .where({ user_id: mentioned.user_id })
                                .update({
                                    status: 'gbanned',
                                    status_reason: reason
                                });
                            success++;
                        } catch (e) {
                            failed++;
                        }
                        if (count === groups.length - 1) {
                            ctx.reply(
                                `Globally banned <a href="tg://user?id=${
                                    mentioned.user_id
                                }">${
                                    mentioned.first_name
                                }</a> in ${success} chats, failed in ${failed} chats.`,
                                {
                                    parse_mode: 'html'
                                }
                            );
                        }

                        count++;
                    });
                });
        } else {
            ctx.reply(
                "Sorry, this command is limited to bot's super users.",
                Markup.inlineKeyboard([
                    Markup.urlButton(
                        'How to become super user?',
                        `https://t.me/${
                            process.env.BOT_USERNAME
                        }?start=help_superuser`
                    )
                ]).extra()
            );
        }
    });
    bot.command('ungban', async ctx => {
        const { chat, from } = ctx;
        if (isSuperUser(from.id)) {
            const mentioned = await ctx.getMentioned();
            if (!mentioned.user_id)
                return ctx.reply('Please tell me whom to ungban');
            let reason;
            if (ctx.message.reply_to_message) {
                reason = ctx.args().join(' ');
            } else {
                const message = ctx.args();
                message.shift();
                reason = message.join(' ');
            }
            if (reason === '')
                return ctx.reply('😐 Please provide a proper reason.');
            let count = 0,
                failed = 0,
                success = 0;
            db('groups')
                .select('*')
                .then(async groups => {
                    await groups.forEach(async group => {
                        try {
                            group.chat_id !== ctx.chat.id
                                ? bot.telegram.sendMessage(
                                      group.chat_id,
                                      `Incoming global unban for <a href="tg://user?id=${
                                          mentioned.user_id
                                      }">${
                                          mentioned.first_name
                                      }</a>.\nReason: <b>${reason}</b>`,
                                      {
                                          parse_mode: 'Html'
                                      }
                                  )
                                : null;
                            await bot.telegram.unbanChatMember(
                                group.chat_id,
                                mentioned.user_id
                            );

                            await db('users')
                                .where({ user_id: mentioned.user_id })
                                .update({
                                    status: '',
                                    status_reason: reason
                                });
                            success++;
                        } catch (e) {
                            failed++;
                        }
                        if (count === groups.length - 1) {
                            ctx.reply(
                                `Globally unbanned <a href="tg://user?id=${
                                    mentioned.user_id
                                }">${
                                    mentioned.first_name
                                }</a> in ${success} chats, failed in ${failed} chats.`,
                                {
                                    parse_mode: 'html'
                                }
                            );
                        }

                        count++;
                    });
                });
        } else {
            ctx.reply(
                "Sorry, this command is limited to bot's super users.",
                Markup.inlineKeyboard([
                    Markup.urlButton(
                        'How to become super user?',
                        `https://t.me/${
                            process.env.BOT_USERNAME
                        }?start=help_superuser`
                    )
                ]).extra()
            );
        }
    });
};
