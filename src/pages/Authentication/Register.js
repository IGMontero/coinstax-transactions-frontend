import React, { useEffect } from 'react';
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
} from 'reactstrap';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, apiError, resetRegisterFlag } from '../../slices/thunks';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

//import images
import logoLight from '../../assets/images/logo-light.png';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import SocialAuth from '../../Components/SocialAuth/SocialAuth';

const Register = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',

      full_name: '',

      // username: '',
      password: '',
      confirm_password: '',
      account_type: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      full_name: Yup.string().required('Please Enter Your Full Name'),
      password: Yup.string().required('Please Enter Your Password'),
      account_type: Yup.string().required('Please Select Your Account Type'),
      confirm_password: Yup.string().when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          "Confirm Password Isn't Match",
        ),
      }),
    }),
    onSubmit: (values) => {
      return dispatch(registerUser(values, dispatch));
    },
  });

  const { error, success } = useSelector((state) => ({
    success: state.Account.success,
    error: state.Account.error,
  }));

  useEffect(() => {
    dispatch(apiError(''));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => history('/login'), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);

  document.title = 'Register | Chain Glance';

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-n3">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h4 className="text-primary">Create New Account</h4>
                      <h6 className="text-muted">
                        Get your free Chain Glance account now
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
                        {success && success ? (
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
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>
                              Email has been Register Before, Please Use Another
                              Email Address...{' '}
                            </div>
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
                        <div className="mb-3">
                          <Label htmlFor="full_name" className="form-label">
                            Full Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="full_name"
                            type="text"
                            placeholder="Enter full name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.full_name || ''}
                            invalid={
                              validation.touched.full_name &&
                              validation.errors.full_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.full_name &&
                          validation.errors.full_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.full_name}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        {/* <div className="mb-3">
                          <Label htmlFor="last_name" className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="last_name"
                            type="text"
                            placeholder="Enter last name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.last_name || ''}
                            invalid={
                              validation.touched.last_name &&
                              validation.errors.last_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.last_name &&
                          validation.errors.last_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.last_name}</div>
                            </FormFeedback>
                          ) : null}
                        </div> */}
                        <div className="mb-3">
                          <Label htmlFor="account_type" className="form-label">
                            Account Type <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            name="account_type"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.account_type || ''}
                            invalid={
                              validation.touched.account_type &&
                              validation.errors.account_type
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Account Type</option>
                            <option value="type1">Type 1</option>
                            <option value="type2">Type 2</option>
                          </Input>
                          {validation.touched.account_type &&
                          validation.errors.account_type ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.account_type}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

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
                            className="mt-3 d-flex btn-hover-light w-100 justify-content-center align-items-center"
                            color="soft-light"
                            style={{
                              borderRadius: '10px',
                              border: '.5px solid grey',
                            }}
                          >
                            Sign Up
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">
                              Create account with
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
                      to="/login"
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
