import React, { useState } from 'react';
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from 'reactstrap';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

// action
import { register } from '../../slices/auth2/thunk';

//redux
import { useDispatch } from 'react-redux';

import { Link, useLocation, useNavigate } from 'react-router-dom';

//import images
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import SocialAuth from '../../Components/SocialAuth/SocialAuth';
import Helmet from '../../Components/Helmet/Helmet';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { DASHBOARD_USER_ROLES } from '../../common/constants';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [error, setError] = useState();

  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
      role: 'user',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
      role: Yup.string().required('Please Select Your Account Type'),
      confirm_password: Yup.string().when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'Password and Confirm Password do not match',
        ),
      }),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const isSubmitDisabled = () => {
    const { email, password, confirm_password } = validation.values;
    return (
      !email ||
      !password ||
      // !role ||
      password !== confirm_password ||
      validation.errors.confirm_password ||
      loading
    );
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await dispatch(register(values));

      if (response && !response.error) {
        // navigate('/wallets/connect');
        Swal.fire({
          // title: 'Success',
          text: 'Welcome to ChainGlance!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        if (code && type) {
          navigate(`/invite?code=${code}&type=${type}`);
        } else {
          navigate('/wallets/connect');
        }
      } else {
        setError(response.error.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Register" />
      <ParticlesAuth>
        <div className="auth-page-content mt-n3">
          <Container>
            <Row className="justify-content-center">
              <div className="d-flex justify-content-center align-items-center">
                <Link to={'/'}>
                  <img
                    src={logo}
                    className="card-logo"
                    alt="logo dark"
                    height="70"
                    width="auto"
                  />
                </Link>
              </div>
              <Col md={9} lg={7} xl={7}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className="text-primary">Create a New Account</h3>
                      <h6 className="text-muted">
                        Sign up to continue to ChainGlance
                      </h6>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {/* {success && success ? (
                          <>
                            {toast('Your Redirect To Login Page...', {
                              position: 'top-right',
                              hideProgressBar: false,
                              className: 'bg-success text-white',
                              progress: undefined,
                              toastId: '',
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Register User Successfully and Your Redirect To
                              Login Page...
                            </Alert>
                          </>
                        ) : null} */}

                        {error && error ? (
                          <Alert color="danger">
                            <div>{error}</div>
                          </Alert>
                        ) : null}

                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email address"
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
                              <div>{validation.errors.email}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        {/* <div className="mb-3">
                          <Label htmlFor="role" className="form-label">
                            Account Type <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.role || ''}
                            invalid={
                              validation.touched.role && validation.errors.role
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Account Type</option>
                            <option value="user">User</option>
                            <option value="accountant">Accountant</option>
                          </Input>
                          {validation.touched.role && validation.errors.role ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.role}</div>
                            </FormFeedback>
                          ) : null}
                        </div> */}

                        <div className="mb-2">
                          <Label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ''}
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
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirm Password{' '}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ''}
                            invalid={
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.confirm_password &&
                          validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.confirm_password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button
                            type="submit"
                            disabled={isSubmitDisabled()}
                            className="mt-3 d-flex btn-hover-light text-dark w-100 justify-content-center align-items-center"
                            color="soft-light"
                            style={{
                              borderRadius: '10px',
                              border: '.5px solid grey',
                            }}
                          >
                            {loading ? (
                              <>
                                <Spinner
                                  color="primary"
                                  size="sm"
                                  className="me-2"
                                />{' '}
                                Loading...
                              </>
                            ) : (
                              'Submit'
                            )}
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">
                              Sign up with
                            </h5>
                          </div>

                          <SocialAuth />
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{' '}
                    <Link
                      to={
                        code && type
                          ? `/login?code=${code}&type=${type}`
                          : '/login'
                      }
                      className="fw-semibold text-primary text-decoration-underline"
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
    </React.Fragment>
  );
};

export default Register;
