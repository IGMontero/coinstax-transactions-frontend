import moment from 'moment';
import { fetchHistory } from '../slices/transactions/thunk';
import { getCurrentThemeCookie } from '../helpers/cookies_helper';
import { fetchTransactionsPortfolio } from '../slices/portfolio/thunk';

// #region Constants
export const filtersChart = [
  { label: '7D', days: 7, id: 'one_week' },
  { label: '1M', days: 30, id: 'one_month' },
  { label: '6M', days: 180, id: 'six_months' },
  { label: '1Y', days: 365, id: 'one_year' },
  { label: 'ALL', days: 10000, id: 'all' },
];

export const blockchainActions = {
  EXECUTE: 'EXECUTE',
  WITHDRAW: 'WITHDRAW',
  TRADE: 'TRADE',
  APPROVE: 'APPROVE',
  RECEIVE: 'RECEIVE',
  SEND: 'SEND',
  BURN: 'BURN',
  MINT: 'MINT',
  OTHER: 'OTHER',
};

export const blockchainContractTrustedStateEnumType = {
  UNKNOUN: 'unknown',
  TRUSTED: 'trusted',
  SCAM: 'scam',
  SPAM: 'spam',
};

export const FILTER_NAMES = ['TRADE', 'MINT', 'SEND', 'RECEIVE', 'OTHERS'];

export const CurrencyUSD = 'USD';

// #region Format functions
export const formatIdTransaction = (address, prefixLength, suffixLength) => {
  if (typeof address !== 'string') {
    return address;
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  // Verify if the address is too short
  if (address.length > prefixLength + suffixLength) {
    return `${prefix}...${suffix}`;
  } else {
    return address;
  }
};

export const formatAddressToShortVersion = (address) => {
  return formatIdTransaction(address, 6, 6);
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
// export const formatDateToLocale = (date, showTime) => {
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };

//   if (showTime) {
//     options.hour = 'numeric';
//     options.minute = '2-digit'; // Two-digit minute format
//     options.hour12 = true; // Use 12-hour clock
//   }

//   return new Date(date).toLocaleDateString(undefined, options);
// };

export const formatCalendarDateToLocale = (date, showTime) => {
  const dateObj = new Date(date);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  };

  const dateString = dateObj.toLocaleDateString(undefined, dateOptions);
  const timeString = showTime
    ? dateObj.toLocaleTimeString(undefined, timeOptions)
    : '';

  return `${dateString}${showTime ? ', ' + timeString : ''}`;
};
export const formatDateToLocale = (date, showTime) => {
  const dateObj = moment(date).utc().toDate();

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  const dateString = dateObj.toLocaleDateString(undefined, dateOptions);
  const timeString = showTime
    ? dateObj.toLocaleTimeString(undefined, timeOptions)
    : '';

  return `${dateString}${showTime ? ', ' + timeString : ''}`;
};

export const formatPercentageChange = (percentage) => {
  if (
    isNaN(percentage) ||
    percentage === null ||
    percentage === undefined ||
    !isFinite(percentage)
  ) {
    return '0.00';
  }

  const numericPercentage = Number(percentage);

  if (isNaN(numericPercentage)) {
    return '0.00';
  }

  if (Math.abs(numericPercentage) < 1e-6) {
    return '0.00';
  }

  if (Math.abs(numericPercentage) > 1e6) {
    return numericPercentage.toExponential(2);
  }

  return numericPercentage.toFixed(2);
};

export const calculatePercentageChange = (currentIndex, data) => {
  const currentValue = data[currentIndex];
  let previousValue;

  if (currentIndex > 0) {
    previousValue = data[currentIndex - 1];
  } else {
    // Current index is 0, use the last value in the array as the previous value
    previousValue = data[data.length - 1];
  }

  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return '';
  }

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
export const formatTransactionNotFoundMessage = (filters, selectedAssets) => {
  if (!filters || filters.length === 0) {
    return 'No Transactions Found';
  }

  let message = 'No ';
  let assetType =
    selectedAssets && selectedAssets !== 'All Assets'
      ? ` ${selectedAssets}`
      : '';

  if (filters.length === 2) {
    message += `${filters[0]} and ${filters[1]}${assetType} Transactions Found`;
  } else if (filters.length > 2) {
    const allButLast = filters
      .slice(0, -1)
      .map(capitalizeFirstLetter)
      .join(', ');
    const last = filters[filters.length - 1];
    message += `${allButLast}, and ${last}${assetType} Transactions Found`;
  } else {
    // When there is only one filter
    message += `${filters[0]}${assetType} Transactions Found`;
  }

  return message;
};

