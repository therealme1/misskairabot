const isSuperUser = userid => {
    return (
        process.env.BOT_ADMIN.split(',').includes(String(userid)) ||
        process.env.SUPER_USERS.split(',').includes(String(userid))
    );
};

const middleware = (ctx, next) => {
    if (isSuperUser(ctx.from.id)) {
        next();
    }
};

module.exports = isSuperUser;
module.exports.middleware = middleware;
