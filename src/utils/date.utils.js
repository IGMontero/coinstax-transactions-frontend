import moment from 'moment-timezone';

export const formatTimeForClient = (dateString, timezone = null, format = 'hh:mm A') => {
    // Resolve timezone if none provided
    const resolvedTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    return moment.tz(dateString, resolvedTimezone).format(format);
};