export const parseValuesToLocale = (
  value,
  currency,
  valueForChart,
  networkValue,
) => {
  const localUbication = navigator.language || 'en-US';

  if (value === undefined || value === null) {
    return '';
  }

  const getFormattedValue = (val, options) => {
    let formattedValue = new Intl.NumberFormat(localUbication, options).format(val);

    // Standardize USD symbol as "$" if the currency is USD
    if (currency === 'USD') {
      let currencySymbol = formattedValue.match(/[^\d.,\s]/g)?.join('') || '';
      if (currencySymbol.includes('US$')) {
        formattedValue = formattedValue.replace('US$', '$');
      }
    }

    return formattedValue;
  };

  if (networkValue) {
    const suffixes = { B: 1e9, M: 1e6, K: 1e3 };
    let suffixKey = Object.keys(suffixes).find((key) => value >= suffixes[key]);
    if (suffixKey) {
      let scaledValue = value / suffixes[suffixKey];
      let formattedValue = getFormattedValue(scaledValue, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      return `${formattedValue} ${suffixKey}`;
    }
  }

  const isValueHuge = value > 1e20;
  const isValueSmall = valueForChart
    ? Math.abs(value) < 1
    : Math.abs(value) < 0.01;

  const findSignificantDigits = (val) => {
    if (val === 0) return 0;
    const match = val.toString().match(/(?:\.(\d*?)0*?)?(?:[1-9](\d{0,2}))/);
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
          ? valueForChart
            ? Math.min(findSignificantDigits(value) + 4, 5)
            : findSignificantDigits(value) + 2
          : 3,
      };
    } else {
      options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: isValueSmall
          ? valueForChart
            ? Math.min(findSignificantDigits(value) + 4, 5)
            : findSignificantDigits(value) + 2
          : 3,
      };
    }

    if (isValueHuge) {
      return getFormattedValue(value, {
        ...options,
        notation: 'scientific',
      });
    }

    if (isValueSmall) {
      return getFormattedValue(value, options);
    }

    return getFormattedValue(value, options);
  } catch (error) {
    console.error('Error', error);
    if (isValueSmall) {
      return Number(value).toExponential(2) + ' ' + currency;
    }
    return parseFloat(value).toFixed(2) + ' ' + currency;
  }
};

export function formatNumberWithBillionOrMillion(number) {
  if (number === undefined || number === null || isNaN(number)) {
    return 'N/A';
  }

  const billion = 1000000000;
  const million = 1000000;
  if (number >= billion) {
    return (
      (number / billion).toLocaleString(undefined, {
        maximumFractionDigits: 1,
      }) + ' B'
    );
  } else if (number >= million) {
    return (
      (number / million).toLocaleString(undefined, {
        maximumFractionDigits: 1,
      }) + ' M'
    );
  }
  return number.toLocaleString();
}

