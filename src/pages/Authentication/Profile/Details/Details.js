import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Alert,
  Button,
  Col,
  Input,
  Label,
  Row,
  Spinner,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
// Formk validation

const Details = ({
  currentUser,
  //   onUpdateDetails,
  //   loading,
  //   successMessage,
  //   errorMessage,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    email: currentUser?.email || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    phoneNumber: currentUser?.phoneNumber || "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    onUpdateDetails(values);
    setSubmitting(false);
  };

  return (
    <TabPane tabId="1">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form>
            <Row className="">
              <div className="mb-2">
                <div className="d-flex justify-content-between algin-items-center mb-n2">
                  <h3 className="text-muted">Account Information</h3>
                </div>
                <hr />
              </div>
              <Col lg={12} className="mb-4">
                <Row>
                  <div className="col-6">
                    <Label htmlFor="firstName" className="form-label">
                      First Name
                    </Label>
                    <Field
                      type="text"
                      name="firstName"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-6">
                    <Label htmlFor="lastName" className="form-label">
                      Last Name
                    </Label>
                    <Field
                      type="text"
                      name="lastName"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </Row>
              </Col>
            </Row>
            <div className="col-12 justify-content-between align-items-center d-flex ">
              <Button
                type="submit"
                color="soft-primary"
                disabled={isSubmitting || loading || !dirty || !isValid}
                className={`btn btn-soft-primary mb-0 ${
                  isSubmitting || loading || !dirty || !isValid
                    ? "bg bg-soft-primary border border-0 text-primary cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? (
                  <Spinner size="sm" className="me-2">
                    {" "}
                    Loading...{" "}
                  </Spinner>
                ) : null}
                Update
              </Button>

              <div className="col-4 mt-1 justify-content-end">
                {successMessage && (
                  <Alert color="success" className="p-2 mt-n1 mb-0">
                    Profile Updated Successfully
                  </Alert>
                )}
                {errorMessage && (
                  <Alert color="danger" className="p-2 mt-n1 mb-0">
                    {errorMessage}
                  </Alert>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </TabPane>
  );
};

export default Details;
