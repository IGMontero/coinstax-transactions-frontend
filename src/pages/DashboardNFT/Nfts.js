import React, { useEffect, useRef, useState } from 'react';
import {
  Col,
  Row,
  Button,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Badge,
  Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNFTS } from '../../slices/transactions/thunk';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  CurrencyUSD,
  formatAddressToShortVersion,
  parseValuesToLocale,
} from '../../utils/utils';
import { selectNetworkType } from '../../slices/networkType/reducer';
import NftsCards from './components/NftsCards';
import NftsSkeleton from '../../Components/Skeletons/NftsSkeleton';
import Helmet from '../../Components/Helmet/Helmet';
import { fetchNFTSPortfolio } from '../../slices/portfolio/thunk';

const ethIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.999 3.757v4.73l3.998 1.787L10 3.757z"
      fill="currentColor"
    ></path>
    <path
      d="M10 3.757l-4 6.517 4-1.786V3.757zM9.999 13.34v3.214l4-5.535-4 2.32zM9.999 16.554V13.34l-4-2.32 4 5.535zM9.999 12.596l3.998-2.322L10 8.49v4.107z"
      fill="currentColor"
    ></path>
    <path d="M6 10.274l3.999 2.322V8.489l-4 1.785z" fill="currentColor"></path>
  </svg>
);