export const removeNegativeSign = (amount) => {
  if (amount === undefined || amount === null) {
    return '';
  }

  return amount.replace('-', '');
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const buildParamsForTransactions = ({
  address,
  query,
  filters,
  selectAsset,
  page,
  networkType,
  abortSignal,
  userId,
}) => {
  const params = {
    address,
    query,
    filters: {
      blockchainAction: filters.selectedFilters,
      excludeSpam: !filters.includeSpam,
    },
    assetsFilters: selectAsset,
    page: page || 0,
    networkType,
    signal: abortSignal,
  };

  if (filters.isCurrentUserPortfolioSelected) {
    params.userId = userId;
  }

  return params;
};

export const updateTransactionsPreview = async ({
  address,
  debouncedSearchTerm,
  selectedFilters,
  includeSpam,
  selectAsset,
  currentPage,
  setData,
  dispatch,
  networkType,
  onEnd,
  abortSignal,
  onError,
  isCurrentUserPortfolioSelected,
  currentPortfolioUserId,
}) => {
  // Pges checked
  try {
    const updatePage = async (page) => {
      try {
        const request = isCurrentUserPortfolioSelected
          ? fetchTransactionsPortfolio
          : fetchHistory;
        const params = buildParamsForTransactions({
          address,
          query: debouncedSearchTerm,
          filters: {
            selectedFilters,
            includeSpam,
            isCurrentUserPortfolioSelected,
          },
          selectAsset,
          page,
          networkType,
          abortSignal,
          userId: currentPortfolioUserId,
        });

        const response = await dispatch(request(params)).unwrap();

        // const response = await dispatch(
        //   fetchHistory({
        //     address,
        //     query: debouncedSearchTerm,
        //     filters: {
        //       blockchainAction: selectedFilters,
        //       includeSpam: includeSpam,
        //     },
        //     assetsFilters: getSelectedAssetFilters(selectedAssets),
        //     page: page,
        //     networkType,
        //     signal,
        //   }),
        // ).unwrap();

        const parsed = response?.parsed;

        if (!parsed || parsed.length === 0) {
          // Finish the process if there are no transactions
          if (onEnd) {
            onEnd();
          }
          return;
        }

        // Verify if all transactions are not in preview mode
        const allNotInPreview = parsed.every(
          (transaction) => !transaction.preview,
        );

        // If all transactions are not in preview mode, add the page to the set of checked pages
        if (allNotInPreview) {
          // Add the page to the set of checked pages

          if (onEnd) {
            onEnd();
          }
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
      } catch (error) {
        console.log(error);
        if (onError) {
          onError(error);
        }
      }
    };
    // Clear the checked pages if the address has changed
    await updatePage(currentPage);
  } catch (error) {
    console.log(error);
  }
};

// #region Getters

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

export function getColSizeBasedOnContent(ledgers) {
  const maxLength = Math.max(
    ...ledgers.map((ledger) => ledger.currency?.length),
  );

  if (maxLength > 10) {
    return {
      negative: 'col-xxl-4 col-lg-4',
      positive: 'col-xxl-7 col-lg-7',
    };
  } else {
    return {
      negative: 'col-xxl-3 col-lg-3',
      positive: 'col-xxl-7 col-lg-7',
    };
  }
}

export const getMaxMinValues = (dataPoints) => {
  // Initialize minValue to positive infinity and maxValue to negative infinity
  let minValue = Infinity;
  let maxValue = -Infinity;

  // Iterate over each dataPoint in the array
  dataPoints.forEach((point) => {
    // If the current dataPoint is smaller than the current minValue, update minValue
    if (point < minValue) minValue = point;
    // If the current dataPoint is larger than the current maxValue, update maxValue
    if (point > maxValue) maxValue = point;
  });
  // Return an object containing the minimum and maximum values
  return { minValue, maxValue };
};

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
      return { color: 'dark', icon: 'ri-question-mark fs-3' };
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

// #region Local Storage

export const saveAddressToLocalStorage = (address) => {
  localStorage
    .setItem('recentAddresses', JSON.stringify([address]))
    .catch((error) => console.error(error));
};

// remove options from local storage
export const removeOptionsFromLocalStorage = (setOptions, value) => {
  const storedOptions = JSON.parse(localStorage.getItem('addresses')) || [];
  const newOptions = storedOptions.filter(
    (storedOption) => storedOption.value !== value,
  );
  localStorage.setItem('addresses', JSON.stringify(newOptions));
  setOptions((currentOptions) =>
    currentOptions.filter((o) => o.value !== value),
  );
};

export const isDarkMode = () => {
  const currentTheme = getCurrentThemeCookie();
  return currentTheme === 'dark';
};


export const downloadFileByURL = async (url, fileName) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}