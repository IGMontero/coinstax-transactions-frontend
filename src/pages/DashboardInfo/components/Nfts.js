import React, { useEffect, useRef } from 'react';
import {
  Col,
  Row,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Input,
  InputGroup,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from 'reactstrap';
import eth from '../../../assets/images/svg/crypto-icons/eth.svg';
import { useDispatch } from 'react-redux';
import { fetchNFTS } from '../../../slices/transactions/thunk';

const Nfts = ({ address, activeTab }) => {
  // const address = "0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6";

  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const [data, setData] = React.useState([]);

  useEffect(() => {
    const fetchDataNFTS = () => {
      setLoading(true);
      dispatch(fetchNFTS(address))
        .unwrap()
        .then((response) => {
          setData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching NFTs:', error);
          setLoading(false);
        });
    };
    if (address && activeTab == '2') {
      fetchDataNFTS();
    }
  }, [address, activeTab, dispatch]);

  return (
    <React.Fragment>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
        </div>
      ) : (
        <>
          {data.items && data.items.length > 0 ? (
            <Col xxl={12}>
              <span className="text-dark">Total value by floor price</span>
              <h1>{data.prettyTotalNativeValue}</h1>
            </Col>
          ) : null}
          <Row>
            <Col
              xxl={12}
              className="d-flex justify-content-between flex-row mt-0"
            >
              {/* <Col xxl={6}>
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
                  style={{ width: "300px" }}
                >
                  <InputGroup className="px-3 search-bar  col-md-12 mt-2">
                    <span
                      className="search-icon ps-1 position-absolute"
                      onClick={() => inputRef.current.focus()}
                      style={{ zIndex: 1, cursor: "text" }}
                    >
                      <i className="ri-search-line text-muted fs-5"></i>
                    </span>
                    <Input
                      innerRef={inputRef}
                      className="search-input py-1 rounded"
                      style={{
                        zIndex: 0,
                        paddingLeft: "25px",
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
          </Col>*/}
            </Col>
          </Row>

          <Col className="mt-4 col-12">
            <div
              className="d-grid position-relative justify-content-center "
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(186px, 1fr))',
                gap: '30px',
              }}
            >
              {data.items &&
                data.items.length > 0 &&
                data.items.map((nft, index) => (
                  <div key={index} className="d-flex justify-content-center">
                    <Card
                      className="border-2 border bg-transparent shadow-none"
                      style={{
                        borderRadius: '10px',
                        minWidth: '100%',
                      }}
                    >
                      <CardHeader className="border-0  bg-transparent p-1">
                        <div
                          style={{ position: 'relative', minHeight: '200px' }}
                        >
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
                          />
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
                      <CardBody>
                        <div
                          className="d-flex flex-column justify-content-between"
                          style={{ height: '100%' }}
                        >
                          <div>
                            <span className="text-dark">
                              {nft.domain || ' '}
                            </span>
                            <h5 className="text-dark">{nft.name || ' '}</h5>
                          </div>
                          <div>
                            <span>Floor Price</span>
                            <h6 className="text-dark d-flex mb-0">
                              {nft.floorPrice ? nft.floorPrice : '$0.00'}{' '}
                              {nft.floorPriceSymbol ? nft.floorPriceSymbol : ''}{' '}
                              (
                              {nft.prettyFloorPriceUsd
                                ? nft.prettyFloorPriceUsd
                                : ''}
                              )
                            </h6>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
            </div>

            {/* No NFTs found */}
            {data.items && data.items.length === 0 && (
              <Col
                className="d-flex text-center col-12 justify-content-center align-items-center"
                style={{ display: 'flex', height: '50vh', width: '100%' }}
              >
                <h4 className="text-center">No NFTs found </h4>
              </Col>
            )}
          </Col>
        </>
      )}
    </React.Fragment>
  );
};

export default Nfts;
