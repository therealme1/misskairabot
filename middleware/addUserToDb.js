const db = require('../db');

module.exports = async (ctx, next) => {
    await db('users')
        .insert({
            user_id: ctx.from.id,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name || '',
            username: ctx.from.username || ''
        })
        .catch(e => {
            if (e.errno == 19) {
                db('users')
                    .where({ user_id: ctx.from.id })
                    .update({
                        first_name: ctx.from.first_name,
                        last_name: ctx.from.last_name || '',
                        username: ctx.from.username || ''
                    })
                    .then(() => {});
            }
        });
    next();
};
