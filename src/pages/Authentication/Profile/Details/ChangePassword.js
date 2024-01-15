import React from "react";
import { TabPane, Row, Col, Label, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ChangePassword = ({ currentUser }) => {
  const dispatch = useDispatch();

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string().required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // try {
    //   const success = await dispatch(
    //     changePassword(values.newPassword, values.currentPassword)
    //   );
    //   if (success) {
    //     Swal.fire({
    //       title: "Success!",
    //       text: "Password changed successfully",
    //       icon: "success",
    //       confirmButtonText: "Ok",
    //     });
    //     resetForm();
    //   } else {
    //     Swal.fire({
    //       title: "Error!",
    //       text: "Failed to change password. Please try again",
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
    <TabPane tabId="3">
      <div className="mb-4">
        <div className="">
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-n2">
              <h3 className="text-muted">Change Password</h3>
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
                <Row className="col-12 mb-4 mt-4">
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
                    className={`btn btn-soft-primary mb-0 ${
                      isSubmitting || !dirty || !isValid
                        ? "bg bg-soft-primary border border-0 text-primary cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? "Changing ..." : "Change Password"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </TabPane>
  );
};

export default ChangePassword;
