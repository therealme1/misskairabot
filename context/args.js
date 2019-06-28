module.exports = bot => {
    bot.context.args = function() {
        const { text, entities } = this.message;

        return entities && entities[0].type === 'bot_command'
            ? text.slice(entities[0].length + 1).split(' ')
            : text.split(' ');
    };
};
