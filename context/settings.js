module.exports = bot => {
    bot.context.settings = function() {
        const { chat } = this;
        const { id } = chat;
    };
};
