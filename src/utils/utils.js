import moment from 'moment';

export const getActionMapping = (action) => {
  switch (action) {
    case 'RECEIVE':
      return { color: 'success', icon: ' ri-arrow-down-line fs-3' };
    case 'SEND':
      return { color: 'dark', icon: 'ri-arrow-up-line fs-3' };
    case 'APPROVE':
      return { color: 'dark', icon: 'ri-lock-unlock-line fs-3' };
    case 'DESPOSIT':
      return { color: 'dark', icon: 'ri-download-2-line fs-3' };
    case 'TRADE':
      return { color: 'dark', icon: 'ri-arrow-left-right-line fs-3' };
    case 'WITHDRAW':
      return { color: 'dark', icon: 'ri-upload-2-line fs-3' };
    case 'EXECUTE':
      return { color: 'warning', icon: 'ri-file-3-line fs-3' };
    case 'BURN':
      return { color: 'dark', icon: 'ri-fire-line fs-3' };
    case 'MINT':
      return { color: 'dark', icon: 'ri-vip-diamond-line fs-3' };
    case 'OTHER':
      return { color: 'dark', icon: 'ri-question-mark fs-3' };
    default:
      return { color: 'dark', icon: 'ri-arrow-down-line fs-3' };
  }
};

export const blockchainActions = {
  EXECUTE: 'EXECUTE',
  WITHDRAW: 'WITHDRAW',
  TRADE: 'TRADE',
  APPROVE: 'APPROVE',
  RECEIVE: 'RECEIVE',
  SEND: 'SEND',
  BURN: 'BURN',
  MINT: 'MINT',
};

export const blockchainContractTrustedStateEnumType = {
  UNKNOUN: 'unknown',
  TRUSTED: 'trusted',
  SCAM: 'scam',
  SPAM: 'spam',
};

export const FILTER_NAMES = ['TRADE', 'MINT', 'SEND', 'RECEIVE', 'OTHERS'];

export const formatIdTransaction = (address, prefixLength, suffixLength) => {
  if (!address || typeof address !== 'string' || !address.startsWith('0x')) {
    return address;
  }

  const prefix = address.slice(0, prefixLength + 2);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Invalid Number';
  }

  let shift = 0;
  let tempNumber = Math.abs(number);
  while (tempNumber < 1 && tempNumber > 0) {
    tempNumber *= 10;
    shift++;
  }

  const roundedNumber =
    Math.round(number * Math.pow(10, shift + 1)) / Math.pow(10, shift + 1);

  return roundedNumber.toFixed(shift + 1);
};

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return '';
  }

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getSelectedAssetFilters = (selectedAssets) => {
  switch (selectedAssets) {
    case 'Tokens':
      return '&erc20Only=true';
    case 'NFTs':
      return '&nftOnly=true';
    default:
      return '';
  }
};

export async function copyToClipboard(textToCopy) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

export const formatDate = (date) => {
  return moment(date).format('MM/DD/YYYY');
};

export const parseValuesToLocale = (value, currency) => {
  // Get the location from the browser
  const localUbication = navigator.language || 'en-US';

  if (value === undefined || value === null) {
    return '';
  }

  const cryptoCurrencies = ['USDT', 'BTC', 'ETH', 'DAI'];

  const isValueHuge = value > 1e20;
  // Consider values less than 0.01 as small values
  const isValueSmall = value > 0 && value < 0.01;

  if (cryptoCurrencies.includes(currency)) {
    let formattedValue;
    if (isValueHuge) {
      formattedValue = Number(value).toExponential(2);
    } else if (isValueSmall) {
      // Withouth toFixed, the value is displayed in scientific notation
      formattedValue = Number(value).toFixed(4);
    } else {
      formattedValue = parseFloat(value).toFixed(2);
    }
    return formattedValue + ' ' + currency;
  } else {
    try {
      const options = isValueSmall
        ? {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: isValueSmall ? 8 : 4,
          }
        : {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          };

      if (isValueHuge) {
        return Number(value).toExponential(2) + ' ' + currency;
      }
      return parseFloat(value).toLocaleString(localUbication, options);
    } catch (error) {
      console.error('Error', error);
      if (isValueSmall) {
        return Number(value).toExponential(2) + ' ' + currency;
      }
      return parseFloat(value).toFixed(2) + ' ' + currency;
    }
  }
};
