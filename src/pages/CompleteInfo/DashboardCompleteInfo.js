import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Label,
  Form,
  Button,
  Spinner,
} from 'reactstrap';

// Formik Validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

// action
import { updateUserInfo } from '../../slices/auth2/thunk';

//redux
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

//import images
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';

import Helmet from '../../Components/Helmet/Helmet';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { authMe } from '../../slices/auth2/thunk';

import { fetchUserCountry } from '../../slices/common/thunk';

const DashboardCompleteInfo = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fixedData = useSelector((state) => state.Common.fixedData);

  const [error, setError] = useState();

  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      currency: '',
      country: '',
      timezone: '',
    },
    validationSchema: Yup.object({
      country: Yup.string().required('Country is required'),
      currency: Yup.string().required('Currency is required'),
      timezone: Yup.string().required('Timezone is required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const isSubmitDisabled = () => {
    const { country, currency, timezone } = validation.values;
    return !country || !currency || !timezone || loading;
  };

  const authenticate = async () => {
    await dispatch(authMe());

    setLoading(false);
  };

  const handleSubmit = async (values) => {
    console.log('values', values);
    try {
      setLoading(true);
      const res = await dispatch(
        updateUserInfo({
          country: values.country,
          currency: values.currency,
          timezone: values.timezone,
        }),
      );
      const response = res.payload;
      if (res.error || response.error) {
        setError(res.error || response.error || 'Something went wrong');
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User info updated successfully',
        });
        authenticate();
      }
      navigate('/wallets');
      setLoading(false);
    } catch (error) {
      setError(error || 'Something went wrong');
      setLoading(false);
    }
  };

  const isProfileComplete = user.country && user.currency && user.timezone;

  useEffect(() => {
    if (user) {
      if (isProfileComplete) {
        navigate('/wallets');
      }
    } else {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    const initialize = async () => {
      // Make a request to the server api version, just to get the headers of response.
      const response = await dispatch(fetchUserCountry());

      const userCountry = response.country || null;

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const countryCode = userCountry;

      if (countryCode === 'XX' || !countryCode) {
        validation.setFieldValue('country', '');
      } else if (countryCode) {
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
      <Helmet title="Complete Profile" />
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
                      <h3 className="text-primary">Welcome to ChainGlance!</h3>
                      <h6 className="text-muted">
                        Complete to continue to ChainGlance
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
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default DashboardCompleteInfo;