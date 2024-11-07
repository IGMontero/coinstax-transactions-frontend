import React from 'react';
import { TabPane, Row, Col, Label, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword, forgotPassword } from '../../../../slices/auth2/thunk';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../../../../utils/utils';
import { layoutModeTypes } from '../../../../Components/constants/layout';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const hasPassword = user?.hasPassword;

  const authProvider = user?.authProvider;
  const isEmailAuth = authProvider === 'email';
  const isGoogleAuth = authProvider === 'google';

  const [resetPwEmailSent, setResetPwEmailSent] = React.useState(false);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      const { currentPassword, newPassword } = values;
      const resultAction = await dispatch(
        changePassword({ oldPassword: currentPassword, newPassword }),
      );

      if (changePassword.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been successfully changed.',
        });
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            resultAction.payload ||
            'An error occurred while changing password.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while changing password.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetUpPassword = async () => {
    try {
      Swal.fire({
        title: 'Please wait...',
        text: 'Sending reset link...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await dispatch(forgotPassword(user.email));
      const res = response.payload;

      Swal.close();

      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        setResetPwEmailSent(true);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'An email was sent to you with details on how to set up your password.',
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      Swal.close();
      console.log('error', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <TabPane tabId="3">
      <h3 className="text-muted mb-3">Change Password</h3>
      {/* {!isEmailAuth ? (
        <Col lg={12} className="my-4">
          <p>Your account is connected with {
            capitalizeFirstLetter(authProvider)
          }. You cannot change your password.</p>
        </Col> */}
      {!hasPassword ? (
        <>
          {resetPwEmailSent ? (
            <>
              <p className="mt-4">
                An email was sent to you with details on how to set up your
                password.
              </p>

              <Button
                onClick={handleSetUpPassword}
                color={isDarkMode ? "primary" : "soft-primary"}
              >
                Resend Email
              </Button>
            </>
          ) : (
            <>
              <p className="mt-4">Your account does not have a password.</p>
              <Button
                onClick={handleSetUpPassword}
                color={isDarkMode ? "primary" : "soft-primary"}
              >
                Set up a new password
              </Button>
            </>
          )}

        </>
      ) : (
        <div className="mb-4">
          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleChangePassword}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form>
                  <Row>
                    <div className="col-xl-6 col-12">
                      <div className="mb-4">
                        <Label htmlFor="currentPassword" className="form-label">
                          Enter your current password
                        </Label>
                        <Field
                          name="currentPassword"
                          type="password"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="newPassword" className="form-label">
                          New password
                        </Label>
                        <Field
                          name="newPassword"
                          type="password"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="confirmPassword" className="form-label">
                          Confirm new password
                        </Label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </Row>
                  <div className="d-flex justify-content-start mb-0 ">
                    <Button
                      type="submit"
                      color={isDarkMode || !dirty || !isValid? "primary" : "soft-primary"}
                      disabled={isSubmitting || !dirty || !isValid}
                      className={`mb-0 ${isSubmitting || !dirty || !isValid
                        ? 'border border-0 cursor-not-allowed'
                        : ''
                        }`}
                    >
                      {isSubmitting ? 'Changing ...' : 'Change Password'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </TabPane>
  );
};

export default ChangePassword;
