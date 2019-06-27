const db = require('../db');
const i18n = require('../utils/i18n');

module.exports = bot => {
    bot.context.i18n = async function(keyword, variables) {
        const lang = await db('groups')
            .select('lang')
            .where({
                chat_id: this.chat.id
            });

        return i18n(lang, keyword, variables);
    };
    bot.context.lang = async function() {
        if (this.chat.type === 'private') {
            const user = await db('users').where({ user_id: this.from.id });
            return user[0].lang || 'en';
        }
        const group = await db('groups')
            .select('lang')
            .where({
                chat_id: this.chat.id
            });
        return group[0].lang || 'en';
    };
};
