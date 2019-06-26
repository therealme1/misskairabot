const LANGS = (process.env.LANGS || 'en').split(',');
const newI18n = require('new-i18n');
const i18n = newI18n(`${__dirname}/../locales`, LANGS, LANGS[0]);

module.exports = i18n;
