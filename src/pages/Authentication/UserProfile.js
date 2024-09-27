import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Row, TabContent } from 'reactstrap';
import Access from './Profile/Access';
import CloseAccount from './Profile/CloseAccount';
import Details from './Profile/Details/Details';
import LoginDetails from './Profile/LoginDetails';
import NavProfile from './Profile/NavProfile';
import Plan from './Profile/Plan';
import Helmet from '../../Components/Helmet/Helmet';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('1');
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <React.Fragment>
      <Helmet title="Profile" />

      <div className="pt-5 mt-1">
        <Row className=" justify-content-center">
          {/* <Col xxl={3}>
            <div className="py-3 border rounded">
              <div className="text-center">
                <h5 className="fs-16 mb-1">
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : capitalizeFirstLetter(currentUser?.role)}
                </h5>
              </div>
            </div>


            <Info currentUser={currentUser} />
          </Col> */}

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
                  <Details currentUser={currentUser} />
                  {/* Change Email and password  */}
                  <LoginDetails currentUser={currentUser} />

                  {/* Plan Page */}
                  <Plan />
                  {/* Access Page  */}
                  <Access />
                  {/* Data Page  */}
                  {/* <Data /> */}
                  {/* Close account Page  */}
                  <CloseAccount />
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
