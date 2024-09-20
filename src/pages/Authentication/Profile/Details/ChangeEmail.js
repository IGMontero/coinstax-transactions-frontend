import React from 'react';
import { TabPane, Col, Label, Button } from 'reactstrap';
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
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is Required'),
  });

  const handleChangeEmail = async (values) => {
    try {
      setLoadingUpdate(true);
      const res = await dispatch(changeEmail(values));
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
          icon: 'success',
          title: 'Success',
          text: 'Email has been updated',
        });
      }
    } catch (error) {
      // Handle exception
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <TabPane tabId="2">
      <Col lg={12} className="mb-4">
        <div className="">
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-n2">
              <h3 className="text-muted">Change Email</h3>
            </div>
            <hr />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleChangeEmail}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form>
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
                <div className="d-flex justify-content-start mt-4">
                  <Button
                    type="submit"
                    color="soft-primary"
                    disabled={isSubmitting || !dirty || !isValid}
                    className={`btn btn-soft-primary mb-0 ${
                      isSubmitting || !dirty || !isValid
                        ? 'bg bg-soft-primary border border-0 text-primary cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isSubmitting ? 'Changing ...' : 'Change Email'}
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
