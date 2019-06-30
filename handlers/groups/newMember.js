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
                        locks: '{}',
                        created_at: new Date().toUTCString(),
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
                .where('user_id', member.id)
                .first();

            if (user) {
                const { status } = user;

                switch (status) {
                    case 'gbanned':
                        await bot.telegram.kickChatMember(
                            ctx.chat.id,
                            user.user_id
                        );

                        ctx.reply(
                            'This user is globally banned. I\'ve banned them from this group.'
                        );
                        break;

                    case 'gmuted':
                        await bot.telegram.restrictChatMember(
                            ctx.chat.id,
                            user.user_id,
                            { can_send_messages: false }
                        );

                        ctx.reply(
                            'This user is globally muted. I\'ve muted them in this group.'
                        );
                        break;
                }
            }
        });
    });
};
