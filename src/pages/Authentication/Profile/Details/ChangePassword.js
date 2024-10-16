import React from 'react';
import { TabPane, Row, Col, Label, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword } from '../../../../slices/auth2/thunk';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const authProvider = user?.authProvider;
  const isEmailAuth = authProvider === 'email';
  const isGoogleAuth = authProvider === 'google';

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

  return (
    <TabPane tabId="3">
      <h3 className="text-muted mb-3">Change Password</h3>
      {isGoogleAuth ? (
        <Col lg={12} className="my-4">
          <p>Your account is connected with Google. You can't change your password.</p>
        </Col>
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
                  <Row className="col-12 mb-4">
                    <div className="col-6">
                      <Label htmlFor="currentPassword" className="form-label">
                        Current Password
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
                    <div className="col-6">
                      <Label htmlFor="newPassword" className="form-label">
                        New Password
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
                  </Row>
                  <Row className="col-12 mb-4">
                    <div className="col-6">
                      <Label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
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
                  </Row>
                  <div className="d-flex justify-content-start mb-0 ">
                    <Button
                      type="submit"
                      color="soft-primary"
                      disabled={isSubmitting || !dirty || !isValid}
                      className={`btn btn-soft-primary mb-0 ${isSubmitting || !dirty || !isValid
                        ? 'bg bg-soft-primary border border-0 text-primary cursor-not-allowed'
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
