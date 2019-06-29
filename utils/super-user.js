const isSuperUser = userid => {
    return (
        process.env.BOT_ADMIN.split(',').includes(String(userid)) ||
        process.env.SUPER_USERS.split(',').includes(String(userid))
    );
};

module.exports = isSuperUser;
