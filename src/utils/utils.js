import moment from 'moment';
import { fetchHistory } from '../slices/transactions/thunk';

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

export const CurrencyUSD = 'USD';

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

  const isValueHuge = value > 1e20;
  const isValueSmall = Math.abs(value) < 0.01;

  const findSignificantDigits = (val) => {
    // Early return if value is 0
    if (val === 0) return 0;
    // Match the first significant digit and the first 3 significant digits
    const match = val.toString().match(/(?:\.(\d*?)0*?)?(?:[1-9](\d{0,2}))/);
    // Return the number of significant digits
    return match
      ? (match[1] ? match[1].length : 0) + (match[2] ? match[2].length : 0)
      : 0;
  };

  try {
    let options;

    if (currency) {
      options = {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: isValueSmall
          ? findSignificantDigits(value) + 2
          : 3,
      };
    } else {
      options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: isValueSmall
          ? findSignificantDigits(value) + 2
          : 3,
      };
    }

    if (isValueHuge) {
      // return Number(value).toExponential(2) + ' ' + currency;

      // Do above but using tolocalestring
      return parseFloat(value).toLocaleString(localUbication, {
        ...options,
        notation: 'scientific',
      });
    }

    if (isValueSmall) {
      const significantDigits = findSignificantDigits(Math.abs(value));
      // return parseFloat(value).toFixed(significantDigits + 1) + ' ' + currency;

      // Above but tolocale string
      return parseFloat(value).toLocaleString(localUbication, {
        ...options,
        // maximumFractionDigits: significantDigits + 1,
      });
    }

    return parseFloat(value).toLocaleString(localUbication, options);
  } catch (error) {
    console.error('Error', error);
    if (isValueSmall) {
      // For errors on small values, fallback to exponential notation
      return Number(value).toExponential(2) + ' ' + currency;
    }
    return parseFloat(value).toFixed(2) + ' ' + currency;
  }
};

export const updateTransactionsPreview = async ({
  address,
  debouncedSearchTerm,
  selectedFilters,
  includeSpam,
  selectedAssets,
  currentPage,
  setData,
  dispatch,
  pagesChecked,
}) => {
  // Pges checked
  // const pagesChecked = new Set();

  const updatePage = async (page) => {
    // if the page has been checked, continue with the next page
    if (pagesChecked.has(page)) {
      if (page < currentPage) {
        // Continue with the next page
        return updatePage(page + 1);
      }
      // Stop if the currentPage has been reached and all transactions are not in preview mode
      return;
    }

    const response = await dispatch(
      fetchHistory({
        address,
        query: debouncedSearchTerm,
        filters: {
          blockchainAction: selectedFilters,
          includeSpam: includeSpam,
        },
        assetsFilters: getSelectedAssetFilters(selectedAssets),
        page: page,
      }),
    ).unwrap();

    const { parsed } = response;
    if (!parsed || parsed.length === 0) {
      return;
    }

    // Update the data
    setData((currentData) => {
      return currentData.map((transaction) => {
        const updatedTransaction = parsed.find(
          (t) => t.txHash === transaction.txHash,
        );
        return updatedTransaction || transaction;
      });
    });

    // Verify if all transactions are not in preview mode
    const allNotInPreview = parsed.every((transaction) => !transaction.preview);

    // If all transactions are not in preview mode, add the page to the set of checked pages
    if (allNotInPreview) {
      // Add the page to the set of checked pages
      pagesChecked.add(page);

      if (page < currentPage) {
        // Continue with the next page
        return updatePage(page + 1);
      }
      // Stop if the currentPage has been reached and all transactions are not in preview mode
      // Update one tx to trigger the re-render
      // const newData = [...parsed];

      return
    }


  };

  // Start the update process
  await updatePage(0);
};
