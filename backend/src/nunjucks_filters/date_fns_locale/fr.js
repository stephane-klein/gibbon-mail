/* eslint-disable quotes */
const frLocale = require('date-fns/locale/fr');
const buildFormatLongFn = require('date-fns/locale/_lib/buildFormatLongFn/index');
const buildLocalizeFn = require('date-fns/locale/_lib/buildLocalizeFn/index');

// https://github.com/date-fns/date-fns/blob/master/src/locale/fr/_lib/formatLong/index.js
const timeFormats = {
    full: 'HH:mm:ss zzzz',
    long: 'HH:mm:ss z',
    medium: "'à' HH:mm",
    short: 'HH:mm'
};

const dayPeriodValues = {
    ...frLocale.localize.dayPeriodValues,
    abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'minuit',
        noon: 'midi',
        morning: 'dans la matinée',
        afternoon: 'dans l’après-midi',
        evening: 'soir',
        night: 'matin'
    }
};

const locale = Object.assign({}, frLocale, {
    formatLong: {
        ...frLocale.formatLong,
        time: buildFormatLongFn({
            formats: timeFormats,
            defaultWidth: 'full'
        })
    },
    localize: {
        ...frLocale.localize,
        dayPeriod: buildLocalizeFn({
            values: dayPeriodValues,
            defaultWidth: 'wide'
        })
    }
});

module.exports = locale;