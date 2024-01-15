// import React, { useState, useEffect } from "react";
// import { isEmpty } from "lodash";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Alert,
//   CardBody,
//   Button,
//   Label,
//   Input,
//   FormFeedback,
//   Form,
// } from "reactstrap";

// Formik Validation
// import * as Yup from "yup";
// import { useFormik } from "formik";

//redux
// import { useSelector, useDispatch } from "react-redux";

// import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
// import { editProfile, resetProfileFlag } from "../../slices/thunks";
// const UserProfile = () => {
//   const dispatch = useDispatch();

//   const { user, success, error } = useSelector((state) => ({
//     user: state.Profile.user,
//     success: state.Profile.success,
//     error: state.Profile.error,
//   }));

//   const [email, setemail] = useState(user.email);
//   const [idx, setidx] = useState("1");
//   const [photoUrl, setPhotoUrl] = useState();

//   const [userName, setUserName] = useState("Admin");

//   useEffect(() => {
//     if (localStorage.getItem("authUser")) {
//       const obj = JSON.parse(localStorage.getItem("authUser"));

//       if (!isEmpty(user)) {
//         obj.first_name = user.first_name;
//         localStorage.removeItem("authUser");
//         localStorage.setItem("authUser", JSON.stringify(obj));
//       }

//       setUserName(obj.first_name);
//       setemail(obj.email);
//       setidx(obj._id || "1");
//       setPhotoUrl(obj.photoURL);

//       setTimeout(() => {
//         dispatch(resetProfileFlag());
//       }, 3000);
//     }
//   }, [dispatch, user]);

//   const validation = useFormik({
//     enableReinitialize: true,

//     initialValues: {
//       first_name: userName || "Admin",
//       idx: idx || "",
//     },
//     validationSchema: Yup.object({
//       first_name: Yup.string().required("Please Enter Your UserName"),
//     }),
//     onSubmit: (values) => {
//       dispatch(editProfile(values));
//     },
//   });

//   document.title = "Profile | CoinsTax";
//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Row>
//             <Col lg="12">
//               {error && error ? <Alert color="danger">{error}</Alert> : null}
//               {success ? (
//                 <Alert color="success">Username Updated To {userName}</Alert>
//               ) : null}

//               <Card>
//                 <CardBody>
//                   <div className="d-flex">
//                     <div className="mx-3">
//                       <img
//                         src={photoUrl || avatar}
//                         alt=""
//                         className="avatar-md rounded-circle img-thumbnail"
//                       />
//                     </div>
//                     <div className="flex-grow-1 align-self-center">
//                       <div className="text-muted">
//                         <h5>{"Member"}</h5>
//                         <p className="mb-1">{email}</p>
//                         {/* <p className="mb-0">Id No : #{idx}</p> */}
//                       </div>
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>

//           <h4 className="card-title mb-4">Update Profile</h4>

//           <Card>
//             <CardBody>
//               <Form
//                 className="form-horizontal"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   validation.handleSubmit();
//                   return false;
//                 }}
//               >
//                 <div className="form-group">
//                   <Label className="form-label">User Name</Label>
//                   <Input
//                     name="first_name"
//                     // value={name}
//                     className="form-control"
//                     placeholder="Enter User Name"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.first_name || ""}
//                     invalid={
//                       validation.touched.first_name &&
//                       validation.errors.first_name
//                         ? true
//                         : false
//                     }
//                   />
//                   {validation.touched.first_name &&
//                   validation.errors.first_name ? (
//                     <FormFeedback type="invalid">
//                       {validation.errors.first_name}
//                     </FormFeedback>
//                   ) : null}
//                   <Input name="idx" value={idx} type="hidden" />
//                 </div>
//                 <div className="text-center mt-4">
//                   <Button type="submit" color="danger">
//                     Update User Name
//                   </Button>
//                 </div>
//               </Form>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default UserProfile;

import React, { useState } from "react";
import Info from "./Profile/Info";
import ChangeEmail from "./Profile/Details/ChangeEmail";
import ChangePassword from "./Profile/Details/ChangePassword";
import Details from "./Profile/Details/Details";
import NavProfile from "./Profile/NavProfile";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  TabContent,
  Alert,
  Form,
  FormFeedback,
  Input,
  Label,
  Button,
} from "reactstrap";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));

  const currentUser = user;

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <React.Fragment>
      <div className="page-content px-4 mt-0">
        <Card className="">
          <CardBody>
            <Container fluid>
              <Row>
                <Col xxl={3}>
                  <div className="px-4 py-3 border rounded">
                    <div className="text-center">
                      <h5 className="fs-16 mb-1">
                        {currentUser?.firstName && currentUser?.lastName
                          ? `${currentUser.firstName} ${currentUser.lastName}`
                          : "Member"}
                      </h5>
                    </div>
                  </div>

                  {/* CardInfo Profile */}

                  <Info currentUser={currentUser} />
                </Col>

                <Col>
                  <Card className="border shadow-md">
                    {/* Nav Bar  */}
                    <NavProfile
                      activeTab={activeTab}
                      tabChange={tabChange}
                      currentUser={currentUser}
                      // onInviteCode={handlePostInviteCode}
                      // openModalInviteCode={openModalInviteCode}
                      // setOpenModalInviteCode={setOpenModalInviteCode}
                    />
                    <CardBody className="p-4">
                      <TabContent activeTab={activeTab}>
                        {/* Details Page */}
                        <Details
                          currentUser={currentUser}
                          // onUpdateDetails={handleSubmitDetails}
                          // loading={loadingUpdate}
                          // successMessage={success}
                          // errorMessage={errorMessage}
                        />

                        {/* Change Email and password  */}
                        <ChangeEmail currentUser={currentUser} />

                        <ChangePassword currentUser={currentUser} />

                        {/* Plan Page  <PaymentInfo />*/}

                        {/* Access Page  */}
                        {/* <Access /> */}

                        {/* Data Page  */}
                        {/* <Data /> */}

                        {/* Close account Page  */}
                        {/* <CloseAccount /> */}
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
