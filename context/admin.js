module.exports = bot => {
    bot.context.isUserAdmin = async function() {
        const member = await bot.telegram.getChatMember(
            this.chat.id,
            this.from.id
        );
        return ['creator', 'administrator'].includes(member.status);
    };
};
