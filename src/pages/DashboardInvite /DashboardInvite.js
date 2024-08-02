import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Alert,
  Button,
} from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Helmet from '../../Components/Helmet/Helmet';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import { useSelector } from 'react-redux';
import { verifyInviteCode } from '../../slices/userWallets/thunk';
import { userInviteTypes } from '../../common/constants';
//import images

const DashboardInvite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);


  const inviteType = queryParams.get('type')
  const isValidInviteType = Object.values(userInviteTypes).includes(inviteType);

  if (!isValidInviteType) {
    // Redirect to login page if invite type is invalid
    navigate('/login');
  }

  const handleVerifyInvite = async () => {
    try {
      setLoading(true);
      const inviteCode = queryParams.get('code');

      console.log('Verifying invite code', inviteCode);

      const response = await dispatch(verifyInviteCode({ inviteCode: inviteCode }));

      console.log(response);
      const res = response.payload;
      if (res && response.error) {
        setErrorMsg('Invite code is invalid');
      } else {
        console.log('Invite code verified');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerifyInvite();
    const queryParams = new URLSearchParams(location.search);
    const inviteCode = queryParams.get('code');
    setCode(inviteCode);
    // if (!user) {
    //   handleVerifyInvite();
    //   const queryParams = new URLSearchParams(location.search);
    //   const inviteCode = queryParams.get('code');
    //   setCode(inviteCode);
    // } else {
    //   navigate(`/login?code=${code}`);
    // }
  }, [location.search]);

  const handleAcceptInvite = () => {
    // Accept invite
    console.log('Accepting invite');
  }

  const handleDeclineInvite = () => {
    // Decline invite
    console.log('Declining invite');
  }


  const renderAcceptUserToAccountantInvite = () => {
    // Show something like.. user name invited you to manage their wallets. Accept or decline
    return (
      <div className="d-flex justify-content-center">
        <div className="text-center">
          <h4>Accept invite?</h4>

          <p>Somebody has invited you to manage their wallets on ChainGlance.</p>

          <div className="d-flex justify-content-center">
            <Button
              onClick={handleAcceptInvite}
              color="primary"
              className="me-2"
            >
              Accept
            </Button>
            <Button onClick={handleDeclineInvite} color="danger">
              Decline
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderAcceptAccountantToUserInvite = () => {
    // Show accountant name wants to manage your wallets. Accept or decline
    return (
      <div className="d-flex justify-content-center">
        <div className="text-center">
          <h4>Accept invite?</h4>

          <p>Somebody wants to manage your wallets on ChainGlance.</p>

          <div className="d-flex justify-content-center">
            <Button
              onClick={handleAcceptInvite}
              color="primary"
              className="me-2"
            >
              Accept
            </Button>
            <Button onClick={handleDeclineInvite} color="danger">
              Decline
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderAcceptAccountantToAgentInvite = () => {
    // Show accountant name wants to invite you as an agent. Accept or decline
    return (
      <div className="d-flex justify-content-center">
        <div className="text-center">
          <h4>Accept invite?</h4>

          <p>Somebody invited you as an agent on ChainGlance.</p>

          <div className="d-flex justify-content-center">
            <Button
              onClick={handleAcceptInvite}
              color="primary"
              className="me-2"
            >

              Accept
            </Button>

            <Button onClick={handleDeclineInvite} color="danger">
              Decline
            </Button>
          </div>
        </div>
      </div>
    )
  }



  const renderAcceptInvite = () => {
    // Render result based on invite type
    switch (inviteType) {
      case userInviteTypes.USER_TO_ACCOUNTANT:
        return renderAcceptUserToAccountantInvite();
      case userInviteTypes.ACCOUNTANT_TO_USER:
        return renderAcceptAccountantToUserInvite();
      case userInviteTypes.ACCOUNTANT_TO_AGENT:
        return renderAcceptAccountantToAgentInvite();
      default:
        return null;
    }
  };

  const renderLogInToAcceptInvite = () => {
    return (
      // Render login button and text, if user is not authenticated
      <div className="d-flex justify-content-center">
        <div className="text-center">
          <h4>Log in to accept invite</h4>
          <Button
            onClick={() => navigate('/login')}
            color="primary"
            className="me-2"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }




  return (
    <React.Fragment>
      <Helmet title="Invite" />
      <ParticlesAuth>
        <div className="auth-page-content mt-5 ">
          <Container>
            <Row className=" justify-content-center">
              <div className="d-flex justify-content-center align-items-center">
                <Link to={'/'}>
                  <img
                    src={logo}
                    className="card-logo "
                    alt="logo dark"
                    height="70"
                    width="auto"
                  />
                </Link>
              </div>
              <Col md={8} lg={6} xl={6}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center my-3">
                      <h3 className="text-primary">Welcome to ChainGlance</h3>
                      {/* <h6 className="text-muted">
                        Verifying invite code: {code}
                      </h6> */}
                    </div>
                    {loading ? (
                      <div className="d-flex aling-items-center justify-content-center">
                        <Spinner color="primary" size="lg" />
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center">
                        {errorMsg ? (
                          <>
                            <Alert className="mb-0" color="danger" isOpen={errorMsg !== ''}>
                              {errorMsg}
                            </Alert>
                            <div className="mt-4 text-center">
                              <Link to="/login" className="text-muted">
                                Back to login
                              </Link>
                            </div>
                          </>

                        ) : (
                          <>

                            {user ? renderAcceptInvite() : renderLogInToAcceptInvite()}

                          </>

                        )}

                      </div>
                    )}


                    {/* // Back to login page */}
                    {/* <div className="mt-4 text-center">
                      <Link to="/login" className="text-muted">
                        Back to login
                      </Link>
                    </div> */}

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};
export default DashboardInvite;
