import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Helmet from '../../Components/Helmet/Helmet';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import { useSelector } from 'react-redux';
//import images

const DashboardInvite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const handleVerifyInvite = async () => {
    setLoading(true);
    try {
      // await dispatch(verifyInvite(code));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      handleVerifyInvite();
      const queryParams = new URLSearchParams(location.search);
      const inviteCode = queryParams.get('code');
      setCode(inviteCode);
    } else {
      navigate(`/login?code=${code}`);
    }
  }, [location.search]);

  return (
    <React.Fragment>
      <Helmet title="Invite" />
      <ParticlesAuth>
        <div className="auth-page-content mt-5 ">
          <Container>
            <Row className=" justify-content-center">
              <div className="d-flex justify-content-center align-items-center">
                <Link to={'/'}>
                  <img
                    src={logo}
                    className="card-logo "
                    alt="logo dark"
                    height="70"
                    width="auto"
                  />
                </Link>
              </div>
              <Col md={8} lg={6} xl={6}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className="text-primary">Welcome to ChainGlance</h3>
                      <h6 className="text-muted">
                        Verifying invite code: {code}
                      </h6>
                    </div>
                    <div className="d-flex aling-items-center justify-content-center">
                      <Spinner color="primary" size="lg" />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};
export default DashboardInvite;
