import moment from "moment";

export const formatTimeForClient = (dateString, timezone = null, format = 'time') => {
    if (!dateString) {
        return '';
    }
    const resolvedTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Determine the user's locale
    const userLocale = navigator?.languages?.length ? navigator.languages[0] : (navigator.language || 'en-US');

    // Convert the date string to a Date object
    const date = moment(dateString).toDate();


    // Define options based on the desired output format
    let options;
    if (format === 'date') {
        // Date-only format (e.g., 5 September 2024)
        options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: resolvedTimezone
        };
    } else if (format === 'time') {
        // Time-only format (locale-aware for 12-hour or 24-hour clock)
        options = {
            hour: 'numeric',
            minute: 'numeric',
            timeZone: resolvedTimezone
        };
    } else if (format === 'calendar') {
        // Calendar date format (e.g., MM/DD/YYYY or DD/MM/YYYY based on locale)
        options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: resolvedTimezone
        };
    } else {
        throw new Error("Invalid format specified. Use 'date', 'time', or 'calendar'.");
    }

    // Format the date with Intl.DateTimeFormat
    return new Intl.DateTimeFormat(userLocale, options).format(date);
};