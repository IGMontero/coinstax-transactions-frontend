import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { authMe, login } from '../../slices/auth2/thunk';
import SocialAuth from '../../Components/SocialAuth/SocialAuth';
import Helmet from '../../Components/Helmet/Helmet';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logos/chainglance/logo-dark.png';
import { DASHBOARD_USER_ROLES } from '../../common/constants';
import { layoutModeTypes } from '../../Components/constants/layout';
import {
  setAddressSearched,
  setPrevAddress,
} from '../../slices/layoutMenuData/reducer';
//import images

const Login = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [loading, setLoading] = useState(false);

  const { error } = useSelector((state) => state.auth);

  const [errorMsg, setErrorMsg] = useState('');

  const [passwordShow, setPasswordShow] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await dispatch(login(values));
      
      if (response.error) {
        setErrorMsg('Invalid email address or password');
        setLoading(false);
      } else {
        const authMeRes = await dispatch(authMe());
        dispatch(setPrevAddress(null));
        dispatch(setAddressSearched(null));

        const { role } = authMeRes.payload;

        if (role === DASHBOARD_USER_ROLES.USER) {
          if (code && type) {
            navigate(`/invite?code=${code}&type=${type}`);
          } else {
            navigate('/wallets');
          }
        } else if (role === DASHBOARD_USER_ROLES.ADMIN) {
          navigate('/admin/clients');
        } else {
          navigate('/clients');
        }
      }
    } catch (error) {
      setErrorMsg('Error in login. Please try again');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: (values) => {
      dispatch(handleLogin(values));
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (error === 'auth-failed') {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: 'Your login attempt was unsuccessful. Please try again.',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }, [location.search]);

  return (
    <React.Fragment>
      <Helmet title="Login" />
      <ParticlesAuth>
        <div className="auth-page-content ">
          <Container>
            <Row className=" justify-content-center">
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
              <Col md={9} lg={6} xl={6}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className={isDarkMode ? "text-white" : "text-primary"}>Sign in to Chain Glance</h3>
                    </div>
                    <div className="p-2 mt-4">
                      <Form onSubmit={validation.handleSubmit} action="#">
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            autoFocus
                            onChange={validation.handleChange}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email &&
                                validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                            validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link
                              tabIndex={5}
                              to="/forgot-password"
                              className="text-muted"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ''}
                              type={passwordShow ? 'text' : 'password'}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                  validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                              validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              onClick={() => setPasswordShow(!passwordShow)}
                              id="password-addon"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        {/* <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Remember me
                          </Label>
                        </div> */}

                        {errorMsg ? (
                          <div className="alert alert-danger">{errorMsg} </div>
                        ) : null}

                        <div className="mt-4">
                          <Button
                            disabled={loading ? true : false}
                            color={isDarkMode ? "primary" : "primary"}
                            type="submit"
                            className="mt-3 d-flex w-100 justify-content-center align-items-center"
                          >
                            {loading ? (
                              <Spinner size="sm" className="me-2">
                                {' '}
                                Loading...{' '}
                              </Spinner>
                            ) : null}
                            Sign In
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Or</h5>
                          </div>
                          <SocialAuth />
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link
                      to={
                        code && type
                          ? `/register?code=${code}&type=${type}`
                          : '/register'
                      }
                      className="fw-semibold text-link text-decoration-underline"
                    >
                      {' '}
                      Signup{' '}
                    </Link>{' '}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
