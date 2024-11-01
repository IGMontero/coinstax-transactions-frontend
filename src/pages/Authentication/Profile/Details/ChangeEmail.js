import React from 'react';
import { TabPane, Col, Label, Button, Row } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { changeEmail, resendChangeEmail } from '../../../../slices/auth2/thunk';
import { layoutModeTypes } from '../../../../Components/constants/layout';
import Swal from 'sweetalert2';

const ChangeEmail = ({
  pendingChangeEmail,
  pendingEmailChangeSent,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [loadingResend, setLoadingResend] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleChangeEmail = async (values, { resetForm }) => {
    const { email: newEmail, password } = values;
    try {
      setLoadingUpdate(true);

      const response = await dispatch(changeEmail({ newEmail, password }));
      const data = response.payload;
      if (response.error) {
        setErrorMessage(response.error.message);
        return;
      }
      if (data.error) {
        setErrorMessage(data.error.message);
        return;
      }
      
      setErrorMessage('');
      setSuccessMessage('An email has been sent to your new email address. Please verify your email.');
      //onRefresh();
      //resetForm();
  } catch (error) {
      console.log(error);
      setErrorMessage(error.message || error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoadingResend(true);
      const res = await dispatch(resendChangeEmail());
      const response = res.payload;
      console.log(response);
      if (res.error || response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'An error occurred',
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Verification Resent',
          text: 'An email has been resent to your new email address. Please verify your email.',
        });
      }
      setLoadingResend(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An error occurred',
      });

      setLoadingResend(false);
      console.log(error);
    }
  };

  return (
    <TabPane tabId="2">
      <Col className="col-12 mt-4">
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleChangeEmail}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form>
                <div className="mb-4">
                  <Label htmlFor="email" className="form-label">
                    Enter the new email address
                  </Label>
                  <Field type="text" name="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="password" className="form-label">
                    Verify with your current password
                  </Label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                <div className="d-flex justify-content-start mt-1">
                  <Button
                    type="submit"
                    color={isDarkMode || isSubmitting || !dirty || !isValid ? "primary" : "soft-primary"}
                    disabled={isSubmitting || !dirty || !isValid}
                    className={`mb-0 ${isSubmitting || !dirty || !isValid
                      ? 'border border-0 cursor-not-allowed'
                      : ''
                    }`}
                  >
                    Change Email
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          {pendingChangeEmail && (
            <>
              <p className="mt-3 mb-0 ps-1 text-muted">
                An email was sent to {pendingEmailChangeSent}. Please click the
                link inside to change your email
              </p >
              <Button
                color="link"
                disabled={loadingResend}
                className="text-primary  ps-1 text-decoration-none"
                onClick={handleResendEmail}
              >
                Resend email
              </Button>
            </>
          )}
        </div >
      </Col >
    </TabPane >
  );
};

export default ChangeEmail;
