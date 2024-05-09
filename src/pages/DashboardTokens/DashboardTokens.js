import React, { useEffect, useState } from 'react';
import ChartTokens from './components/ChartTokens';
import { Col, Spinner } from 'reactstrap';
import ethIcon from '../../assets/images/svg/crypto-icons/eth.svg';
import Stats from './components/Stats';
import About from './components/About';
import Tags from './components/Tags';
import Explorers from './components/Explorers';
import WalletCard from './components/WalletCard';
import History from './components/History';
import { fetchCoingeckoId } from '../../slices/tokens/thunk';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PerformanceChart from '../DashboardInfo/components/PerformanceChart';

const DashboardTokens = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [loadingChart, setLoadingChart] = useState(false);

  const [data, setData] = useState();
  const [address, setAddress] = useState();

  const dispatch = useDispatch();

  const { token } = useParams();

  const fetchToken = async () => {
    try {
      setLoading(true);
      setLoadingChart(true);
      const response = await dispatch(fetchCoingeckoId({ coingeckoId: token }));

      const res = response.payload;

      if (res) {
        setData(res);
        setAddress(res.platforms?.ethereum);
      } else {
        if (!address) {
          navigate('/');
        }
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

  // if (!data && !loading) {
  //   navigate('/');
  // }

  return (
    <React.Fragment>
      <div className="page-content ">
        {loading ? (
          <div
            className="d-flex mt-5 justify-content-center align-items-center h-100vh"
            // style={{ height: !isDashboardPage ? '50vh' : '40vh' }}
          >
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
              <PerformanceChart
                address={address}
                setIsUnsupported={false}
                loading={loadingChart}
                setLoading={setLoadingChart}
              />

              {/* <WalletCard /> */}
            </Col>
            <Col className="col-12 my-3">
              <Stats stats={data.marketData} />
            </Col>
            <Col className="col-12 my-3">
              <About description={data?.description} name={data?.name} />
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
