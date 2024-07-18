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
import { Link, useNavigate } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { login } from '../../slices/auth2/thunk';
import SocialAuth from '../../Components/SocialAuth/SocialAuth';
import Swal from 'sweetalert2';
//import images

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { error, status, user } = useSelector((state) => state.auth);

  const [errorMsg, setErrorMsg] = useState(error?.toString());

  const [passwordShow, setPasswordShow] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await dispatch(login(values));
      if (response.payload.error) {
        setErrorMsg('Error in login. Please try again');
        setLoading(false);
      } else {
        Swal.fire({
          title: 'Success',
          text: 'Login Successful',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
      setErrorMsg('Error in login. Please try again');
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
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
    }
  }, [dispatch, error]);

  document.title = 'Login | Chain Glance';
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content ">
          <Container>
            <Row className=" justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className="text-primary">Welcome Back !</h3>
                      <h6 className="text-muted">
                        Sign in to continue to Chain Glance.
                      </h6>
                    </div>
                    {errorMsg && errorMsg ? (
                      <Alert color="danger"> {errorMsg} </Alert>
                    ) : null}
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
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
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
                            <Link to="/forgot-password" className="text-muted">
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

                        <div className="form-check">
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
                        </div>

                        <div className="mt-4">
                          <Button
                            disabled={loading ? true : false}
                            type="submit"
                            className="mt-3 d-flex btn-hover-light w-100 justify-content-center align-items-center"
                            color="soft-light"
                            style={{
                              borderRadius: '10px',
                              border: '.5px solid grey',
                            }}
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
                            <h5 className="fs-13 mb-4 title">Sign In with</h5>
                          </div>
                          <SocialAuth />
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account ?{' '}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
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
