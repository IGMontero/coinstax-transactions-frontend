import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import Helmet from '../../Components/Helmet/Helmet';
import { confirmEmailChange } from '../../slices/auth2/thunk';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import { layoutModeTypes } from '../../Components/constants/layout';

const ConfirmEmail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const tokenParams = new URLSearchParams(location.search);
  const token = tokenParams.get('token');

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleConfirmEmailChange = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await dispatch(confirmEmailChange(token));
      if (response.error) {
        setErrorMessage(
          'Please try again or request a new email change link in your profile.',
        );
        return;
      }

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleConfirmEmailChange();
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
                <CardBody className="p-4">
                  <div className="text-center my-3">
                    <h3 className={isDarkMode ? "text-white" : "text-primary"}>Confirm Email</h3>
                  </div>
                  <div class="p-2 my-4">
                    {errorMessage ? (
                      <div className="text-danger text-center mt-3" style={{'min-height':100}}>
                        {errorMessage}
                      </div>
                    ) : loading ? (
                      <>
                        <div className="text-center mt-3" style={{'min-height':100}}>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center mt-3" style={{'min-height':100}}>
                          Your email has been changed successfully. You can close this tab.
                        </div>
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

export default ConfirmEmail;
