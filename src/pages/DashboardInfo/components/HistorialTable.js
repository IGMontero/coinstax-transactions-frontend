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
import { useDispatch } from 'react-redux';
import { fetchHistory } from '../../../slices/transactions/thunk';
import { capitalizeFirstLetter, FILTER_NAMES } from '../../../utils/utils';
import RenderTransactions from './HistorialComponents/RenderTransactions';

const HistorialTable = ({ address, activeTab }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [errorData, setErrorData] = useState(null);

  const [showTransactionFilterMenu, setShowTransactionFilterMenu] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [includeSpam, setIncludeSpam] = useState(false);

  const [showAssetsMenu, setShowAssetsMenu] = useState(false);

  const [hasMoreData, setHasMoreData] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [groupedTransactions, setGroupedTransactions] = useState({});

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [selectedAssets, setSelectedAssets] = useState({
    'All Assets': true,
    Tokens: false,
    NFTs: false,
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const fetchData = async () => {
    try {
      setIsInitialLoad(true);
      setLoading(true);
      const response = await dispatch(
        fetchHistory({
          address,
          query: searchTerm,
          filters: { ...selectedFilters, includeSpam: includeSpam },
          page: currentPage,
        }),
      ).unwrap();
      // if (response.message) {
      //   setErrorData(response.message);
      //   return;
      // }
      setData(response);
      setHasMoreData(response.length > 0);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (activeTab == '3') {
      fetchData();
      setCurrentPage(0);
      setHasMoreData(true);
    }
  }, [address, activeTab, dispatch, searchTerm, selectedFilters, includeSpam]);

  useEffect(() => {
    const groupByDate = (transactions) => {
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

    if (data) {
      setGroupedTransactions(groupByDate(data));
    }
  }, [data]);

  const getMoreTransactions = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;

      const response = await dispatch(
        fetchHistory({ address, page: nextPage }),
      ).unwrap();
      if (response.length === 0) {
        setHasMoreData(false);
      } else {
        setData((prevData) => [...prevData, ...response]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAssetsMenu = (e) => {
    setShowAssetsMenu(!showAssetsMenu);
  };

  const handleAssetChange = (asset) => {
    setSelectedAssets((prevAssets) => {
      const resetAssets = Object.keys(prevAssets).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      return { ...resetAssets, [asset]: true };
    });
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

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(async () => {
      setIsInitialLoad(true);
      setLoading(true);
      try {
        const response = await dispatch(
          fetchHistory({ address, query: value }),
        ).unwrap();

        setData(response);
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setIsInitialLoad(false);
        setLoading(false);
      }
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleResetFilters = () => {
    setSelectedFilters([]);
    setLoading(true);
    fetchData();
  };

  const handleShowSpamTransactions = (e) => {
    const checked = e.target.checked;
    setIncludeSpam(checked);
    setLoading(true);
    fetchData();
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

  return (
    <React.Fragment>
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
              <span className="fs-6">Assets</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-1">
              {Object.keys(selectedAssets).map((asset) => (
                <DropdownItem
                  key={asset}
                  className="d-flex align-items-center justify-content-between w-100"
                  onClick={() => handleAssetChange(asset)}
                >
                  <label className="w-100 py-1 d-flex align-items-center justify-content-start m-0 cursor-pointer">
                    {asset}
                    {selectedAssets[asset] ? (
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
        <Col lg={12} className="mt-3 mb-0 d-flex">
          <Input
            id="customCheck1"
            type="checkbox"
            className="form-check-input me-2"
            onChange={handleShowSpamTransactions}
            checked={includeSpam}
          />
          <label className="form-check-label" htmlFor="customCheck1">
            Include Spam Transactions
          </label>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6} md={8} sm={10} xs={12}>
          <InputGroup className="py-3 pt-0 search-bar col-lg-12 col-md-12 pe-3">
            <span
              className="search-icon ps-3 position-absolute"
              onClick={() => inputRef.current.focus()}
              style={{ zIndex: 1, cursor: 'text' }}
            >
              <i className="ri-search-line text-muted fs-3"></i>
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
                className="btn-close position-absolute btn btn-sm  border-0"
                style={{
                  right: '25px',
                  top: '25px',
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
          className="d-flex btn btn-sm py-3 justify-content-end"
        >
          <Button color="primary" size="sm">
            Download CSV
          </Button>
        </Col>
      </Row>
      {loading && isInitialLoad ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
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
              />
            ))}
            {!isInitialLoad && hasMoreData && (
              <div className="d-flex justify-content-center mt-2">
                <Button
                  disabled={loading}
                  onClick={getMoreTransactions}
                  color="soft-light"
                  style={{ borderRadius: '10px', border: '.5px solid grey' }}
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <h6 className="text-dark fw-semibold my-2">
                      More transactions
                    </h6>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Col>
      ) : (
        <Col
          lg={12}
          className="position-relative d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
        >
          <div>
            <h1>No data found</h1>
          </div>
        </Col>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
