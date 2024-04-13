import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Badge,
} from 'reactstrap';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import { useDispatch } from 'react-redux';
import { fetchNFTS } from '../../slices/transactions/thunk';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';

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

const Nfts = ({ address }) => {
  const location = useLocation();

  const isDashboardPage = location.pathname.includes('tokens');

  const [loading, setLoading] = React.useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadingIncludeSpam, setLoadingIncludeSpam] = useState(false);
  const [includeSpam, setIncludeSpam] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [data, setData] = React.useState([]);

  const [currencySymbol, setCurrencySymbol] = useState('ETH');

  const [updatedAt, setUpdatedAt] = useState();

  const showFiatValues = currencySymbol === '$';
  const showNativeTokenValues = currencySymbol === 'ETH';

  const handleChangeSymbol = () => {
    setCurrencySymbol((prevSymbol) => (prevSymbol === 'ETH' ? '$' : 'ETH'));
  };

  const fetchDataNFTS = () => {
    if (loadingIncludeSpam) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    dispatch(fetchNFTS({ address: address, spam: includeSpam }))
      .unwrap()
      .then((response) => {
        setData(response);
        setUpdatedAt(response.updatedAt);
        setLoading(false);
        setLoadingIncludeSpam(false);
      })
      .catch((error) => {
        console.error('Error fetching NFTs:', error);
        setLoading(false);
        setLoadingIncludeSpam(false);
      });
  };

  useEffect(() => {
    if (address) {
      fetchDataNFTS();
    }
  }, [address, dispatch, includeSpam]);

  const handleVisitNFT = (contractAddress, tokenId) => {
    navigate(`/contract/${contractAddress}?tokenId=${tokenId}`);
  };

  const handleShowSpam = () => {
    setIncludeSpam(!includeSpam);
    setLoadingIncludeSpam(true);
  };

  // show only 4 NFTs if is dashboard page
  let items = [];

  if (isDashboardPage) {
    if (data && Array.isArray(data.items)) {
      items = data.items.slice(0, 5);
    }
  } else {
    items = data.items;
  }

  if (imageError) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
        }}
      >
        <span>Unsupported</span>
      </div>
    );
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
            <AddressWithDropdown />
            <h1 className={`ms-1 mt-0 mt-4 mb-4`}>NFTs</h1>{' '}
          </>
        )}{' '}
      </>
    );
  };

  // if no NFTs found
  if (data && data.length === 0 && !loading) {
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

  // if no NFTs found
  if (items && items.length === 0 && !loading) {
    return (
      <>
        {renderTitle()}
        <Row>
          <Col
            className="d-flex text-center col-12   justify-content-center align-items-center"
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
        </Row>
      </>
    );
  }

  return (
    <React.Fragment>
      {renderTitle()}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center h-50vh"
          style={{ height: !isDashboardPage ? '50vh' : '40vh' }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
        </div>
      ) : (
        <>
          {items && items.length > 0 && !isDashboardPage ? (
            <Col xxl={12} className="d-flex align-items-center">
              <div className="d-flex flex-column">
                <h6>
                  As of Date: {moment(updatedAt).format('MM/DD/YYYY hh:mm A')}
                </h6>
                <span className="text-dark">Total value by floor price</span>
                <h1>{data.prettyTotalNativeValue}</h1>
                <div className="d-flex">
                  <Input
                    id="customCheck1"
                    type="checkbox"
                    className="form-check-input me-2"
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
                  className="btn btn-sm rounded text-white border border-1 me-2"
                  onClick={handleChangeSymbol}
                >
                  {currencySymbol === 'ETH' ? ethIcon : '$'}
                </Button>
              </div>
            </Col>
          ) : null}

          {/* {renderDropdown()} */}

          <Col className={`mt-4 col-12 d-flex justify-content-center`}>
            {loadingIncludeSpam ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '50vh' }}
              >
                <Spinner style={{ width: '4rem', height: '4rem' }} />
              </div>
            ) : (
              <div
                className="d-grid position-relative justify-content-center "
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(186px, 1fr))',
                  gap: '30px',
                  justifyContent: 'center',
                }}
              >
                {items &&
                  items.length > 0 &&
                  items.map((nft, index) => {
                    const {
                      floorPriceFiat,
                      floorPriceNativeToken,
                      prettyFiatFloorPrice,
                      prettyNativeTokenFloorPrice,
                    } = nft;

                    const hasFiatFloorPrice =
                      floorPriceFiat && Number(floorPriceFiat) > 0;
                    const hasNativeTokenFloorPrice =
                      floorPriceNativeToken &&
                      Number(floorPriceNativeToken) > 0;

                    const hasFloorPrice = showFiatValues
                      ? hasFiatFloorPrice
                      : hasNativeTokenFloorPrice;

                    const floorPrice = showFiatValues
                      ? prettyFiatFloorPrice
                      : prettyNativeTokenFloorPrice;

                    const shouldShowUnsupported = !nft.logo || imageError;

                    return (
                      <div
                        key={index}
                        className="d-flex justify-content-center"
                        style={{ maxWidth: '100%' }}
                      >
                        <Card
                          onClick={() =>
                            handleVisitNFT(nft.contractAddress, nft.tokenId)
                          }
                          className="cursor-pointer border-2 border bg-transparent shadow-none"
                          style={{
                            borderRadius: '10px',
                            minWidth: '100%',
                          }}
                        >
                          <CardHeader className="border-0  bg-transparent p-1">
                            <div
                              style={{
                                position: 'relative',
                                minHeight: '200px',
                              }}
                            >
                              {shouldShowUnsupported ? (
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                >
                                  <h3 className="text-center">
                                    Unsupported content
                                  </h3>
                                </div>
                              ) : (
                                <img
                                  src={nft.logo}
                                  alt=""
                                  className="img-fluid w-100 position-realative"
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                  onError={() => setImageError(true)}
                                />
                              )}
                              <div className="">
                                <img
                                  src={eth}
                                  alt=""
                                  className="img-fluid border-dark border border-circle border-1 d-flex justify-content-start  shadow-md rounded-circle"
                                  style={{
                                    position: 'absolute',
                                    bottom: '5%',
                                    left: '5%',
                                    width: '10%',
                                    height: '10%',
                                  }}
                                />
                              </div>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-1">
                            <div
                              className="d-flex flex-column justify-content-between"
                              style={{ height: '100%' }}
                            >
                              <div>
                                {nft?.collection?.name && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      marginBottom: '6px',
                                      display: 'block',
                                    }}
                                    className="text-dark"
                                  >
                                    {nft?.collection?.name || ' '}
                                  </span>
                                )}

                                <h6
                                  style={{ fontSize: '14px' }}
                                  className="text-dark"
                                >
                                  {nft.name || ' '}
                                </h6>
                              </div>
                              {hasFloorPrice ? (
                                <div>
                                  <span>
                                    {hasFloorPrice ? 'Floor Price' : ' '}
                                  </span>
                                  <h6 className="text-dark d-flex mb-0">
                                    {/* {nft.floorPrice ? nft.floorPrice : ' '}{' '}
                                {nft.floorPriceSymbol
                                  ? nft.floorPriceSymbol
                                  : ' '}{' '}
                                {nft.prettyFloorPriceUsd
                                  ? `(${nft.prettyFloorPriceUsd})`
                                  : ''} */}

                                    {floorPrice}
                                  </h6>
                                </div>
                              ) : null}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })}
              </div>
            )}
          </Col>
          {/* No NFTs found */}
        </>
      )}
    </React.Fragment>
  );
};

export default Nfts;
