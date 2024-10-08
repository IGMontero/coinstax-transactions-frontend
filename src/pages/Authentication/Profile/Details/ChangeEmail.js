import React from 'react';
import { TabPane, Col, Label, Button, Row } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { changeEmail } from '../../../../slices/auth2/thunk';
import Swal from 'sweetalert2';

const ChangeEmail = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is Required'),
    password: Yup.string().required('Password is Required'),
  });

  const handleChangeEmail = async (values, { resetForm }) => {
    const { email: newEmail, password } = values;
    try {
      setLoadingUpdate(true);
      const res = await dispatch(changeEmail({ newEmail, password }));
      const response = res.payload;
      console.log(response);
      if (res.error || response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'An error occurred',
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Verification Needed',
          text: 'An email has been sent to your new email address. Please verify your email.',
        });
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An error occurred',
      });

      console.log(error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <TabPane tabId="2">
      <Col lg={12} className="mb-4">
        <div className="">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleChangeEmail}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form>
                <Row>
                  <div className="col-6 mt-4 mb-4">
                    <Label htmlFor="email" className="form-label">
                      New Email
                    </Label>
                    <Field type="text" name="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-6 mt-4 mb-4">
                    <Label htmlFor="password" className="form-label">
                      Password
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
                </Row>

                <div className="d-flex justify-content-start mt-4">
                  <Button
                    type="submit"
                    color="soft-primary"
                    disabled={isSubmitting || !dirty || !isValid}
                    className={`btn btn-soft-primary mb-0 ${isSubmitting || !dirty || !isValid
                        ? 'bg bg-soft-primary border border-0 text-primary cursor-not-allowed'
                        : ''
                      }`}
                  >
                    {isSubmitting ? 'Changing ...' : 'Submit'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Col>
    </TabPane>
  );
};

export default ChangeEmail;
