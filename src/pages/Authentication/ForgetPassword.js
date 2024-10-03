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
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from '../../Components/Common/withRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { forgotPassword } from '../../slices/auth2/thunk';

import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import Helmet from '../../Components/Helmet/Helmet';
import { parseValuesToLocale } from '../../utils/utils';
import Swal from 'sweetalert2';

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
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
      <div className="auth-page-content mt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot your password?</h5>
                    {/* <p className="text-muted">
                      Enter your email and we'll send you instructions to reset it.
                    </p> */}

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: '120px', height: '120px' }}
                    ></lord-icon>
                  </div>

                  <Alert
                    className="alert-borderless alert-warning text-center mb-2 mx-2"
                    role="alert"
                  >
                    Enter your email and we'll send you instructions to reset
                    it.
                  </Alert>
                  <div className="p-2">
                    {/* {forgetError ? (
                      <Alert color="danger" style={{ marginTop: '13px' }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: '13px' }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null} */}
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
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
                          className="mt-3 d-flex btn-hover-light w-100 justify-content-center align-items-center"
                          color="soft-light"
                          style={{
                            borderRadius: '10px',
                            border: '.5px solid grey',
                          }}
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
                  Remember your password? <br />
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
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
