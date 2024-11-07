import ReactGA from 'react-ga4';

export const trackGAEvent = ({ category, action, label, value }) => {
    try {
        ReactGA.event({
            category: category,
            action: action,
            label: label,
            value: value || 0
        });
    } catch (error) {
        console.error('Error tracking GA event', error);
    }
};
