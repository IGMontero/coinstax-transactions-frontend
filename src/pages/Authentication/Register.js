import React, { useEffect, useState } from 'react';
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
import { timezonesArray } from '../../helpers/timeZones';
import { fetchApiVersion } from '../../slices/common/thunk';

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
    console.log('values', values);
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

  useEffect(() => {
    const initialize = async () => {

      // Make a request to the server api version, just to get the headers of response.
      const response = await dispatch(fetchApiVersion());

      console.log("Response headers of api version: ", response.headers);


      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const countryCode = response.headers?.get('CP-IPCountry');

      console.log("Resolved country code: ", countryCode);

      const country = fixedData?.countries.find(
        (item) => item.name == countryCode,
      );
      if (country) {
        validation.setFieldValue('country', country.code);
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
    }

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
                <Link to={'/wallets'}>
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
                        {error && error ? (
                          <Alert color="danger">
                            <div>{error}</div>
                          </Alert>
                        ) : null}

                        <div className="mb-2">
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


                        <div className="mb-2">
                          <Label htmlFor="timezone" className="form-label">
                            Time Zone <span className="text-danger">*</span>
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
                            <option value="">Select Country</option>
                            {fixedData?.countries.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>


                        <div className="mb-2">
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
