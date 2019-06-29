const isSuperUser = userid => {
    return (
        userid == process.env.BOT_ADMIN ||
        process.env.SUPER_USERS.split(',').includes(userid)
    );
};

module.exports = isSuperUser;
