import { useSelector } from "react-redux";

export const useGetTimezone = () => {
    const { user } = useSelector((state) => state.auth);

    if (user && user.timezone) {
        return user.timezone;
    } else {
        // Attempt to get the timezone from the browser
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}