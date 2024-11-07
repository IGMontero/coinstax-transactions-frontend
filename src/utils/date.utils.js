import moment from 'moment-timezone';

export const formatTimeForClient = (dateString, timezone = null, format = 'HH:mm') => {
    const resolvedTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Determine the user's locale
    const userLocale = navigator?.languages?.length ? navigator.languages[0] : navigator.language || 'en-US';

    // Format date with Moment.js and locale-specific format
    const localizedDate = moment.tz(dateString, resolvedTimezone)
        .locale(userLocale)
        .format(format === 'default' ? 'D MMMM YYYY, HH:mm' : format); // Customizable default format

    return localizedDate;
};