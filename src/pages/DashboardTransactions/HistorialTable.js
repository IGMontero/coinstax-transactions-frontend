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
  formatDateToLocale,
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
import { useLocation, useParams } from 'react-router-dom';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';
import { selectNetworkType } from '../../slices/networkType/reducer';

const HistorialTable = ({ data, setData }) => {
  // #region HOOKS
  const inputRef = useRef(null);
  const pagesCheckedRef = useRef(new Set());
  const { address } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const networkType = useSelector(selectNetworkType);

  const currentUser = user;
  let isDashboardPage;
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const isUserInTransactionsHistoryPage = pathSegments.includes('history');

  if (pathSegments.length === 2) {
    isDashboardPage = true;
  } else if (pathSegments.length > 2) {
    isDashboardPage = false;
  }
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
  const [loading, setLoading] = useState(false);
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

  const [refreshPreviewIntervals, setRefreshPreviewIntervals] = useState({});

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
    console.log('refresh intervals changed!', refreshPreviewIntervals);

    // Check if any interval is running.
    const hasAnyIntervalRunning = Object.values(refreshPreviewIntervals).some(
      (interval) => interval,
    );

    // Set has preview state
    setHasPreview(hasAnyIntervalRunning);
  }, [refreshPreviewIntervals]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 500);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [searchTerm]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const hasPreview = data.some(
        (transaction) => transaction.preview === true,
      );

      console.log(
        'Preview txs:',
        data.filter((tx) => tx.preview === true).length,
      );

      setHasPreview(hasPreview);
    } else {
      setHasPreview(false);
    }

    return () => {
      setHasPreview(false);
    };
  }, [data, networkType]);

  // #region FETCH DATA
  const fetchData = async () => {
    const selectAsset = getSelectedAssetFilters(selectedAssets);
    let timerId;
    try {
      setIsInitialLoad(true);

      setLoading(true);

      timerId = setTimeout(() => {
        setShowDownloadMessage(true);
      }, 3000);

      const response = await dispatch(
        fetchHistory({
          address,
          query: debouncedSearchTerm,
          filters: {
            blockchainAction: selectedFilters,
            includeSpam: includeSpam,
          },
          assetsFilters: selectAsset,
          page: currentPage,
          networkType,
        }),
      ).unwrap();

      clearTimeout(timerId);
      const { parsed, unsupported, isProcessing, transactionsCount } = response;

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

      const hasPreview = transactions.some(
        (transaction) => transaction.preview === true,
      );

      console.log('Has preview:', hasPreview);
      const isIntervalRunning = refreshPreviewIntervals[currentPage];

      if (hasPreview && !isIntervalRunning) {
        console.log('Starting interval for page', currentPage);
        startRefreshPreviewPageInterval(currentPage);
      }

      // TODO: IF HAS PREVIEW, TRIGGER FETCHING UNTIL ALL TRANSACTIONS ARE PARSED
    } catch (error) {
      setErrorData(error);
      console.log(error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      setShowDownloadMessage(false);
    }
  };

  const startRefreshPreviewPageInterval = (pageIndex) => {
    if (!isUserInTransactionsHistoryPage) {
      return;
    }

    const interval = setInterval(async () => {
      console.log('Running interval for page', pageIndex);

      // Check if user is in this page still

      const isUserInTransactionsHistoryPage =
        location.pathname.includes('history');

      if (!isUserInTransactionsHistoryPage) {
        clearInterval(interval);
        console.log('Clearing interval for page', pageIndex);
        return;
      }

      await updateTransactionsPreview({
        address,
        debouncedSearchTerm,
        selectedFilters,
        includeSpam,
        selectedAssets,
        currentPage: pageIndex,
        setData,
        networkType,
        data,
        dispatch,
        pagesChecked: pagesCheckedRef.current,
        onEnd: () => {
          clearInterval(interval);
          console.log('Clearing interval for page', pageIndex);
        },
        onError: (err) => {
          console.error('Error updating preview:', err);
          clearInterval(interval);
          console.log(
            'Clearing interval for page because of an error',
            pageIndex,
          );
        },
      });
    }, 5000);

    // TODO: WHEN NO MORE TXS ARE PREVIEW, CLEAR INTERVAL.

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
    }

    return () => {
      Object.values(refreshPreviewIntervals).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [
    // If any filter changes, clear all intervals
    selectedFilters,
    includeSpam,
    selectedAssets,
    refreshPreviewIntervals,
    networkType,
  ]);

  // useEffect(() => {
  //   let interval;
  //   if (hasPreview) {
  //     interval = setInterval(async () => {
  //       await updateTransactionsPreview({
  //         address,
  //         debouncedSearchTerm,
  //         selectedFilters,
  //         includeSpam,
  //         selectedAssets,
  //         currentPage,
  //         setData,
  //         data,
  //         dispatch,
  //         pagesChecked: pagesCheckedRef.current,
  //       });
  //     }, 5000);
  //   }
  //   return () => clearInterval(interval);
  // }, [hasPreview, data]);

  useEffect(() => {
    fetchData();
    setErrorData(null);
    setHasMoreData(true);
    setShowDownloadMessage('');
    setCurrentPage(0);
  }, [
    address,
    dispatch,
    selectedAssets,
    selectedFilters,
    includeSpam,
    debouncedSearchTerm,
    networkType,
  ]);

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

  const groupedTransactions = data ? groupTxsByDate(data) : {};

  const getMoreTransactions = async () => {
    const selectAsset = getSelectedAssetFilters(selectedAssets);
    let timerId;
    try {
      setLoading(true);
      const nextPage = currentPage + 1;

      timerId = setTimeout(() => {
        setShowDownloadMessageInButton(true);
      }, 3000);

      const response = await dispatch(
        fetchHistory({
          address,
          query: searchTerm,
          filters: {
            blockchainAction: selectedFilters,
            includeSpam: includeSpam,
          },
          assetsFilters: selectAsset,
          page: nextPage,
          networkType,
        }),
      ).unwrap();

      clearTimeout(timerId);
      const { parsed, unsupported, isProcessing } = response;

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

      const trasactions = parsed || [];

      if (trasactions.length === 0 && !isProcessing) {
        setHasMoreData(false);
      } else {
        // setData((prevData) => [...prevData, ...response]);
        setData((prevData) => [...prevData, ...trasactions]);
        setCurrentPage(nextPage);
      }

      // TODO: ADD INTERVAL TO REFRESH PREVIEW TRANSACTIONS

      const hasPreview = trasactions.some(
        (transaction) => transaction.preview === true,
      );

      if (hasPreview) {
        console.log('Starting interval for page', nextPage);
        startRefreshPreviewPageInterval(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more transactions:', error);
    } finally {
      setLoading(false);
      setShowDownloadMessageInButton(false);
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
  };

  const handleShowTransactionFilterMenu = (e) => {
    setShowTransactionFilterMenu(!showTransactionFilterMenu);
  };

  const handleTransactionFilterChange = async (filter) => {
    let updatedFilters = [...selectedFilters];
    if (selectedFilters.includes(filter)) {
      updatedFilters = updatedFilters.filter((f) => f !== filter);
    } else {
      updatedFilters.push(filter);
    }
    setSelectedFilters(updatedFilters);
    setCurrentPage(0);
    setLoading(true);
    setHasAppliedFilters(true);
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
      const response = await dispatch(
        downloadTransactions({
          blockchain: networkType,
          address: address,
          query: debouncedSearchTerm,
          filters: {
            blockchainAction: selectedFilters,
            includeSpam: includeSpam,
          },
          assetsFilters: selectAsset,
        }),
      ).unwrap();

      console.log(response);

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
      } else {
        // Swal.fire({
        //   title: 'Downloading',
        //   html: 'Your file is being prepared for download.',
        //   timerProgressBar: true,
        //   didOpen: () => {
        //     Swal.showLoading();
        //   },
        // });
        console.log('Will download file');

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions-${address}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        setTimeout(() => {
          Swal.close();
          setLoadingDownload(false);
        }, 500);
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

    setLoading(true);
    try {
      const response = await dispatch(
        fetchHistory({
          address,
          filters: { blockchainAction: updatedFilters },
          page: 0,
        }),
      ).unwrap();
      setData(response);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHasAppliedFilters(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setHasAppliedFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedFilters([]);
    setSelectedAssets('All Assets');
    setLoading(true);
  };

  const handleShowSpamTransactions = (e) => {
    const checked = e.target.checked;
    setIncludeSpam(checked);
    setCurrentPage(0);
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
              ${!isInitialLoad ? ' btn-soft-primary' : 'btn-muted border'}
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
                      onChange={() => { }}
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
              ${!isInitialLoad ? ' btn-soft-primary' : 'btn-muted border'} ${showAssetsMenu ? 'active' : ''
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
          <Button
            disabled={loading || debouncedDisableGetMore || unsupportedAddress}
            onClick={getMoreTransactions}
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
            <Button className="btn btn-sm" color="primary" size="sm">
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
            <AddressWithDropdown />
            <h1 className={`ms-1 mt-0 mt-4 mb-4`}>Transactions</h1>{' '}
          </>
        )}{' '}
      </>
    );
  };

  const renderMessageNoResults = () => {
    return (
      <Col
        lg={12}
        className="position-relative d-flex justify-content-center align-items-center"
        style={{ minHeight: isDashboardPage ? '10vh' : '50vh' }}
      >
        <div>
          {isDashboardPage ? (
            <h4> No Transactions found </h4>
          ) : (
            <h1>No results found </h1>
          )}
        </div>
      </Col>
    );
  };

  const renderInfoTransactions = () => {
    return (
      <Row className="col-12">
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
  if (loading && isInitialLoad) {
    return (
      <>
        {renderHeader()}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
          {showDownloadMessage && (
            <div className="ms-3">
              <h3>Downloading Transactions</h3>
            </div>
          )}
        </div>
      </>
    );
  }

  if (errorData) {
    return (
      <>
        {isDashboardPage ? null : <AddressWithDropdown />}
        <Col
          lg={12}
          className="position-relative d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
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
            {currentUser && (
              <Button
                onClick={handleDownloadTransactions}
                className="btn btn-sm"
                color="primary"
                size="sm"
                disabled={isInitialLoad}
              >
                Download CSV
              </Button>
            )}
          </div>
        </Row>
      </div>

      {!loading && !isInitialLoad && renderInfoTransactions()}

      {Object.keys(groupedTransactions).length > 0 && (
        <Col
          lg={12}
          className="position-relative"
          style={{ minHeight: '50vh' }}
        >
          {Object.keys(groupedTransactions).map((date, index) => (
            <RenderTransactions
              key={index}
              date={date}
              transactions={groupedTransactions[date]}
              onRefresh={fetchData}
              setTransactions={setData}
            />
          ))}
          {!isDashboardPage && hasMoreData && renderGetMoreButton()}
        </Col>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
