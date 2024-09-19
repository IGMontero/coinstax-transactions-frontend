import React, { useState } from 'react';
import Info from './Profile/Info';
import ChangeEmail from './Profile/Details/ChangeEmail';
import ChangePassword from './Profile/Details/ChangePassword';
import Details from './Profile/Details/Details';
import NavProfile from './Profile/NavProfile';
import { useSelector, useDispatch } from 'react-redux';
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
} from 'reactstrap';
import { capitalizeFirstLetter } from '../../utils/utils';
import Access from './Profile/Access';
import Plan from './Profile/Plan';
import CloseAccount from './Profile/CloseAccount';
import Data from './Profile/Data';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('2');
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <React.Fragment>
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

                  {/* Plan Page */}
                  <Plan />
                  {/* Access Page  */}
                  <Access />
                  {/* Data Page  */}
                  <Data />
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
