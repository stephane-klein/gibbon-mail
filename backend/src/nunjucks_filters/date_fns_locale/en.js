/* eslint-disable quotes */
const enLocale = require('date-fns/locale/en-US');
const buildFormatLongFn = require('date-fns/locale/_lib/buildFormatLongFn/index');
const buildLocalizeFn = require('date-fns/locale/_lib/buildLocalizeFn/index');

// https://github.com/date-fns/date-fns/blob/master/src/locale/en-GB/_lib/formatLong/index.js
const timeFormats = {
    full: 'HH:mm:ss zzzz',
    long: 'HH:mm:ss z',
    medium: "'at' HH:mm",
    short: 'HH:mm'
};

// https://github.com/date-fns/date-fns/blob/master/src/locale/en-US/_lib/localize/index.js
const dayPeriodValues = {
    ...enLocale.localize.dayPeriodValues,
    abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'evening',
        night: 'night'
    },
};

const locale = Object.assign({}, enLocale, {
    formatLong: {
        ...enLocale.formatLong,
        time: buildFormatLongFn({
            formats: timeFormats,
            defaultWidth: 'full'
        })
    },
    localize: {
        ...enLocale.localize,
        dayPeriod: buildLocalizeFn({
            values: dayPeriodValues,
            defaultWidth: 'wide'
        })
    }
});

module.exports = locale;