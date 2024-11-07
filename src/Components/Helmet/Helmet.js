import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { formatAddressToShortVersion } from '../../utils/utils';

const Helmet = ({ title }) => {
    const { address } = useParams();

    const getTitle = () => {
        let result = title;

        if (address) {
            const formattedAddress = formatAddressToShortVersion(address);
            result += ` · ${formattedAddress}`;
        }

        result += ' · ChainGlance';

        return result;
    }

    return (
        <ReactHelmet>
            <title>{getTitle()}</title>
        </ReactHelmet>
    );
};

export default Helmet;