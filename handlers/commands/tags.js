const i18n = require('../../utils/i18n');
const db = require('../../db');
module.exports = bot => {
    bot.hears(/\/tag (.*)/, async ctx => {
        let { message } = ctx;
        const lang = await ctx.lang();
        const [, param] = ctx.match;
        let tag_name = param,
            tag_value,
            caption;

        if (param.match(/^\w+$/)) {
            if (message.reply_to_message) {
                message = message.reply_to_message;
                if (message.sticker) {
                    tag_value = 'file_' + message.sticker.file_id;
                } else if (message.photo) {
                    tag_value =
                        'file_' + message.photo[message.photo.length - 1];
                    caption = message.photo.caption || '';
                } else if (message.video) {
                    tag_value = 'file_' + message.video.file_id;
                    caption = message.video.caption || '';
                } else if (message.text) {
                    tag_value = message.text;
                } else {
                    return ctx.reply('tag.invalid_type');
                }
            } else {
                return ctx.reply(i18n(lang, 'tag.invalid_usage'));
            }
        } else if (param.match(/^(\w+) (.*)/)) {
            tag_name = param.match(/^(\w+) (.*)/)[1];
            tag_value = param.match(/^(\w+) (.*)/)[2];
        }
        let _tags = await db('tags').where({
            chat_id: ctx.chat.id,
            name: tag_name
        });
        if (_tags.length > 0) {
            return ctx.reply(i18n(lang, 'tag.already_exists'));
        } else {
            await db('tags').insert({
                chat_id: ctx.chat.id,
                name: tag_name,
                text: tag_value,
                caption: caption,
                link_preview: true
            });
            return ctx.reply(i18n(lang, 'tag.added'));
        }
    });
    bot.hears(/^\/deltag (\w+)$/, async ctx => {
        const [, name] = ctx.match;
        try {
            await db('tags')
                .where({ chat_id: ctx.chat.id, name: name })
                .delete();
            return ctx.reply(i18n(await ctx.lang(), 'tag.deleted'));
        } catch (e) {
            return ctx.reply(i18n(await ctx.lang(), 'tag.not_found'));
        }
        // TODO: Always reply deleted, and add confirmation buttons before deleting.
    });
    bot.command(['tags', 'notes'], async ctx => {
        const lang = await ctx.lang();
        let message = '';

        let tags = await db('tags').where({
            chat_id: ctx.chat.id
        });
        if (tags.length > 0) {
            tags.forEach(tag => {
                message += `◕ <code>${tag.name}</code>\n`;
            });
            ctx.reply(
                i18n(lang, 'tag.display_tags', {
                    tags: message,
                    title: ctx.chat.title
                }),
                {
                    parse_mode: 'Html'
                }
            );
        } else return ctx.reply(i18n(lang, 'tag.empty'));
    });
    bot.hears(/^#(\w+)\b/, async ctx => {
        const tag = await db('tags').where({
            chat_id: ctx.chat.id,
            name: ctx.match[1]
        });
        if (tag.length > 0) {
            return tag[0].text.startsWith('file_')
                ? ctx.replyWithDocument(tag[0].text.replace('file_', ''), {
                      reply_to_message_id: ctx.message.message_id
                  })
                : ctx.reply(tag[0].text);
        }
    });
};
