import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Spinner } from 'reactstrap';
import { fetchCoingeckoId } from '../../slices/tokens/thunk';
import PerformanceChart from '../DashboardInfo/components/PerformanceChart';
import About from './components/About';
import Stats from './components/Stats';

const DashboardTokens = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { fetchData } = useSelector((state) => state);

  // #region STATES
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [data, setData] = useState();
  const [address, setAddress] = useState();

  const fetchToken = async () => {
    try {
      setLoading(true);
      setLoadingChart(true);
      const response = await dispatch(fetchCoingeckoId({ coingeckoId: token }));

      const res = response.payload;

      console.log(res, 'res');

      if (res) {
        setData(res);
        setAddress(res.platforms?.ethereum);
      } else {
        navigate('/');
      }
      setLoadingChart(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoadingChart(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [token]);

  useEffect(() => {
    if (fetchData && fetchData.performance.unsupported) {
      setIsUnsupported(true);
    } else {
      setIsUnsupported(false);
    }
  }, [fetchData]);

  console.log(address);

  return (
    <React.Fragment>
      <div className="page-content ">
        {loading ? (
          <div className="d-flex mt-5 justify-content-center align-items-center h-100vh">
            <Spinner style={{ width: '4rem', height: '4rem' }} />
          </div>
        ) : (
          <>
            <div className="mt-5 ">
              <div className="d-flex align-items-center">
                <img
                  src={data?.image}
                  alt="Ethereum"
                  className="icon-lg me-2"
                />
                <span className="fs-4">{data?.symbol}</span>
              </div>
              <h1 className="d-flex align-items-center mt-3 mb-4">
                {data?.name}
                {data?.verified ? (
                  <i className="mdi mdi-check-decagram ms-2 fs-2 text-primary"></i>
                ) : null}
              </h1>
            </div>
            <Col className="col-12 mb-3">
              {address && isUnsupported ? (
                <div
                  className="d-flex border rounded  justify-content-center align-items-center"
                  style={{
                    height: '400px',
                  }}
                >
                  <h3 className="text-center">No Chart Available</h3>
                </div>
              ) : (
                <PerformanceChart
                  address={token}
                  setIsUnsupported={false}
                  loading={loadingChart}
                  setLoading={setLoadingChart}
                />
              )}
              {/* <WalletCard /> */}
            </Col>
            <Col className="col-12 my-3">
              <Stats stats={data?.marketData} />
            </Col>
            <Col className="col-12 my-3">
              <About
                description={data?.description}
                links={data?.links}
                name={data?.name}
              />
            </Col>
            {/* <Col className="col-12 my-5">
              <Tags />
            </Col>
            <Col className="col-12 my-5">
              <Explorers />
            </Col>
            <Col className="col-12 my-5">
              <History />
            </Col> */}
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardTokens;
