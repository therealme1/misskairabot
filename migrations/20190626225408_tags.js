exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('tags', table => {
            table.increments();
            table.integer('chat_id');
            table.string('name');
            table.string('text');
            table.string('media');
            table.boolean('link_preview');
        })
    ]);
};

exports.down = function(knex, Promise) {};
