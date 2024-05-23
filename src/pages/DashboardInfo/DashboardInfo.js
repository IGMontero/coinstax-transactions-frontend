import React, { useEffect, useRef, useState } from 'react';
import {
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  TabPane,
  TabContent,
  Spinner,
  Container,
} from 'reactstrap';
import PerformanceChart from './components/PerformanceChart';
import ActivesTable from './components/ActivesTable';
import Nfts from '../DashboardNFT/Nfts';
import HistorialTable from '../DashboardTransactions/HistorialTable';

import { fetchAssets } from '../../slices/transactions/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/utils';
import QrModal from '../../Components/Modals/QrModal';
import { handleSaveInCookiesAndGlobalState } from '../../helpers/cookies_helper';
import { setAddressName } from '../../slices/addressName/reducer';
import { selectNetworkType } from '../../slices/networkType/reducer';

const DashboardInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchData } = useSelector((state) => state.fetchData);
  const networkType = useSelector(selectNetworkType);
  const { address, type } = useParams();
  const previousAddress = usePrevious(address);

  const [customActiveTab, setCustomActiveTab] = useState('1');

  const [addressTitle, setAddressTitle] = useState('');

  const [isUnsupported, setIsUnsupported] = useState(false);

  const [addressForSearch, setAddressForSearch] = useState('');

  const [historyData, setHistoryData] = useState([]);

  const [assetsData, setAssetsData] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => {
    if (fetchData && fetchData?.performance?.unsupported) {
      setIsUnsupported(true);
    } else {
      setIsUnsupported(false);
    }
  }, [fetchData, networkType]);

  useEffect(() => {
    if (address && previousAddress !== address && !type) {
      navigate(`/address/${address}`);
    }
  }, [address, previousAddress, navigate, type]);

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const fetchDataAssets = () => {
    setLoadingAssets(true);

    dispatch(fetchAssets({ address, networkType }))
      .unwrap()
      .then((response) => {
        if (response.unsupported == true) {
          setIsUnsupported(true);
          setLoadingAssets(false);
        } else {
          setIsUnsupported(false);
          handleSaveInCookiesAndGlobalState(
            addressForSearch,
            dispatch,
            setAddressName,
          );
        }
        setAssetsData(response);
        setLoadingAssets(false);
      })
      .catch((error) => {
        console.error('Error fetching performance data:', error);
        setLoadingAssets(false);
      });
  };

  useEffect(() => {
    if (addressForSearch) {
      fetchDataAssets();
    }
  }, [addressForSearch, type, dispatch, isUnsupported, networkType]);

  useEffect(() => {
    if (address) {
      setIsUnsupported(false);
      setAddressForSearch(address);
      setAddressTitle(address);
    }
  }, [address, location, networkType]);

  useEffect(() => {
    if (type) {
      setCustomActiveTab(
        type === 'nfts' ? '2' : type === 'history' ? '3' : '1',
      );
    }
  }, [type]);

  document.title = `${type ? capitalizeFirstLetter(type) : 'Dashboard'} ${addressTitle ? '- ' + addressTitle : ''}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <QrModal
          showQrModal={showQrModal}
          toggleQrModal={toggleQrModal}
          addressTitle={addressTitle}
        />

        <>
          {/* <AddressWithDropdown /> */}
          {loading ? (
            <div
              className="d-flex d-none justify-content-start align-items-center"
              style={{ height: '13vh' }}
            >
              <Spinner style={{ width: '2rem', height: '2rem' }} />
            </div>
          ) : (
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
                      <h5 className="text-primary">
                        Contact our support team{' '}
                      </h5>
                    </div>
                  )}
                </div>
              </Col>
              {/* <Col
                xxl={3}
                lg={3}
                md={3}
                sm={12}
                xs={12}
                className="d-flex justify-content-center mb-3"
                order={{
                  sm: 'last',
                  xs: 'last',
                  md: '2',
                  lg: '2',
                  xxl: '2',
                }}
              >
                <Button className="rounded-circle bg-transparent border-1 border-dark btn btn-sm">
                      <i className="ri-share-forward-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button className="rounded-circle bg-transparent border-1 mx-3 border-dark btn btn-sm">
                      <i className="ri-send-plane-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button color="primary" className="btn btn-sm">
                      Add wallet
                    </Button>
              </Col> */}
            </Row>
          )}
          <Row className="d-flex justify-content-center align-items-center mb-3 mt-3 ">
            {' '}
            {!isUnsupported ? (
              <Col className="col-12 ">
                <div
                  className=" w-100 top-0 d-flex justify-content-between position-sticky align-items-center  "
                  style={{
                    zIndex: 5,
                    backgroundColor: '#16161a',
                  }}
                ></div>

                <div className="d-flex">
                  <div className="flex-grow-1">
                    <PerformanceChart
                      loading={loading}
                      setLoading={setLoading}
                      setIsUnsupported={setIsUnsupported}
                      address={addressForSearch}
                    />

                    <Col className={`${loading ? '' : ''}`} xxl={12}>
                      <ActivesTable loading={loadingAssets} data={assetsData} />
                    </Col>
                    <Col xxl={12} className="mt-3 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">NFTs</h2>
                        <Button
                          onClick={() => navigate(`/address/${address}/nfts`)}
                          className="btn btn-sm btn-soft-primary rounded"
                        >
                          <span className="p-1">See more NFTs</span>
                        </Button>
                      </div>
                      <div className="border border-2 rounded p-3 py-0 w-100 d-flex justify-content-center overflow-hidden">
                        <Nfts
                          isUnsupported={isUnsupported}
                          address={addressForSearch}
                        />
                      </div>
                    </Col>

                    <Col xxl={12} className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">Transactions</h2>
                        <Button
                          onClick={() =>
                            navigate(`/address/${address}/history`)
                          }
                          className="btn btn-sm btn-soft-primary rounded"
                        >
                          <span className="p-1">See more activity</span>
                        </Button>
                      </div>
                      <div className="border border-2 rounded p-3 ">
                        <HistorialTable
                          data={historyData}
                          setData={setHistoryData}
                          activeTab={customActiveTab}
                          address={addressForSearch}
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
        </>
      </div>
    </React.Fragment>
  );
};

export default DashboardInfo;
