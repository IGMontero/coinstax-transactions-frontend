import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row, Spinner } from 'reactstrap';
import Nfts from '../DashboardNFT/Nfts';
import HistorialTable from '../DashboardTransactions/HistorialTable';
import ActivesTable from './components/ActivesTable';
import PerformanceChart from './components/PerformanceChart';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QrModal from '../../Components/Modals/QrModal';
import { getCurrentThemeCookie, handleSaveInCookiesAndGlobalState } from '../../helpers/cookies_helper';
import { setAddressName } from '../../slices/addressName/reducer';
import { selectNetworkType } from '../../slices/networkType/reducer';
import { fetchAssets } from '../../slices/transactions/thunk';
import { formatAddressToShortVersion, isDarkMode } from '../../utils/utils';
import Helmet from '../../Components/Helmet/Helmet';
import { fetchAssetsPortfolio } from '../../slices/portfolio/thunk';
import { layoutModeTypes } from '../../Components/constants/layout';

const DashboardInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const currentPortfolioUserId = userId ? userId : user?.id;
  const fetchControllerRef = useRef(new AbortController());
  const { fetchData } = useSelector((state) => state.fetchData);
  const networkType = useSelector(selectNetworkType);
  const { address, type } = useParams();
  const previousAddress = usePrevious(address);

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const [customActiveTab, setCustomActiveTab] = useState('1');

  const [addressTitle, setAddressTitle] = useState('');

  const [isUnsupported, setIsUnsupported] = useState(false);

  const [addressForSearch, setAddressForSearch] = useState('');

  const [historyData, setHistoryData] = useState([]);

  const [assetsData, setAssetsData] = useState([]);

  // const [loadingAssets, setLoadingAssets] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);

  const [assetsLoaders, setAssetsLoaders] = useState({});
  const loadingAssets = Object.values(assetsLoaders).some((loader) => loader);
  const formattedAddress = address ? formatAddressToShortVersion(address) : '';
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => {
    if (!isCurrentUserPortfolioSelected) {
      if (fetchData && fetchData?.performance?.unsupported) {
        setIsUnsupported(true);
      } else {
        setIsUnsupported(false);
      }
    }
  }, [fetchData, networkType]);

  useEffect(() => {
    if (!isCurrentUserPortfolioSelected) {
      if (address && previousAddress !== address && !type) {
        navigate(`/address/${address}`);
      }
    }
  }, [address, previousAddress, navigate, type]);

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const fetchDataAssets = async () => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    const fecthId = Date.now();
    const params = {
      address,
      networkType,
      signal,
    };

    try {
      setAssetsLoaders((prev) => ({
        ...prev,
        [fecthId]: true,
      }));

      const request = isCurrentUserPortfolioSelected
        ? dispatch(
            fetchAssetsPortfolio({
              userId: currentPortfolioUserId,
              blockchain: networkType,
              signal,
            }),
          )
        : dispatch(fetchAssets(params)).unwrap();

      const response = await request;

      const res = isCurrentUserPortfolioSelected ? response.payload : response;

      if (res?.unsupported === true) {
        setIsUnsupported(true);
      } else {
        setIsUnsupported(false);
      }
      setAssetsData(res || {});

      setAssetsLoaders((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Error fetching performance data:', error);
      }
      setAssetsLoaders((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
    }
  };

  useEffect(() => {
    fetchDataAssets();

    return () => {
      fetchControllerRef.current.abort();
    };
  }, [addressForSearch, type, dispatch, isUnsupported, networkType]);

  useEffect(() => {
    if (!isCurrentUserPortfolioSelected) {
      if (address) {
        setIsUnsupported(false);
        setAddressForSearch(address);
        setAddressTitle(address);
      }
    }
  }, [address, location, networkType]);

  useEffect(() => {
    if (type) {
      setCustomActiveTab(
        type === 'nfts' ? '2' : type === 'history' ? '3' : '1',
      );
    }
  }, [type]);

  const renderButtonSeeMore = (type, typeName) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Button
          className="mt-3 d-flex btn-hover-light  justify-content-center align-items-center "
          color="soft-light"
          style={{
            borderRadius: '10px',
            border: '.5px solid grey',
          }}
          onClick={() => {
            if (isCurrentUserPortfolioSelected) {
              navigate(`/portfolio/${type}`);
            } else {
              navigate(`/address/${address}/${type}`);
            }
          }}
        >
          <h6 className="text-dark  fw-semibold my-2">See more {typeName}</h6>
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <div>
        <QrModal
          showQrModal={showQrModal}
          toggleQrModal={toggleQrModal}
          addressTitle={addressTitle}
        />

        <div className="d-flex flex-column">
          <Row className="d-flex justify-content-center jusitfy-content-between align-items-center border-2">
            <Col
              xxl={9}
              lg={9}
              md={9}
              sm={9}
              xs={9}
              className="d-flex flex-column"
              order="1"
            >
              <div className="d-flex flex-row mt-3">
                {isUnsupported && (
                  <div className="mt-5  ">
                    <h1 className="fw-semibold text-danger">
                      Unsupported Address
                    </h1>
                    <h5 className="text-primary">Contact our support team </h5>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center align-items-center mb-3 mt-3">
            {!isUnsupported ? (
              <Col className="col-12 ">
                <div
                  className=" w-100 top-0 d-flex justify-content-between position-sticky align-items-center  "
                  style={{
                    zIndex: 5,
                    backgroundColor: '#16161a',
                  }}
                ></div>

                <div className="d-flex flex-column">
                  <div className="">
                    
                    <PerformanceChart
                      setIsUnsupported={setIsUnsupported}
                      address={addressForSearch}
                    />

                    <Col xxl={12}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">Assets</h2>
                      </div>
                      <div className="border border-2 p-3 " style={{borderRadius: '16px', backgroundColor: getCurrentThemeCookie() == 'dark' ? "rgb(22, 22, 26)" : "#fff"}}>
                        <ActivesTable
                          isDashboardPage={true}
                          loading={loadingAssets}
                          data={assetsData}
                          buttonSeeMore={renderButtonSeeMore}
                        />
                      </div>
                    </Col>
                    <Col xxl={12} className="mt-3 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">NFTs</h2>
                      </div>
                      <div className="border border-2 px-5 p-3" style={{borderRadius: '16px'}}>
                        <div className="">
                          <Nfts
                            isDashboardPage={true}
                            buttonSeeMore={renderButtonSeeMore}
                          />
                        </div>
                      </div>
                    </Col>

                    <Col xxl={12} className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">Transactions</h2>
                      </div>
                      <div className="border border-2 p-3" style={{borderRadius: '16px'}}>
                        <HistorialTable
                          isDashboardPage={true}
                          data={historyData}
                          setData={setHistoryData}
                          activeTab={customActiveTab}
                          address={addressForSearch}
                          buttonSeeMore={renderButtonSeeMore}
                        />
                      </div>
                    </Col>
                  </div>
                </div>
              </Col>
            ) : (
              <div style={{ minHeight: '100vh' }}></div>
            )}
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardInfo;
