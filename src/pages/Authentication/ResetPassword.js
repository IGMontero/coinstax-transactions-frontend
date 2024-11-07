import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Alert,
  Spinner,
} from 'reactstrap';

//formik
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import logo from '../../assets/images/logos/chainglance/logo-dark.png';
import Helmet from '../../Components/Helmet/Helmet';
import { useLogOut } from '../../hooks/useAuth';
import {
  resetPassword,
  verifyResetPasswordToken,
} from '../../slices/auth2/thunk';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import { layoutModeTypes } from '../../Components/constants/layout';

const ResetPaswword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [verifiedToken, setVerifiedToken] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [confrimPasswordShow, setConfrimPasswordShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const tokenParams = new URLSearchParams(location.search);
  const token = tokenParams.get('token');

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      password: '',
      confrim_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('This field is required'),
      confrim_password: Yup.string()
        .when('password', {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref('password')],
            'Passwords do not match',
          ),
        })
        .required('Confirm password required'),
    }),
    onSubmit: (values) => {
      handleResetPassword(values.password);
    },
  });

  const handleVerifyToken = async () => {
    setVerifiedToken('');
    try {
      const response = await dispatch(verifyResetPasswordToken(token));
      if (response && response.error) {
        setVerifiedToken(false);
        setErrorMessage(response.error.message ? response.error.message : response.error);
        return;
      }

      const data = response.payload;
      if (data && data.error) {
        setVerifiedToken(false);
        setErrorMessage(data.error.message);
        return;
      }

      setVerifiedToken(true);
  } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleVerifyToken();
  }, []);

  const handleResetPassword = async (newPassword) => {
    setErrorMessage('');
    try {
      const response = await dispatch(
        resetPassword({
          token,
          newPassword,
        }),
      );
      if (response && response.error) {
        setErrorMessage(response.error.message ? response.error.message : response.error);
        return;
      }
      var data = response.payload;
      if (!data || data.error) {
        setErrorMessage(data && data.error.message ? data.error.message : 'An error occured setting your password');
        return;
      }

      navigate('/wallets');
      
    } catch (error) {
      setErrorMessage(error.message ? error.message : error);
    }
  };

  return (
    <ParticlesAuth>
      {' '}
      <Helmet title="Reset Password" />
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
                  <div className="text-center my-3">
                    <h3 className={isDarkMode ? "text-white" : "text-primary"}>Create a new password</h3>
                  </div>
                  {!verifiedToken ? (
                    <div className="p-2 mt-4">
                      {verifiedToken === false ? (
                        <div className="text-center mt-5 mb-5" style={{'min-height':100}}>
                        <p className="text-danger pt-5">This is an invalid of expired link. Please try again.</p>
                      </div>
                      ) : (
                        <div className="text-center mt-3">
                        <Spinner color="primary" />
                      </div>
                    )}
                    </div>
                  ) : (
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={validation.handleSubmit}
                        action="/auth-signin-basic"
                      >
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="password-input">
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup">
                            <Input
                              type={passwordShow ? 'text' : 'password'}
                              className="form-control pe-5 password-input"
                              placeholder="Enter password"
                              id="password-input"
                              name="password"
                              autoFocus
                              value={validation.values.password}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.password &&
                                  validation.touched.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.password &&
                              validation.touched.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <Button
                              color="link"
                              onClick={() => setPasswordShow(!passwordShow)}
                              className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="confirm-password-input"
                          >
                            Confirm password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              type={confrimPasswordShow ? 'text' : 'password'}
                              className="form-control pe-5 password-input"
                              placeholder="Confirm password"
                              id="confirm-password-input"
                              name="confrim_password"
                              value={validation.values.confrim_password}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.confrim_password &&
                                  validation.touched.confrim_password
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.confrim_password &&
                              validation.touched.confrim_password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.confrim_password}
                              </FormFeedback>
                            ) : null}
                            <Button
                              color="link"
                              onClick={() =>
                                setConfrimPasswordShow(!confrimPasswordShow)
                              }
                              className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                          </div>
                        </div>

                        {errorMessage && (
                          <Alert color="danger">{errorMessage}</Alert>
                        )}

                        <div className="mt-4">
                          <Button
                            color={isDarkMode ? "primary" : "primary"}
                            className="mt-3 d-flex w-100 justify-content-center align-items-center"
                            type="submit"
                          >
                            Reset Password
                          </Button>
                        </div>
                      </Form>
                    </div>
                  )}
                </CardBody>
              </Card>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Login to you account{' '}
                  <Link
                    to="/login"
                    className="fw-semibold text-link text-decoration-underline"
                  >
                    {' '}
                    Signin{' '}
                  </Link>{' '}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default ResetPaswword;
