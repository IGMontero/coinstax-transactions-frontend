import React, { useEffect, useState } from 'react';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import Helmet from '../../Components/Helmet/Helmet';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import logo from '../../assets/images/logos/chainglance/logo-dark.png';
import { verifyEmail } from '../../slices/auth2/thunk';
import { useSelector, useDispatch } from 'react-redux';
import { layoutModeTypes } from '../../Components/constants/layout';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tokenParams = new URLSearchParams(location.search);
  const token = tokenParams.get('token');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const handleVerifyToken = async () => {
    setLoading(true);
    try {
      const response = await dispatch(verifyEmail(token));
      console.log(response);
      if (response.error) {
        setErrorMessage('Please try again or request a new link in your profile.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerifyToken();
  }, []);

  return (
    <ParticlesAuth>
      <Helmet title="Confirm Email" />
      <div className="auth-page-content">
        <Container>
          <Row className="justify-content-center">
            <div className="d-flex justify-content-center align-items-center">
              <Link to={'/'}>
                <img
                  src={logo}
                  className="card-logo "
                  alt="Chain Glance"
                  height="70"
                  width="auto"
                />
              </Link>
            </div>
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4 text-center">
                  <div className="text-center my-3">
                    <h3 className={isDarkMode ? "text-white" : "text-primary"}>Verify Email</h3>
                  </div>
                  <div class="py-2">
                    {errorMessage ? (
                      <div className="text-danger text-center mt-3" style={{'min-height':100}}>
                        This link is invalid. Please try again or request a new link in your profile.
                      </div>
                    ) : (
                      <div className="text-center mt-3" style={{'min-height':100}}>
                        Your email was successfully verified. You can close this tab.
                        </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default VerifyEmail;
