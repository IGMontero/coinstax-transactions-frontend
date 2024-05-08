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

  const [data, setData] = useState();

  const dispatch = useDispatch();

  const { token } = useParams();

  const fetchToken = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchCoingeckoId({ coingeckoId: token }));

      if (response.payload) {
        setData(response.payload);
      } else {
        navigate('/');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchToken();
  }, [token]);

  // if (!data && !loading) {
  //   navigate('/');
  // }
  if (loading) {
    <div
      style={{
        height: '100vh',
      }}
    >
      <Spinner color="primary" className="m-2" />;
    </div>;
  }

  return (
    <React.Fragment>
      <div className="page-content ">
        <div className="mt-5 ">
          <div className="d-flex align-items-center">
            <img src={data?.image} alt="Ethereum" className="icon-lg me-2" />
            <span className="fs-4">{data?.symbol}</span>
          </div>
          <h1 className="d-flex align-items-center mt-3 mb-4">
            {data?.name}
            {data?.verified ? (
              <i className="mdi mdi-check-decagram ms-2 fs-2 text-primary"></i>
            ) : null}
          </h1>
        </div>
        <Col className="col-12 mb-5">
          <PerformanceChart
            address={token}
            setIsUnsupported={false}
            loading={loading}
            setLoading={setLoading}
          />

          <WalletCard />
        </Col>
        <Col className="col-12 my-5">
          <Stats />
        </Col>
        <Col className="col-12 my-5">
          <About description={data?.description} name={data?.name} />
        </Col>
        <Col className="col-12 my-5">
          <Tags />
        </Col>
        <Col className="col-12 my-5">
          <Explorers />
        </Col>
        <Col className="col-12 my-5">
          <History />
        </Col>
      </div>
    </React.Fragment>
  );
};

export default DashboardTokens;
