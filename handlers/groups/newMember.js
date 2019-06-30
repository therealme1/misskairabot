const db = require('../../db');
const welcomeParser = require('../../utils/welcomeParser');

module.exports = bot => {
    bot.on('new_chat_members', ctx => {
        const { chat, new_chat_members } = ctx.message;
        new_chat_members.forEach(async member => {
            if (member.is_bot) {
                // check if group allows bots
            }
            if (member.id === ctx.botInfo.id) {
                ctx.reply('Thanks for adding me here!');
                try {
                    await db('groups').insert({
                        chat_id: ctx.chat.id,
                        title: ctx.chat.title,
                        lang: 'en',
                        locks: 0,
                        created_at: new Date().toString(),
                        welcome_message: '',
                        welcome_enabled: false,
                        welcome_lp: true
                    });
                    return;
                } catch (e) {
                    return;
                }
            } else {
                const group = await db('groups').where({ chat_id: chat.id });
                if (group[0].welcome_enabled) {
                    const p = welcomeParser(group[0].welcome_message);
                    ctx.reply(
                        p.text,
                        Object.assign(p.extra, {
                            reply_to_message_id: ctx.message.message_id
                        })
                    );
                }
            }
            const user = await db('users')
                .select()
                .where('user_id', member.id);
            if (user.length > 0) {
                const { status } = user[0];
                switch (status) {
                    case 'gbanned':
                        break;

                    case 'gmuted':
                        break;
                }
            }
        });
    });
};
