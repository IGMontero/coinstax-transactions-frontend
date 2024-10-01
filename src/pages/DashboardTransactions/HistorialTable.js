import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';
import {
  buildParamsForTransactions,
  downloadFileByURL,
  formatDateToLocale,
  formatTransactionNotFoundMessage,
  getSelectedAssetFilters,
  updateTransactionsPreview,
} from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHistory,
  downloadTransactions,
} from '../../slices/transactions/thunk';
import { capitalizeFirstLetter, FILTER_NAMES } from '../../utils/utils';
import RenderTransactions from './HistorialComponents/RenderTransactions';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectNetworkType } from '../../slices/networkType/reducer';
import TransactionSkeleton from '../../Components/Skeletons/TransactionSekeleton';
import { DASHBOARD_USER_ROLES } from '../../common/constants';
import {
  downloadTransactionsPortfolio,
  fetchTransactionsPortfolio,
} from '../../slices/portfolio/thunk';
import { addJobToList } from '../../slices/jobs/reducer';

const internalPaginationPageSize = 10;

const HistorialTable = ({ data, setData, isDashboardPage, buttonSeeMore }) => {
  // #region HOOKS
  const inputRef = useRef(null);
  const pagesCheckedRef = useRef(new Set());
  const fetchControllerRef = useRef(new AbortController());

  const location = useLocation();
  const { address } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  const { userId } = useParams();
  const currentPortfolioUserId = userId ? userId : user?.id;
  const networkType = useSelector(selectNetworkType);
  const navigate = useNavigate();

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');
  const isAdmin = user?.role === DASHBOARD_USER_ROLES.ADMIN;

  // #region STATES
  const [hasPreview, setHasPreview] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [showTransactionFilterMenu, setShowTransactionFilterMenu] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeSpam, setIncludeSpam] = useState(false);
  const [showAssetsMenu, setShowAssetsMenu] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [unsupportedAddress, setUnsupportedAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const [showDownloadMessageInButton, setShowDownloadMessageInButton] =
    useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState('All Assets');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [debouncedDisableGetMore, setDebouncedDisableGetMore] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [currentEndIndex, setCurrentEndIndex] = useState(15);

  const [allTransactionsProcessed, setAllTransactionsProcessed] =
    useState(false);

  const [refreshPreviewIntervals, setRefreshPreviewIntervals] = useState({});

  const [loadingTransacions, setLoadingTransactions] = useState({});
  const loading = Object.values(loadingTransacions).some((loading) => loading);

  const abortControllersByBlockchain = useRef({});

  // Debounced disable get more: if is processing is set to true , it will disable the get more button for 5 seconds and show
  // custom text in the button "Downloading more transactions..."
  useEffect(() => {
    if (!isProcessing) {
      return setDebouncedDisableGetMore(false);
    }

    setDebouncedDisableGetMore(true);

    const timeout = setTimeout(() => {
      setIsProcessing(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isProcessing]);

  useEffect(() => {
    // console.log('refresh intervals changed!', refreshPreviewIntervals);

    // Check if any interval is running.
    const hasAnyIntervalRunning = Object.values(refreshPreviewIntervals).some(
      (interval) => interval,
    );

    // Set has preview state
    setHasPreview(hasAnyIntervalRunning);
  }, [refreshPreviewIntervals]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const hasPreview = data.some(
        (transaction) => transaction.preview === true,
      );

      // console.log(
      //   'Preview txs:',
      //   data?.filter((tx) => tx.preview === true).length,
      // );

      setHasPreview(hasPreview);
    } else {
      setHasPreview(false);
    }

    return () => {
      setHasPreview(false);
    };
  }, [data]);

  // #region FETCH DATA
  const fetchData = async ({ abortSignal }) => {
    const selectAsset = getSelectedAssetFilters(selectedAssets);
    let timerId;

    const fecthId = Date.now();

    try {
      setIsInitialLoad(true);

      // start loader for this fetch
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: true,
      }));

      timerId = setTimeout(() => {
        setShowDownloadMessage(true);
      }, 3000);

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
        networkType,
        abortSignal,
        userId: currentPortfolioUserId,
      });

      const response = await dispatch(request(params)).unwrap();

      clearTimeout(timerId);

      const {
        parsed,
        unsupported,
        isProcessing,
        transactionsCount,
        allTransactionsProcessed,
      } = response;

      // Save that all transactions are processed
      setAllTransactionsProcessed(allTransactionsProcessed);

      if (unsupported) {
        setUnsupportedAddress(true);
      } else {
        setUnsupportedAddress(false);
      }

      if (isProcessing) {
        setIsProcessing(true);
      } else {
        setIsProcessing(false);
      }

      const transactions = parsed || [];
      // If some transaction is preview ...

      setData(transactions);
      setTotalTransactions(transactionsCount);
      setHasMoreData(transactions.length > 0 || isProcessing);
      setCurrentEndIndex(internalPaginationPageSize);

      const hasPreview = transactions.some(
        (transaction) => transaction.preview === true,
      );

      const isIntervalRunning = refreshPreviewIntervals[currentPage];

      if (hasPreview && !isIntervalRunning) {
        startRefreshPreviewPageInterval(currentPage);
      }

      // TODO: IF HAS PREVIEW, TRIGGER FETCHING UNTIL ALL TRANSACTIONS ARE PARSED
    } catch (error) {
      setErrorData(error);
      console.log(error);
    } finally {
      // Stop loader
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
      setIsInitialLoad(false);
      setShowDownloadMessage(false);
    }
  };

  const startRefreshPreviewPageInterval = async (pageIndex) => {
    const signal = abortControllersByBlockchain.current[networkType].signal;

    // Add a flag to track the request status
    let isRequestInProgress = false;

    const interval = setInterval(async () => {
      // Wait 5 seconds before making the next request
      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log('Running interval for page', pageIndex);

      // Check if a request is already in progress
      if (isRequestInProgress) {
        console.log('Previous request still in progress for page', pageIndex);
        return;
      }

      // Set the flag to indicate that a request is in progress
      isRequestInProgress = true;

      try {
        await updateTransactionsPreview({
          address,
          debouncedSearchTerm,
          selectedFilters,
          includeSpam,
          selectAsset: getSelectedAssetFilters(selectedAssets),
          currentPage: pageIndex,
          setData,
          networkType,
          data,
          abortSignal: signal,
          dispatch,
          pagesChecked: pagesCheckedRef.current,
          onEnd: () => {
            clearInterval(interval);
            setRefreshPreviewIntervals((prevIntervals) => ({
              ...prevIntervals,
              [pageIndex]: null,
            }));
            console.log('Clearing interval for page', pageIndex);
          },
          onError: (err) => {
            console.error('Error updating preview:', err);
            clearInterval(interval);
            setRefreshPreviewIntervals((prevIntervals) => ({
              ...prevIntervals,
              [pageIndex]: null,
            }));
            console.log(
              'Clearing interval for page because of an error',
              pageIndex,
              err,
            );
          },
          isCurrentUserPortfolioSelected,
          currentPortfolioUserId,
        });
      } catch (error) {
        console.error('Error during updateTransactionsPreview call:', error);
      } finally {
        // Reset the flag to indicate that the request has completed
        isRequestInProgress = false;
      }
    }, 5000);

    setRefreshPreviewIntervals((prevIntervals) => ({
      ...prevIntervals,
      [pageIndex]: interval,
    }));
  };

  useEffect(() => {
    const hasRunningIntervals = Object.values(refreshPreviewIntervals).some(
      (interval) => interval,
    );

    if (!hasRunningIntervals) {
      console.log('No running intervals');

      // Clear all intervals
      Object.values(refreshPreviewIntervals).forEach((interval) => {
        clearInterval(interval);
      });

      setRefreshPreviewIntervals({});
    }

    return () => {
      Object.values(refreshPreviewIntervals).forEach((interval) => {
        clearInterval(interval);

        console.log('Clearing interval');
      });

      setRefreshPreviewIntervals({});
    };
  }, [
    // If any filter changes, clear all intervals
    selectedFilters,
    includeSpam,
    selectedAssets,
    // refreshPreviewIntervals,
    networkType,
  ]);

  useEffect(
    () => {
      // For all blockchains but not for the current one, abort the current fetch
      Object.keys(abortControllersByBlockchain.current).forEach(
        (blockchain) => {
          if (blockchain !== networkType) {
            console.log('Aborting fetch for blockchain:', blockchain);
            abortControllersByBlockchain.current[blockchain].abort();
          }
        },
      );
      // Signal by blockchain
      abortControllersByBlockchain.current[networkType] = new AbortController();

      const blockchainAbortSignal =
        abortControllersByBlockchain.current[networkType].signal;

      console.log('Reset should happen now.:', selectedFilters);

      fetchData({
        abortSignal: blockchainAbortSignal,
      });
      setErrorData(null);
      setHasMoreData(true);
      setShowDownloadMessage('');
      setCurrentPage(0);
      return () => {
        // if (fetchControllerRef.current) fetchControllerRef.current.abort();
      };
    },
    // eslint-disable-next-line
    [
      networkType,
      // address,
      selectedAssets,
      selectedFilters,
      includeSpam,
      debouncedSearchTerm,
    ],
  );

  // #region GROUPS
  const groupTxsByDate = (transactions) => {
    if (!Array.isArray(transactions)) {
      console.error(
        'Expected an array of transactions, received:',
        transactions,
      );
      return {};
    }
    return transactions.reduce((acc, transaction) => {
      const date = formatDateToLocale(transaction.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };

  const getFilteredTransactions = (txs) => {
    if (!txs || !Array.isArray(txs)) {
      return [];
    }

    let filteredTxs = txs;

    if (selectedFilters.length > 0) {
      filteredTxs = txs.filter((tx) =>
        selectedFilters.includes(tx.blockchainAction),
      );
    }

    if (selectedAssets !== 'All Assets') {
      if (selectedAssets === 'Tokens') {
        // Txs where isNft is false
        filteredTxs = txs.filter((tx) => {
          const hasNftLedger = tx.ledgers.some((ledger) => ledger.isNft);
          const isNft = tx.isNft;
          return !hasNftLedger && !isNft;
        });
      } else if (selectedAssets === 'NFTs') {
        // Txs where isNft is true
        filteredTxs = txs.filter((tx) => {
          // Look for txs that have a nft ledger. i.e ledger where isNft is true
          const hasNftLedger = tx.ledgers.some((ledger) => ledger.isNft);
          const isNft = tx.isNft;
          return hasNftLedger || isNft;
        });
      }
    }

    if (includeSpam === false) {
      filteredTxs = filteredTxs.filter((tx) => !tx.isSpam);
    }

    return filteredTxs;
  };

  // const filteredTransactions = getFilteredTransactions(data)

  // const groupedTransactions = filteredTransactions ? groupTxsByDate(filteredTransactions) : {};

  const filteredTransactions = getFilteredTransactions(data);
  const paginatedTransactions = filteredTransactions.slice(0, currentEndIndex);
  const groupedTransactions = paginatedTransactions
    ? groupTxsByDate(paginatedTransactions)
    : {};

  const getMoreTransactions = async (page) => {
    // fetchControllerRef.current.abort();
    // fetchControllerRef.current = new AbortController();
    const signal = abortControllersByBlockchain.current[networkType].signal;
    const selectAsset = getSelectedAssetFilters(selectedAssets);
    let timerId;

    const fecthId = Date.now();
    try {
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: true,
      }));

      const nextPage = page || currentPage + 1;

      console.log('Next page:', nextPage);

      timerId = setTimeout(() => {
        setShowDownloadMessageInButton(true);
      }, 3000);
      const request = isCurrentUserPortfolioSelected
        ? fetchTransactionsPortfolio
        : fetchHistory;

      const params = buildParamsForTransactions({
        address,
        query: searchTerm,
        filters: {
          selectedFilters,
          includeSpam,
          isCurrentUserPortfolioSelected,
        },
        selectAsset,
        page: nextPage,
        networkType,
        abortSignal: signal,
        userId: currentPortfolioUserId,
      });

      const response = await dispatch(request(params)).unwrap();

      console.log('Fetching more transactions:', response);

      clearTimeout(timerId);
      const { parsed, unsupported, isProcessing, allTransactionsProcessed } =
        response || {};

      // Save that all transactions are processed
      setAllTransactionsProcessed(allTransactionsProcessed);

      if (unsupported) {
        setUnsupportedAddress(true);
      } else {
        setUnsupportedAddress(false);
      }

      if (isProcessing) {
        setIsProcessing(true);
      } else {
        setIsProcessing(false);
      }

      const transactions = parsed || [];

      console.log('Transactions:', transactions);

      if (transactions.length === 0 && !isProcessing) {
        setHasMoreData(false);
      } else {
        setData((prevData) => [...prevData, ...transactions]);
        setCurrentPage(nextPage);
        setCurrentEndIndex(
          (prevEndIndex) => prevEndIndex + internalPaginationPageSize,
        ); // Update internal pagination index
      }

      // Edge case: if there is a filter applied and no transactions with that filter are found,
      // trigger a fetch for next page.

      // if (selectedFilters?.length > 0) {
      //   // If no transactions are found with the selected filters, trigger a fetch for the next page.
      //   const hasTransactionsWithSelectedFilters = transactions.some(
      //     (transaction) => selectedFilters.includes(transaction.blockchainAction),
      //   );

      //   if (!hasTransactionsWithSelectedFilters) {
      //     // setShowDownloadMessageInButton(true);
      //     setCurrentPage(page ? page + 1 : currentPage + 1);
      //     console.log('No transactions found with selected filters, fetching next page');
      //     return getMoreTransactions(nextPage);
      //   }
      // }

      // TODO: ADD INTERVAL TO REFRESH PREVIEW TRANSACTIONS

      const hasPreview = transactions.some(
        (transaction) => transaction.preview === true,
      );

      if (hasPreview) {
        console.log('Starting interval for page', nextPage);
        startRefreshPreviewPageInterval(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more transactions:', error);
    } finally {
      // stop loader
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
      setShowDownloadMessageInButton(false);
    }
  };

  // * For internal pagination
  const loadMoreTransactions = () => {
    if (currentEndIndex < filteredTransactions.length) {
      setCurrentEndIndex((prevEndIndex) => prevEndIndex + 15);
    } else {
      getMoreTransactions();
    }
  };

  // #region HANDLERS
  const handleClearAllFilters = () => {
    setSelectedFilters([]);
    setSelectedAssets('All Assets');
    setIncludeSpam(false);
    setSearchTerm('');
    setHasAppliedFilters(false);
  };

  const handleShowAssetsMenu = (e) => {
    setShowAssetsMenu(!showAssetsMenu);
  };

  const handleAssetChange = (asset) => {
    setCurrentPage(0);
    setSelectedAssets(asset);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination
  };

  const handleShowTransactionFilterMenu = (e) => {
    setShowTransactionFilterMenu(!showTransactionFilterMenu);
  };

  const handleTransactionFilterChange = async (filter) => {
    // const fecthId = Date.now()
    let updatedFilters = [...selectedFilters];
    if (selectedFilters.includes(filter)) {
      updatedFilters = updatedFilters.filter((f) => f !== filter);
    } else {
      updatedFilters.push(filter);
    }
    setSelectedFilters(updatedFilters);
    setCurrentPage(0);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination

    setHasAppliedFilters(true);
  };

  const handleDownloadTransactionsNew = async () => {
    // Do the same but now the response will not be something to download.
    // Instead, it will be a response with a fileUrl or a pending state.

    // If user is not authenticated, show a message to login and send to login page.
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to download transactions.',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to login page
          navigate('/login');
        }
      });
      return;
    } else {
      if (!user.emailVerified) {
        Swal.fire({
          icon: 'info',
          title: 'Email Verification Required',
          text: 'Please verify your email to download your transactions.',
          confirmButtonText: 'Ok',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/profile');
          }
        });
        return;
      }
    }

    try {
      setLoadingDownload(true);

      const assetsFilters = getSelectedAssetFilters(selectedAssets);

      // Show processing
      // Swal.fire({
      //   title: 'Processing',
      //   html: 'Your file is being prepared for download.',
      //   timerProgressBar: true,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   },
      // });

      const requestParams = {
        blockchain: networkType,
        filters: {
          blockchainAction: selectedFilters,
          includeSpam: includeSpam,
        },
        address: address,
      };

      const exportAction = isCurrentUserPortfolioSelected
        ? downloadTransactionsPortfolio({
            ...requestParams,
            userId: currentPortfolioUserId,
            assetsFilters,
          })
        : downloadTransactions({
            ...requestParams,
            query: debouncedSearchTerm,
            assetsFilters,
          });

      const response = await dispatch(exportAction).unwrap();

      if (response.completed && response.fileUrl) {
        // Show swal downloading for 2 seconds
        // Swal.fire({
        //   title: 'Downloading',
        //   html: 'Your file is being prepared for download.',
        //   // timerProgressBar: true,
        //   timer: 2500,
        //   didOpen: () => {
        //     Swal.showLoading();
        //   },
        // });

        // Handle file url here. Open in new tab or trigger download.
        // const link = document.createElement('a');
        // link.href = response.fileUrl;
        // link.setAttribute('download', 'transactions.csv');
        // document.body.appendChild(link);
        // link.click();

        downloadFileByURL(response.fileUrl, 'transactions.csv');

        // Close the modal and reset loading state
        // Swal.close();

        return;
      } else if (response.completed && response.files) {
        // Download all
        // Show swal downloading for 2 seconds

        Swal.fire({
          title: 'Downloading',
          html: 'Your files are being prepared for download.',
          // timerProgressBar: true,
          timer: 2500,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        response.files.forEach((file) => {
          downloadFileByURL(file.fileUrl, file.fileName);
        });
        // Close the modal and reset loading state
        // Swal.close();
        return;
      } else if (response.isProcessing) {
        // Check if it's processing.
        // Get job id.

        const { job } = response;

        if (!job) {
          // No job id. Consider showing an error message.
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try again later.',
          });
          setLoadingDownload(false);
          return;
        }

        // Add job to jobs list and start polling
        dispatch(addJobToList(job));

        // Swal.fire({
        //   title: 'Processing',
        //   html: 'Your file is being prepared for download. Please wait until it is ready.',
        //   timer: 2000,
        // });
      } else {
        // No response or error. Consideer showing an error message.
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      console.error(error);
      console.log(error.response);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
      setLoadingDownload(false);
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleDownloadTransactions = async () => {
    try {
      setLoadingDownload(true);

      const selectAsset = getSelectedAssetFilters(selectedAssets);
      Swal.fire({
        title: 'Downloading',
        html: 'Your file is being prepared for download.',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const downloadParams = {
        blockchain: networkType,
        filters: {
          blockchainAction: selectedFilters,
          includeSpam: includeSpam,
        },
      };

      const downloadAction = isCurrentUserPortfolioSelected
        ? downloadTransactionsPortfolio({
            ...downloadParams,
            userId: currentPortfolioUserId,
            assetsFilters: selectAsset,
          })
        : downloadTransactions({
            ...downloadParams,
            address: address,
            query: debouncedSearchTerm,
            assetsFilters: selectAsset,
          });

      const response = await dispatch(downloadAction).unwrap();

      console.log(response, response.data, response.size);
      const isResponseBlob = response instanceof Blob;

      if (response.error && response.error.code !== 'PROCESSING') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later.',
        });
        setLoadingDownload(false);
      } else if (response.isProcessing) {
        Swal.fire({
          title: 'Processing...',
          text: 'Address transactions are processing. Please try again in a few minutes.',
          icon: 'info',
          confirmButtonText: 'Ok',
        });

        setTimeout(() => {
          setLoadingDownload(false);
        }, 5000);
      } else if ((response.data && response.data.size > 0) || isResponseBlob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;

        // For portfolio downloads, name will reflect user id, portfolio, network type and date in unix.
        let filename;

        if (isCurrentUserPortfolioSelected) {
          filename = `portfolio_${currentPortfolioUserId}_${networkType}_${Date.now()}.csv`;
        } else {
          filename = `txs_${networkType}_${address}.csv`;
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        setTimeout(() => {
          Swal.close();
          setLoadingDownload(false);
        }, 500);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Data',
          text: 'No transactions to download.',
        });
        setLoadingDownload(false);
      }
    } catch (error) {
      console.error(error);
      console.log(error.response);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
      setLoadingDownload(false);
    }
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (value) => value,
  );

  const handleDeselectFilter = async (filterName) => {
    const updatedFilters = selectedFilters.filter((f) => f !== filterName);
    setSelectedFilters(updatedFilters);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination

    const fecthId = Date.now();

    try {
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: true,
      }));
      const request = isCurrentUserPortfolioSelected
        ? fetchTransactionsPortfolio
        : fetchHistory;
      const response = await dispatch(
        request({
          address,
          filters: { blockchainAction: updatedFilters },
          page: 0,
        }),
      ).unwrap();
      setData(response);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoadingTransactions((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHasAppliedFilters(true);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setHasAppliedFilters(false);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination
  };

  // const handleResetFilters = () => {
  //   setSelectedFilters([]);
  //   setSelectedAssets('All Assets');
  //   setLoading(true);
  // };

  const handleShowSpamTransactions = (e) => {
    const checked = e.target.checked;
    setIncludeSpam(checked);
    setCurrentPage(0);
    setCurrentEndIndex(internalPaginationPageSize); // Reset internal pagination
  };

  // #region RENDER FUNCTIONS

  const renderBadges = () => {
    return selectedFilters.map((filterName) => (
      <Badge
        key={filterName}
        color={isInitialLoad ? 'muted' : 'soft-dark'}
        className={`p-2 my-2 me-2 `}
      >
        <span
          className={`fs-6 d-flex text-${isInitialLoad ? 'muted' : 'dark'} align-items-center fw-semibold`}
        >
          {capitalizeFirstLetter(filterName)}
          <button
            disabled={isInitialLoad}
            onClick={() => handleDeselectFilter(filterName)}
            className={`bg-transparent p-0 border-0 text-${isInitialLoad ? 'muted' : 'dark'} ms-2 fs-5`}
          >
            <i className="ri-close-line"></i>
          </button>
        </span>
      </Badge>
    ));
  };

  const renderFiltersDropdown = () => {
    return (
      <Row>
        <Col className="d-flex">
          <Dropdown
            disabled={loading}
            isOpen={showTransactionFilterMenu}
            toggle={handleShowTransactionFilterMenu}
          >
            <DropdownToggle
              disabled={isInitialLoad}
              tag="a"
              className={`btn btn-sm p-1 d-flex align-items-center
              ${!isInitialLoad ? ' btn-soft-primary mb-1' : 'btn-muted mb-1 border'}
              ${showTransactionFilterMenu ? 'active' : ''} `}
              role="button"
            >
              <span className="fs-6">Transactions</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-1">
              {FILTER_NAMES.map((filter) => (
                <DropdownItem
                  key={filter}
                  className={`d-flex align-items-center justify-content-between w-100`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTransactionFilterChange(filter);
                  }}
                >
                  <label className="w-100 py-1 d-flex align-items-center justify-content-start m-0 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => {}}
                    />
                    {capitalizeFirstLetter(filter)}
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown
            isOpen={showAssetsMenu}
            toggle={handleShowAssetsMenu}
            className=""
          >
            <DropdownToggle
              disabled={isInitialLoad}
              tag="a"
              className={`btn btn-sm p-1  d-flex align-items-center ms-2 
              ${!isInitialLoad ? ' btn-soft-primary' : 'btn-muted mb-1 border'} ${
                showAssetsMenu ? 'active' : ''
              }`}
              role="button"
            >
              <span className="fs-6">
                {selectedAssets === 'All Assets' ? 'Assets' : selectedAssets}
              </span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-1">
              {['All Assets', 'Tokens', 'NFTs'].map((asset) => (
                <DropdownItem
                  key={asset}
                  className="d-flex align-items-center justify-content-between w-100"
                  onClick={() => handleAssetChange(asset)}
                >
                  <label className="w-100 py-1 d-flex align-items-center justify-content-start m-0 cursor-pointer">
                    {asset}
                    {selectedAssets === asset ? (
                      <i className="ri-check-line fs-5 ms-4"></i>
                    ) : (
                      ''
                    )}
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    );
  };

  const renderGetMoreButton = () => {
    return (
      <div className="d-flex justify-content-center mt-4">
        {unsupportedAddress ? (
          <h6 className="text-danger">Unsupported Address</h6>
        ) : (
          // <Button
          //   disabled={loading || debouncedDisableGetMore || unsupportedAddress}
          //   onClick={() => getMoreTransactions()}
          //   color="soft-light"
          //   style={{ borderRadius: '10px', border: '.5px solid grey' }}
          // >
          <Button
            disabled={loading || debouncedDisableGetMore || unsupportedAddress}
            onClick={loadMoreTransactions}
            color="soft-light"
            style={{ borderRadius: '10px', border: '.5px solid grey' }}
          >
            {loading ? (
              <div className="d-flex align-items-center">
                <Spinner size="sm" />
                {showDownloadMessageInButton && (
                  <div className="ms-3">
                    <h6 className="m-0">Downloading Transactions</h6>
                  </div>
                )}
              </div>
            ) : (
              <h6 className="text-dark fw-semibold my-2">
                {isProcessing ? (
                  <>
                    <span className="me-2">
                      Downloading more transactions...
                    </span>
                    <Spinner size="sm" />
                  </>
                ) : unsupportedAddress ? (
                  'Unsupported Address'
                ) : (
                  'More Transactions'
                )}
              </h6>
            )}
          </Button>
        )}
      </div>
    );
  };

  const renderSearchBar = () => {
    return (
      <>
        {' '}
        <Row className="mt-4">
          <Col lg={6} md={8} sm={10} xs={12}>
            <InputGroup className="py-3 d-flex align-items-center pt-0 search-bar col-lg-12 col-md-12 pe-3">
              <span
                className="search-icon ps-3 position-absolute"
                onClick={() => inputRef.current.focus()}
                style={{ zIndex: 1, cursor: 'text' }}
              >
                <i className="ri-search-line text-muted  fs-3"></i>
              </span>
              <Input
                innerRef={inputRef}
                className="search-input py-2 rounded"
                style={{
                  zIndex: 0,
                  paddingLeft: '47px',
                  paddingRight: '30px',
                }}
                placeholder="Filter by Address, Protocol, Assets, Type"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <Button
                  color="link"
                  className="btn-close
              position-absolute btn btn-sm  border-0"
                  style={{
                    right: '25px',
                    zIndex: 2,
                  }}
                  onClick={handleClearSearch}
                />
              )}
            </InputGroup>
          </Col>
          <Col
            lg={6}
            md={4}
            sm={2}
            xs={12}
            className="d-flex  py-3 justify-content-end"
          >
            <Button className="btn  btn-sm" color="primary" size="sm">
              Download CSV
            </Button>
          </Col>
        </Row>{' '}
      </>
    );
  };

  const renderTitle = () => {
    return (
      <>
        {isDashboardPage ? null : (
          <>
            <h1 className={`ms-1 mt-0 mt-4 mb-4`}>Transactions</h1>{' '}
          </>
        )}{' '}
      </>
    );
  };

  const renderMessageNoResults = () => {
    const hasFilters =
      selectedFilters.length > 0 ||
      selectedAssets !== 'All Assets' ||
      includeSpam ||
      searchTerm;
    const finalMessage = hasFilters
      ? 'No transactions found with the selected filters'
      : 'No transactions found';

    return (
      <Col
        lg={12}
        className="position-relative d-flex justify-content-center align-items-center"
        style={{ minHeight: isDashboardPage ? '10vh' : '50vh' }}
      >
        <div>
          {isDashboardPage ? (
            <>
              <h4>{finalMessage}</h4>
              {totalTransactions > 0 && buttonSeeMore('history', '')}
            </>
          ) : (
            <h1>{finalMessage}</h1>
            // <h1>
            //   {selectedFilters
            //     ? formatTransactionNotFoundMessage(
            //         selectedFilters.toString().toLowerCase().split(','),
            //         selectedAssets,
            //       )
            //     : `No Transactions Found`}
            // </h1>
          )}
        </div>
      </Col>
    );
  };

  const renderInfoTransactions = () => {
    return (
      <Row className="col-12 ">
        <div className="d-flex justify-content-between w-100">
          <div>Total transactions: {totalTransactions}</div>
          <div>
            {hasPreview && (
              <div className="d-flex align-items-center">
                <Spinner size="sm" />
                <span className="ms-2">Loading transactions...</span>
              </div>
            )}
          </div>
        </div>
      </Row>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <div className={isDashboardPage ? 'd-none' : ''}>
          {renderTitle()}
          {renderFiltersDropdown()}
          <Col className="col-12">
            {renderBadges()}
            {hasActiveFilters && (
              <span
                className="text-primary ms-2 cursor-pointer"
                onClick={handleClearAllFilters}
              >
                Reset
              </span>
            )}
          </Col>
          <Row>
            <div className="d-flex mb-0 py-3 justify-content-between align-items-center">
              <div className="d-flex justify-content-start">
                <Input
                  disabled={isInitialLoad}
                  id="customCheck1"
                  type="checkbox"
                  className="form-check-input me-2 cursor-pointer"
                  onChange={handleShowSpamTransactions}
                  checked={includeSpam}
                />
                <label className="form-check-label" htmlFor="customCheck1">
                  Include Spam Transactions
                </label>
              </div>
            </div>
            {!isInitialLoad && renderInfoTransactions()}
          </Row>
        </div>
        {!loading && !isInitialLoad && renderMessageNoResults()}
      </div>
    );
  };

  // #region RENDER CONDITIONALS
  if (loading && (isInitialLoad || data.length === 0)) {
    return (
      <>
        {renderHeader()}
        {/* <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
          {showDownloadMessage && (
            <div className="ms-3">
              <h3>Downloading Transactions</h3>
            </div>
          )}
        </div> */}
        <div className="d-flex pt-2  justify-content-center align-items-center">
          <TransactionSkeleton />
        </div>
      </>
    );
  }

  if (errorData && data?.length === 0) {
    return (
      <>
        <Col
          lg={12}
          className="position-relative d-flex justify-content-center align-items-center"
          // style={{ minHeight: '50vh' }}
        >
          <h1>No data found</h1>
        </Col>
      </>
    );
  }

  if (totalTransactions === 0 && !loading && !isInitialLoad) {
    return (
      <>
        {renderTitle()}
        <Col
          className="d-flex text-center col-12 justify-content-center align-items-center"
          style={{
            display: 'flex',
            height: isDashboardPage ? '10vh' : '40vh',
            width: '100%',
          }}
        >
          {isDashboardPage ? (
            <h4>This address does not have any transactions</h4>
          ) : (
            <h1>This address does not have any transactions</h1>
          )}
        </Col>
      </>
    );
  }

  if (data && data.length === 0) {
    return renderHeader();
  }

  // #region RENDER
  return (
    <React.Fragment>
      {renderTitle()}
      <div className={isDashboardPage ? 'd-none' : ''}>
        {renderFiltersDropdown()}
        <Col className="col-12">
          {renderBadges()}
          {hasActiveFilters && (
            <span
              className="text-primary ms-2 cursor-pointer"
              onClick={handleClearAllFilters}
            >
              Reset
            </span>
          )}
        </Col>
        <Row className="">
          <div className="d-flex mb-0 py-3 justify-content-between align-items-center">
            <div className="d-flex justify-content-start">
              <Input
                disabled={isInitialLoad}
                id="customCheck1"
                type="checkbox"
                className="form-check-input me-2 cursor-pointer"
                onChange={handleShowSpamTransactions}
                checked={includeSpam}
              />
              <label className="form-check-label" htmlFor="customCheck1">
                Include Spam Transactions
              </label>
            </div>
            <Button
              className="d-flex justify-content-center align-items-center "
              color="primary"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
                height: 35,
              }}
              onClick={handleDownloadTransactionsNew}
              size="sm"
              disabled={isInitialLoad || loadingDownload}
            >
              {' '}
              {loadingDownload ? (
                <>
                  {/* // SHOW spinner and Building CSV... */}
                  <Spinner size="sm" />

                  <span className="ms-2">Building CSV...</span>
                </>
              ) : (
                <>
                  <i className="ri-file-download-line fs-5 me-2"></i>
                  <span>Download CSV</span>
                </>
              )}
            </Button>
          </div>
        </Row>
      </div>

      {!isInitialLoad && renderInfoTransactions()}

      {data.length > 0 && (
        <Col
          lg={12}
          className="position-relative "
          // style={{ minHeight: '50vh' }}
        >
          {Object.keys(groupedTransactions).map((date, index) => (
            <RenderTransactions
              key={index}
              date={date}
              transactions={groupedTransactions[date]}
              onRefresh={fetchData}
              setTransactions={setData}
              actionFilter={selectedFilters?.[0]}
            />
          ))}
          {!isDashboardPage && hasMoreData && renderGetMoreButton()}
          {isDashboardPage &&
            totalTransactions > 0 &&
            buttonSeeMore('history', 'Activity')}
        </Col>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
