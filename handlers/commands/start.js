const escapeHtml = require('@youtwitface/escape-html');
const i18n = require('../../utils/i18n');

const CONDITIONS_FOR_SUPER_USER = [
    'You must be a contributor',
    'You must be in more than 15 telegram groups',
    'You must be an admin of more than 5 groups',
    'You must understand english language',
    'You must be active on telegram'
];

module.exports = bot => {
    bot.start(async ctx => {
        if (ctx.args()) {
            const param = ctx.args()[0];
            switch (param) {
                case 'help_superuser': {
                    let conditions = '';
                    CONDITIONS_FOR_SUPER_USER.forEach((c, index) => {
                        conditions += `${index + 1}. ${c}\n`;
                    });
                    ctx.reply(
                        `Following are the conditions to become super user for ${
                            ctx.botInfo.username
                        }:\n\n${conditions}`
                    );
                }
            }
        } else
            ctx.reply(
                i18n(
                    await ctx.lang(),
                    `start.${
                        ctx.chat.type === 'private' ? 'private' : 'group'
                    }`,
                    { name: escapeHtml(ctx.from.first_name) }
                ),
                { parse_mode: 'html' }
            );
    });
};
