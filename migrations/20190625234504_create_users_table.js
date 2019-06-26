exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table
                .integer('user_id')
                .unique()
                .notNull();
            table.string('first_name');
            table.string('last_name');
            table.string('username');
            table.string('lang');
            table.string('status');
            table.string('status_reason');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.dropTableIfExists('users')]);
};
