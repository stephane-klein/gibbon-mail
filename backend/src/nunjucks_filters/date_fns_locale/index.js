const locales = require('date-fns/locale');

const en = require('./en');
const fr = require('./fr');
const de = require('./de');

module.exports = {
    ...locales,
    en: en,
    fr: fr,
    de: de
};