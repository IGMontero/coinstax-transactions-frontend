import React from "react";
import { TabPane, Row, Col, Label, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

const ChangeEmail = ({ currentUser }) => {
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // try {
    //   const success = await dispatch(
    //     changeEmail(values.email, values.password)
    //   );
    //   if (success) {
    //     Swal.fire({
    //       title: "Success!",
    //       text: "Please check your email for verification",
    //       icon: "success",
    //       confirmButtonText: "Ok",
    //     });
    //     resetForm();
    //   } else {
    //     Swal.fire({
    //       title: "Error!",
    //       text: "Failed to change email",
    //       icon: "error",
    //       confirmButtonText: "Ok",
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   Swal.fire({
    //     title: "Error!",
    //     text: "An error occurred",
    //     icon: "error",
    //     confirmButtonText: "Ok",
    //   });
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <TabPane tabId="2">
      <Col lg={12} className="mb-4">
        <div className="">
          <div className="mb-2">
            <div className="d-flex justify-content-between algin-items-center mb-n2">
              <h3 className="text-muted">Change Email</h3>
            </div>
            <hr />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
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
                <Row>
                  <div className="col-6">
                    <Label htmlFor="password" className="form-label">
                      Password
                    </Label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-6">
                    <Label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
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
                <div className="d-flex justify-content-start mt-4">
                  <Button
                    type="submit"
                    color="soft-primary"
                    disabled={isSubmitting || !dirty || !isValid}
                    className={`btn btn-soft-primary mb-0 ${
                      isSubmitting || !dirty || !isValid
                        ? "bg bg-soft-primary border border-0 text-primary cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? "Changing ..." : "Change Email"}
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
