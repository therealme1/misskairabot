module.exports = (ctx, next) => {
    if (ctx.chat.type === 'private') return;
    
    const member = ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);

    if (['creator', 'administrator'].includes(member.status)) {
        next();
    }
};
