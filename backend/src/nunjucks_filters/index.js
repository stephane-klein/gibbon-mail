const { parseISO } = require('date-fns');
const { format, utcToZonedTime } = require('date-fns-tz');

const locales = require('./date_fns_locale');

const localizetimeNunjucksFilter = (_datetime, lang = 'FR', timeZone = 'Europe/Paris') => {
    // checking lang
    let locale = locales[lang.toLowerCase()];
    if (locale == null) {
        console.error(`ValueError: lang not found in date-fns/locale, recieved '${lang}', defaults to 'fr'`);
        locale = locales.fr;
    }
    // checking _datetime
    let datetimeRange;
    let datetime;
    try {
        datetimeRange = JSON.parse(_datetime).map(date => utcToZonedTime(parseISO(date), timeZone));
        datetime = datetimeRange[0];
    } catch (e) {
        if (e instanceof SyntaxError) datetime = utcToZonedTime(parseISO(_datetime), timeZone);
        else {
            console.error(`TypeError: invalid datetime, expected 'Date' object, recieved '${_datetime}' instead`);
            return 'invalid time';
        }
    }
    // processing range
    try {
        if (datetimeRange) {
            if (
                (format(datetimeRange[0], 'HH:mm', { timeZone: timeZone }) === '08:00' && format(datetimeRange[1], 'HH:mm', { timeZone: timeZone }) === '12:00') ||
                (format(datetimeRange[0], 'HH:mm', { timeZone: timeZone }) === '14:00' && format(datetimeRange[1], 'HH:mm', { timeZone: timeZone }) === '18:00')
            ) {
                return format(datetimeRange[0], 'BBB', { locale: locale, timeZone: timeZone }); // 'dans la matinée' in french, 'in the morning' in english
            }
        }
    } catch (e) {
        console.error(e);
        return 'invalid time';
    }
    // processing single date
    if (datetime !== 'Invalid Date') {
        return format(datetime, 'pp', { locale: locale, timeZone: timeZone }); // 'à 19:30' in french, 'at 19:30' in english
    }
    console.error(`TypeError: invalid datetime, expected 'Date' object, recieved '${_datetime}' instead`);
    return 'invalid time';
};


module.exports = {
    localizetimeNunjucksFilter
};
