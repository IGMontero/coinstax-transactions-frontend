import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';
import { getSelectedAssetFilters } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import {
  fetchHistory,
  downloadTransactions,
} from '../../../slices/transactions/thunk';
import { capitalizeFirstLetter, FILTER_NAMES } from '../../../utils/utils';
import RenderTransactions from './HistorialComponents/RenderTransactions';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const HistorialTable = ({ address, activeTab, data, setData }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const isDashboardPage = location.pathname.includes('tokens');

  const [errorData, setErrorData] = useState(null);

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
  // const [groupedTransactions, setGroupedTransactions] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState('All Assets');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  const [debouncedDisableGetMore, setDebouncedDisableGetMore] = useState(false);

  const [loadingDownload, setLoadingDownload] = useState(false);

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

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 500);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [searchTerm]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const fetchData = async () => {
    const selectAsset = getSelectedAssetFilters(selectedAssets);
    let timerId;
    // const isInitialFetch = currentPage === 0;
    // const dataLength = data?.length;

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

      setData(trasactions);
      setHasMoreData(trasactions.length > 0 || isProcessing);
    } catch (error) {
      setErrorData(error);
      console.log(error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      setShowDownloadMessage(false);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilters([]);
    setSelectedAssets('All Assets');
    setIncludeSpam(false);
    setSearchTerm('');
    setHasAppliedFilters(false);
  };

  useEffect(() => {
    if (activeTab != 3) {
      handleClearAllFilters();
      setShowDownloadMessage('');
      setData([]);
    }
  }, [activeTab, address]);

  useEffect(() => {
    if (activeTab == '3' || isDashboardPage) {
      fetchData();
      setHasMoreData(true);
    }
    setShowDownloadMessage('');
    setCurrentPage(0);
  }, [
    address,
    activeTab,
    dispatch,
    selectedAssets,
    selectedFilters,
    includeSpam,
    debouncedSearchTerm,
  ]);

  const groupTxsByDate = (transactions) => {
    if (!Array.isArray(transactions)) {
      console.error(
        'Expected an array of transactions, received:',
        transactions,
      );
      return {};
    }
    return transactions.reduce((acc, transaction) => {
      const date = formatDate(transaction.date);
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
    } catch (error) {
      console.error('Error fetching more transactions:', error);
    } finally {
      setLoading(false);
      setShowDownloadMessageInButton(false);
    }
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
    setLoading(true);
  };

  const renderBadges = () => {
    return selectedFilters.map((filterName) => (
      <Badge key={filterName} color="soft-dark" className="p-2 my-2 me-2">
        <span className="fs-6 d-flex align-items-center fw-semibold">
          {capitalizeFirstLetter(filterName)}
          <button
            onClick={() => handleDeselectFilter(filterName)}
            className="bg-transparent p-0 border-0 text-dark ms-2 fs-5"
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
            isOpen={showTransactionFilterMenu}
            toggle={handleShowTransactionFilterMenu}
            className=""
          >
            <DropdownToggle
              tag="a"
              className={`btn btn-sm p-1 btn-soft-primary d-flex align-items-center ${
                showTransactionFilterMenu ? 'active' : ''
              }`}
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
              tag="a"
              className={`btn btn-sm p-1 btn-soft-primary d-flex align-items-center ms-2 ${
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
          blockchain: 'eth-mainnet',
          address: address,
          query: debouncedSearchTerm,
          filters: {
            blockchainAction: selectedFilters,
            includeSpam: includeSpam,
          },
          assetsFilters: selectAsset,
        }),
      ).unwrap();

      if (response.isProcessing) {
        Swal.fire({
          title: 'Processing...',
          text: 'Address transactions are processing. Please try again in a few minutes.',
          icon: 'info',
          confirmButtonText: 'Ok',
        });

        setTimeout(() => {
          setLoadingDownload(false);
        }, 10000);
      } else {
        // Swal.fire({
        //   title: 'Downloading',
        //   html: 'Your file is being prepared for download.',
        //   timerProgressBar: true,
        //   didOpen: () => {
        //     Swal.showLoading();
        //   },
        // });

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

  return (
    <React.Fragment>
      <h1 className={`${isDashboardPage ? 'd-none' : 'ms-1 mt-0 mb-4'}`}>
        Transactions
      </h1>

      {!isInitialLoad && data && !errorData ? (
        <div className={isDashboardPage ? 'd-none' : ''}>
          {renderFiltersDropdown()}
          <Col className="col-12">
            {renderBadges()}
            {hasActiveFilters && (
              <span
                className="text-primary ms-2 cursor-pointer "
                onClick={handleResetFilters}
              >
                <span className="text-hover-dark">Reset</span>
              </span>
            )}
          </Col>
          <Row>
            <div className="d-flex mb-0 justify-content-between align-items-center">
              <div className="d-flex justify-content-start">
                <Input
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

              <div className="d-flex py-3 justify-content-end">
                <Button
                  disabled={loadingDownload}
                  onClick={handleDownloadTransactions}
                  className="btn btn-sm"
                  color="primary"
                  size="sm"
                >
                  Download CSV
                </Button>
              </div>
            </div>
          </Row>{' '}
        </div>
      ) : null}
      {/* <Row className="mt-4">
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
      </Row> */}
      {loading && isInitialLoad ? (
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
      ) : Object.keys(groupedTransactions).length > 0 ? (
        <Col
          lg={12}
          className="position-relative"
          style={{ minHeight: '50vh' }}
        >
          <div>
            {Object.keys(groupedTransactions).map((date, index) => (
              <RenderTransactions
                key={index}
                date={date}
                transactions={groupedTransactions[date]}
                onRefresh={fetchData}
                setTransactions={setData}
              />
            ))}
            {!isInitialLoad &&
              hasMoreData &&
              !isDashboardPage &&
              renderGetMoreButton()}
          </div>
        </Col>
      ) : (
        <>
          {!loading && hasAppliedFilters && !errorData && (
            <Col
              lg={12}
              className="position-relative d-flex justify-content-center align-items-center"
              style={{ minHeight: '50vh' }}
            >
              <div>
                <h1>No results found </h1>
              </div>
            </Col>
          )}
          {errorData && (
            <Col
              lg={12}
              className="position-relative d-flex justify-content-center align-items-center"
              style={{ minHeight: '50vh' }}
            >
              <div>
                <h1>{errorData}</h1>
              </div>
            </Col>
          )}
          {!data && (
            <Col
              lg={12}
              className="position-relative d-flex justify-content-center align-items-center"
              style={{ minHeight: '50vh' }}
            >
              <div>
                <h1>No results found</h1>
              </div>
            </Col>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
