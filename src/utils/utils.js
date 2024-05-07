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
      return { color: 'dark', icon: 'ri-question-mark fs-3' };
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

export const formatDateToLocale = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
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
  onEnd,
}) => {
  // Pges checked
  try {
    const updatePage = async (page) => {
      // if (pagesChecked.has(page)) {
      //   if (page < currentPage) {
      //     // Continue with the next page
      //     return updatePage(page + 1);
      //   }
      //   // Stop if the currentPage has been reached and all transactions are not in preview mode
      //   return;
      // }

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

      // Verify if all transactions are not in preview mode
      const allNotInPreview = parsed.every(
        (transaction) => !transaction.preview,
      );

      // If all transactions are not in preview mode, add the page to the set of checked pages
      if (allNotInPreview) {
        // Add the page to the set of checked pages
        // pagesChecked.add(page);

        // if (page < currentPage) {
        //   await updatePage(page + 1);
        // }
        // // Stop if the currentPage has been reached and all transactions are not in preview mode
        // // Update one tx to trigger the re-render
        // const newData = [...parsed];

        // // return setData((currentData) => newData);
        // // return setData && setData(newData);
        // return setData((currentData) => {
        //   return currentData.map((transaction) => {
        //     const updatedTransaction = newData.find(
        //       (t) => t.txHash === transaction.txHash,
        //     );
        //     return updatedTransaction || transaction;
        //   });
        // });
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
    };
    // Clear the checked pages if the address has changed
    await updatePage(currentPage);
    // if (address !== pagesChecked.address) {
    //   pagesChecked.clear();
    //   pagesChecked.address = address;
    //   await updatePage(0);
    // } else {
    //   if (!pagesChecked.has(currentPage)) {
    //     await updatePage(currentPage);
    //   }
    // }
  } catch (error) {
    console.log(error);
  }
};

// Remove negative sign from the string
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

export const saveAddressToLocalStorage = (address) => {
  localStorage
    .setItem('recentAddresses', JSON.stringify([address]))
    .catch((error) => console.error(error));
};

// remove options from local storage
export const removeOptionsFromLocalStorage = (setOptions, value) => {
  const storedOptions = JSON.parse(localStorage.getItem('userAddresses')) || [];
  const newOptions = storedOptions.filter(
    (storedOption) => storedOption.value !== value,
  );
  localStorage.setItem('userAddresses', JSON.stringify(newOptions));
  setOptions((currentOptions) =>
    currentOptions.filter((o) => o.value !== value),
  );
};

// Functions helpers for chart
export const calculateTickAmount = (filter) => {
  switch (filter) {
    case 'one_week':
      return 7;
    case 'one_month':
      return 7;
    case 'six_months':
      return 6;
    case 'one_year':
      return 12;
    case 'all':
      return 24;
    default:
      return 10;
  }
};

export const getMaxMinValues = (series) => {
  let minValue = Infinity;
  let maxValue = -Infinity;

  series.forEach((serie) => {
    serie.data.forEach((dataPoint) => {
      if (dataPoint.y < minValue) minValue = dataPoint.y;
      if (dataPoint.y > maxValue) maxValue = dataPoint.y;
    });
  });

  return { minValue, maxValue };
};

export const calculatePercentageChange = (currentIndex, data) => {
  if (currentIndex > 0) {
    const currentValue = data[currentIndex];
    const previousValue = data[currentIndex - 1];
    return ((currentValue - previousValue) / previousValue) * 100;
  }
  return 0;
};
