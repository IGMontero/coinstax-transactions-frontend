import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  Spinner,
} from 'reactstrap';

// Formik Validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

// action
import { register } from '../../slices/auth2/thunk';

//redux
import { useDispatch } from 'react-redux';

import { Link, useLocation, useNavigate } from 'react-router-dom';

//import images
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import Helmet from '../../Components/Helmet/Helmet';
import SocialAuth from '../../Components/SocialAuth/SocialAuth';
import { fetchUserCountry } from '../../slices/common/thunk';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const fixedData = useSelector((state) => state.Common.fixedData);

  const [error, setError] = useState();

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
      currency: '',
      country: '',
      role: 'user',
      timezone: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please enter your email'),
      password: Yup.string().required('Please enter your password'),
      role: Yup.string().required('Please select your account yype'),
      confirm_password: Yup.string().when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'Password and confirm password do not match',
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

      if (response && response.payload && response.payload.error) {
        setError(response.payload.error.message);
        setLoading(false);
      }
      else if (response && !response.error) {
        // navigate('/wallets/connect');
        // Swal.fire({
        //   title: 'Success',
        //   text: 'Welcome to ChainGlance!',
        //   icon: 'success',
        //   timer: 2000,
        //   showConfirmButton: false,
        // });
        if (code && type) {
          navigate(`/invite?code=${code}&type=${type}`);
        } else {
          navigate('/wallets/connect');
        }
      } else {
        setError(response.error ? response.error.message : response.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Make a request to the server api version, just to get the headers of response.
      const response = await dispatch(fetchUserCountry());

      const userCountry = response.country || null;

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      let countryCode = userCountry;

      if (countryCode === 'XX' || !countryCode) {
        countryCode = 'US';
      }
      const country = fixedData?.countries.find(
        (item) => item.code == countryCode,
      );
      if (country) {
        validation.setFieldValue('country', country.code);

        const countryCurrency = country.currency;

        // Find currency in fixed data
        const currency = fixedData?.currencies.find(
          (item) => item.symbol === countryCurrency,
        );

        if (currency) {
          validation.setFieldValue('currency', currency.id);
        } else {
          validation.setFieldValue('currency', '');
        }
      } else {
        validation.setFieldValue('country', '');
      }

      const timezone = fixedData?.timezones.find(
        (item) => item.id === userTimezone,
      );

      if (timezone) {
        validation.setFieldValue('timezone', timezone.id);
      } else {
        validation.setFieldValue('timezone', '');
      }
    };

    initialize();
  }, []);

  // Effect when country is changed
  useEffect(() => {
    if (validation.values.country) {
      const country = fixedData?.countries.find(
        (item) => item.code === validation.values.country,
      );

      const countryCurrency = country?.currency;

      // Find currency in fixed data
      const currency = fixedData?.currencies.find(
        (item) => item.symbol === countryCurrency,
      );

      if (currency) {
        validation.setFieldValue('currency', currency.id);
      }
    }
  }, [validation.values.country]);

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
                    alt="Chain Glance"
                    height="70"
                    width="auto"
                  />
                </Link>
              </div>
              <Col md={9} lg={6} xl={6}>
                <Card className="mt-4" >
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className="text-primary">Create a new Chain Glance account</h3>
                      {/* <h6 className="text-muted">
                        Sign up to continue to ChainGlance
                      </h6> */}
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
                        {error && error ? (
                          <Alert color="danger">
                            <div>{error}</div>
                          </Alert>
                        ) : null}

                        <div className="mb-2">
                          <Label htmlFor="useremail" className="form-label">
                            Email address <span className="text-danger">*</span>
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

                        <div className="mb-2">
                          <Label htmlFor="timezone" className="form-label">
                            Timezone <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="timezone"
                            value={validation.values.timezone || ''}
                            onChange={validation.handleChange}
                            className="form-control"
                          >
                            <option value="">Select a Timezone</option>{' '}
                            {fixedData?.timezones.map((item) => (
                              <option key={item.id} value={item.id}>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: item.name,
                                  }}
                                />
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-2 mt-3 ">
                          <Label className="form-label">
                            Country <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="country"
                            value={validation.values.country}
                            onChange={(e) => {
                              validation.handleChange(e);
                            }}
                            className="form-control"
                          >
                            <option value="">Select...</option>
                            {fixedData?.countries.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>


                        {/* <div className="mb-2">
                          <Label htmlFor="currency" className="form-label">
                            Currency <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="currency"
                            value={validation.values.currency || ''}
                            onChange={validation.handleChange}
                            className="form-control"
                          >
                            <option value="">Select a Currency</option>{' '}
                            {fixedData?.currencies.map((item) => (
                              <option key={item.id} value={item.id}>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: `${item.symbol} - ${item.name}`,
                                  }}
                                />
                              </option>
                            ))}
                          </select>
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
                            Confirm password{' '}
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
                            color="primary"
                            className="mt-3 d-flex w-100 text-light justify-content-center align-items-center"
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
                              Or
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