const Nfts = ({ isDashboardPage, buttonSeeMore }) => {
  const dispatch = useDispatch();
  const { address, userId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const currentPortfolioUserId = userId ? userId : user?.id;

  const location = useLocation();

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const networkType = useSelector(selectNetworkType);
  const fetchControllerRef = useRef(new AbortController());

  const [totalItems, setTotalItems] = useState(0);

  const [nftsLoader, setNftsLoader] = useState({});
  const [includeSpamLoader, setIncludeSpamLoader] = useState({});

  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [initialTotalFiatValue, setInitialTotalFiatValue] = useState(null);

  const [initialized, setInitialized] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const loading = Object.values(nftsLoader).some((loader) => loader);
  const loadingIncludeSpam = Object.values(includeSpamLoader).some(
    (loader) => loader,
  );

  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const [includeSpam, setIncludeSpam] = useState(false);

  const navigate = useNavigate();
  const [data, setData] = useState({ items: [] });
  const [showFiatValues, setShowFiatValues] = useState(true);
  const [updatedAt, setUpdatedAt] = useState();

  const formattedAddress = address ? formatAddressToShortVersion(address) : '';

  const handleChangeSymbol = () => {
    setShowFiatValues((prev) => !prev);
  };

  const fetchDataNFTS = (page, refresh) => {
    // if (isFetching) return;
    setIsFetching(true);
    console.log('FETCH DATA RUNNING');
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    const fetchId = Date.now();

    if (loadingIncludeSpam) {
      setIncludeSpamLoader((prevLoader) => ({
        ...prevLoader,
        [fetchId]: true,
      }));
    } else {
      setNftsLoader((prevLoader) => ({
        ...prevLoader,
        [fetchId]: true,
      }));
    }

    const request = isCurrentUserPortfolioSelected
      ? dispatch(
          fetchNFTSPortfolio({
            userId: currentPortfolioUserId,
            blockchain: networkType,
            page: page,
            signal,
          }),
        )
      : dispatch(
          fetchNFTS({
            address: address,
            spam: includeSpam,
            page: page,
            networkType,
            signal,
            refresh: refresh,
          }),
        ).unwrap();

    return request

      .then((res = {}) => {
        const response = isCurrentUserPortfolioSelected ? res.payload : res;
        setData((prevData) => ({
          ...response,
          items: [...(prevData.items || []), ...(response.items || [])],
        }));
        setHasMoreItems(response?.hasMore || false);
        setTotalItems(response?.totalItems || 0);
        setUpdatedAt(response?.updatedAt);
        if (page === 0) {
          setInitialTotalFiatValue(
            parseValuesToLocale(response?.totalValue || 0, CurrencyUSD),
          );
        }
        setNftsLoader((prevLoader) => ({
          ...prevLoader,
          [fetchId]: false,
        }));
        setIncludeSpamLoader((prevLoader) => ({
          ...prevLoader,
          [fetchId]: false,
        }));
      })
      .catch((error) => {
        console.log('Error fetching NFTs:', error);
        setNftsLoader((prevLoader) => ({
          ...prevLoader,
          [fetchId]: false,
        }));
        setIncludeSpamLoader((prevLoader) => ({
          ...prevLoader,
          [fetchId]: false,
        }));
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    // Initialize on first load
    if (!initialized) {
      setInitialized(true);
      setCurrentPage(0);
      setIncludeSpam(false);
      setData({ items: [] });
      setInitialTotalFiatValue(null);
      fetchDataNFTS(0, false);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      setCurrentPage(0);
      setData({ items: [] });
      // setIncludeSpam(false);
      setInitialTotalFiatValue(null);
      fetchDataNFTS(0, false);
    }
  }, [address, networkType]);

  useEffect(() => {
    if (initialized) {
      setData({ items: [] });
      setCurrentPage(0);
      fetchDataNFTS(0, false);
    }
  }, [includeSpam]);

  const handleRefreshClick = () => {
    setLoadingRefresh(true);
    setData({ items: [] });
    fetchDataNFTS(0, true).finally(() => {
      setLoadingRefresh(false);
    });
  };

  const totalFiatValue =
    initialTotalFiatValue !== null
      ? initialTotalFiatValue
      : parseValuesToLocale(data?.totalValue || 0, CurrencyUSD);

  const handleVisitNFT = (contractAddress, tokenId, blockchain) => {
    navigate(
      `/contract/${contractAddress}?blockchain=${blockchain}&tokenId=${tokenId}`,
    );
  };

  const handleShowSpam = () => {
    setIncludeSpam(!includeSpam);
    const fetchId = Date.now();

    setIncludeSpamLoader((prevLoader) => ({
      ...prevLoader,
      [fetchId]: false,
    }));
  };

  const handleShowMoreItems = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchDataNFTS(nextPage);
  };

  let items = data?.items || [];
  if (isDashboardPage) {
    items = items.slice(0, 5);
  }

  const renderDropdown = () => {
    return (
      <Row>
        <Col xxl={6}>
          <Col
            xxl={12}
            className="d-flex justify-content-between flex-row mt-0"
          >
            <div className="d-flex justify-content-start">
              <UncontrolledDropdown className="card-header-dropdown me-2">
                <DropdownToggle
                  tag="a"
                  className="btn btn-sm  border border-1 border-primary btn-soft-primary d-flex "
                  role="button"
                >
                  <i className="ri-menu-2-fill me-2"></i>
                  Price: high to low
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end mt-1">
                  <DropdownItem className="d-flex align-items-center">
                    <span>Recently added</span>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center">
                    <span>Oldest</span>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center">
                    <span>Price: low to high</span>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center">
                    <span>Price: high to low</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown className="card-header-dropdown me-2">
                <DropdownToggle
                  tag="a"
                  className="btn btn-sm  border border-1 border-primary btn-soft-primary d-flex"
                  role="button"
                >
                  <i className="ri-palette-fill me-2"></i>
                  Collections
                </DropdownToggle>
                <DropdownMenu
                  className="dropdown-menu-end mt-1"
                  style={{ width: '300px' }}
                >
                  <InputGroup className="px-3 search-bar  col-md-12 mt-2">
                    <span
                      className="search-icon ps-1 position-absolute"
                      onClick={() => inputRef.current.focus()}
                      style={{ zIndex: 1, cursor: 'text' }}
                    >
                      <i className="ri-search-line text-muted fs-5"></i>
                    </span>
                    <Input
                      innerRef={inputRef}
                      className="search-input py-1 rounded"
                      style={{
                        zIndex: 0,
                        paddingLeft: '25px',
                      }}
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </InputGroup>

                  <DropdownItem className="d-flex align-items-center my-2">
                    <Input type="checkbox" className="form-check-input me-2" />
                    <div className="mt-1">Adds by NFTchat</div>
                    <Badge color="dark" className="ms-auto">
                      3
                    </Badge>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center my-2">
                    <Input type="checkbox" className="form-check-input me-2 " />
                    <div className="mt-1">RoyalRabbitNFT</div>
                    <Badge color="dark" className="ms-auto">
                      5
                    </Badge>
                  </DropdownItem>
                  <DropdownItem className="d-flex align-items-center my-2">
                    <Input type="checkbox" className="form-check-input me-2" />
                    <div className="mt-1">Arabian Camels</div>
                    <Badge color="dark" className="ms-auto">
                      7
                    </Badge>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </Col>
          <Col xxl={6}>
            <div className="d-flex  justify-content-end align-items-center">
              <Button className="btn btn-sm rounded btn-soft-primary me-2">
                $
              </Button>
              <div className="bg-soft-dark rounded p-1">
                <Button color="primary" className="btn btn-sm me-2">
                  Collection
                </Button>
                <Button className="btn btn-sm rounded btn-soft-primary">
                  List
                </Button>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    );
  };

  const renderTitle = () => {
    return (
      <>
        {isDashboardPage ? null : (
          <>
            <h1 className={`ms-1 mt-0 mt-4 mb-4`}>NFTs</h1>{' '}
          </>
        )}{' '}
      </>
    );
  };

  // if no NFTs found
  if (!loading && totalItems === 0) {
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
            <h4 className="text-center ">No NFTs Found</h4>
          ) : (
            <h1 className="text-center ">No NFTs Found</h1>
          )}
        </Col>
      </>
    );
  }

  return (
    <React.Fragment>
      {!isDashboardPage && <Helmet title={`NFTs`} />}
      {renderTitle()}
      {loading && !loadingIncludeSpam && currentPage === 0 ? (
        <NftsSkeleton isDashboardPage={isDashboardPage} />
      ) : (
        <div className="w-100">
          {totalItems > 0 && !isDashboardPage ? (
            <Col xxl={12} className="d-flex align-items-center">
              <div className="d-flex flex-column">
                <h6>As of Date: {moment(updatedAt).format('MM/DD/YYYY')}</h6>
                <span className="text-dark">Total value by floor price</span>
                <div className="d-flex align-items-center">
                  <h1>{totalFiatValue}</h1>
                  <h1 className="ms-3">
                    <button
                      type="button"
                      className={`button-reload ${loadingRefresh ? 'loading' : ''}`}
                      onClick={handleRefreshClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-repeat"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                        <path
                          fill-rule="evenodd"
                          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                        ></path>
                      </svg>
                    </button>
                  </h1>
                </div>
                <div className="d-flex">
                  <Input
                    id="customCheck1"
                    type="checkbox"
                    className="form-check-input cursor-pointer me-2"
                    onChange={handleShowSpam}
                    checked={includeSpam}
                  />
                  <label className="form-check-label" htmlFor="customCheck1">
                    Include Spam NFTs
                  </label>
                </div>
              </div>
              <div className="ms-auto">
                <Button
                  style={{
                    padding: '5px',
                    minWidth: '0px',
                    height: '32px',
                    width: '32px',
                  }}
                  color="transparent"
                  className="btn btn-sm rounded text-dark border border-1 me-2"
                  onClick={handleChangeSymbol}
                >
                  {showFiatValues ? '$' : ethIcon}
                </Button>
              </div>
            </Col>
          ) : null}

          <Col className={`mt-4 col-12 d-flex justify-content-center`}>
            <Col>
              <>
                <NftsCards
                  includeSpam={includeSpam}
                  isDashboardPage={isDashboardPage}
                  item={items}
                  onVisitNft={handleVisitNFT}
                  showFiatValues={showFiatValues}
                />
                {!isDashboardPage && hasMoreItems && (
                  <div className="d-flex justify-content-center">
                    <Button
                      className="mt-3 d-flex btn-hover-light justify-content-center align-items-center"
                      color="soft-light"
                      disabled={loading}
                      style={{
                        borderRadius: '10px',
                        border: '.5px solid grey',
                      }}
                      onClick={handleShowMoreItems}
                    >
                      <h6 className="text-dark fw-semibold my-2">
                        {loading ? <Spinner size="sm" /> : 'See more NFTs'}
                      </h6>
                    </Button>
                  </div>
                )}
                {isDashboardPage &&
                  hasMoreItems &&
                  buttonSeeMore('nfts', 'NFTs')}
              </>
            </Col>
          </Col>
        </div>
      )}
    </React.Fragment>
  );
};

export default Nfts;
