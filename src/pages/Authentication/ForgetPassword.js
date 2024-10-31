import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Button,
  Spinner,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { forgotPassword } from '../../slices/auth2/thunk';

import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import Helmet from '../../Components/Helmet/Helmet';
import { parseValuesToLocale } from '../../utils/utils';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import { layoutModeTypes } from '../../Components/constants/layout';

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please enter your email address'),
    }),
    onSubmit: (values) => {
      handleForgotPassword(values.email);
    },
  });

  const handleForgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await dispatch(forgotPassword(email));

      const res = response.payload;

      console.log(res);
      console.log(response);

      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Reset link sent to your email',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);
    }
  };

  return (
    <ParticlesAuth>
      <Helmet title={'Reset Password'} />
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
                    <h3 className={isDarkMode ? "text-white" : "text-primary"}>Forgot your password?</h3>
                  </div>

                  <div class="p-2 my-4">
                    If you have forgotten your password, please enter your email address and we will send instructions on how to reset
                    it. If you have not received an email within a few minutes, please check your spam folder or contact us.
                  </div>
                  <div className="p-2">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Enter you email address</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Email address"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ''}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.email}</div>
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <Button
                          color={isDarkMode ? "primary" : "primary"}
                          className="mt-3 d-flex w-100 justify-content-center align-items-center"
                          type="submit"
                        >
                          {loading ? (
                            <>
                              <Spinner
                                size="sm"
                                color="primary"
                                className="me-2"
                              />
                              {'Sending Reset Link'}
                            </>
                          ) : (
                            'Send Reset Link'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="fw-semibold text-link text-decoration-underline"
                  >
                    {' '}
                    Sign In
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
