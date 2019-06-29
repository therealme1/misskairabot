const isSuperUser = userid => {
    return (
        process.env.BOT_ADMIN.split(',').includes(userid) ||
        process.env.SUPER_USERS.split(',').includes(userid)
    );
};

module.exports = isSuperUser;
