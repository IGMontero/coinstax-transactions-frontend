import React, { useEffect, useState } from 'react';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import Helmet from '../../Components/Helmet/Helmet';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import { verifyEmail } from '../../slices/auth2/thunk';
import { useDispatch } from 'react-redux';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tokenParams = new URLSearchParams(location.search);
  const token = tokenParams.get('token');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleVerifyToken = async () => {
    setLoading(true);
    try {
      const response = await dispatch(verifyEmail(token));
      console.log(response);
      if (response.error) {
        setErrorMessage('Error Verifying Email');
      } else {
        setSuccessMessage('Email verified successfully');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
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
                  alt="logo dark"
                  height="70"
                  width="auto"
                />
              </Link>
            </div>
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h3 className="text-primary">
                      {loading
                        ? 'Verifying Email...'
                        : errorMessage
                          ? 'Error verifying email'
                          : successMessage}
                    </h3>
                  </div>
                  <div>
                    {errorMessage && (
                      <div className="text-danger text-center mt-3">
                        Please try again
                      </div>
                    )}
                    {successMessage && (
                      <>
                        <div className="text-success text-center mt-3">
                          Your email has been verified successfully
                        </div>
                        <h3> Redirecting to Chainglance ... </h3>
                      </>
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
