module.exports = (ctx, next) => {
    if (ctx.chat.type === 'private') return next();
    const member = ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    ctx.is_user_admon = ['creator', 'administrator'].includes(member.status);
    next();
};
