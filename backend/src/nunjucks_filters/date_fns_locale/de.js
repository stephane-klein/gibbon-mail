/* eslint-disable quotes */
const deLocale = require('date-fns/locale/de');
const buildFormatLongFn = require('date-fns/locale/_lib/buildFormatLongFn/index');
const buildLocalizeFn = require('date-fns/locale/_lib/buildLocalizeFn/index');

// https://github.com/date-fns/date-fns/blob/master/src/locale/de/_lib/formatLong/index.js
const timeFormats = {
    full: 'HH:mm:ss zzzz',
    long: 'HH:mm:ss z',
    medium: "'um' HH:mm",
    short: 'HH:mm'
};

// https://github.com/date-fns/date-fns/blob/master/src/locale/en-US/_lib/localize/index.js
const dayPeriodValues = {
    ...deLocale.localize.dayPeriodValues,
    abbreviated: {
        am: 'vorm.',
        pm: 'nachm.',
        midnight: 'Mitternacht',
        noon: 'Mittag',
        morning: 'am morgen',
        afternoon: 'am nachmittag',
        evening: 'Abend',
        night: 'Nacht'
    },
};

const locale = Object.assign({}, deLocale, {
    formatLong: {
        ...deLocale.formatLong,
        time: buildFormatLongFn({
            formats: timeFormats,
            defaultWidth: 'full'
        })
    },
    localize: {
        ...deLocale.localize,
        dayPeriod: buildLocalizeFn({
            values: dayPeriodValues,
            defaultWidth: 'wide'
        })
    }
});

module.exports = locale;