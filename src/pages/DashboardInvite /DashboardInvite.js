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
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Helmet from '../../Components/Helmet/Helmet';
import logo from '../../assets/images/logos/coinstax_logos/logo-dark.png';
import {
  acceptInviteCodeAU,
  acceptInviteCodeUA,
  declineInviteCodeAU,
  declineInviteCodeUA,
  verifyInviteCodeUA,
  verifyInviteCodeAU,
} from '../../slices/userWallets/thunk';
import {
  DASHBOARD_USER_ROLES,
  INVITECODETYPE,
  userInviteTypes,
} from '../../common/constants';
import Swal from 'sweetalert2';
import {
  acceptInviteCodeAA,
  declineInviteCodeAA,
  verifyInviteCodeAA,
} from '../../slices/agents/thunks';

const DashboardInvite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const inviteType = queryParams.get('type');
  const isValidInviteType = Object.values(userInviteTypes).includes(inviteType);

  if (!isValidInviteType) {
    navigate('/login');
  }
  const handleInviteAction = (inviteType, actions, inviteCode) => {
    switch (inviteType) {
      case INVITECODETYPE.USER_TO_ACCOUNTANT:
        return actions.ua({ inviteCode });
      case INVITECODETYPE.ACCOUNTANT_TO_USER:
        return actions.au({ inviteCode });
      case INVITECODETYPE.ACCOUNTANT_TO_AGENT:
        return actions.aa({ inviteCode });
      default:
        throw new Error('Invalid invite type');
    }
  };

  const handleVerifyInvite = async () => {
    try {
      setLoading(true);
      const inviteCode = queryParams.get('code');
      console.log('Verifying invite code', inviteCode);

      const request = handleInviteAction(
        inviteType,
        {
          ua: verifyInviteCodeUA,
          au: verifyInviteCodeAU,
          aa: verifyInviteCodeAA,
        },
        code,
      );

      const response = await dispatch(request).unwrap();
      if (response && response.error) {
        setErrorMsg('Invite code is invalid');
      } else {
        console.log('Invite code verified');
      }
    } catch (error) {
      console.log(error);
      setErrorMsg('Invite code is invalid');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerifyInvite();
    const queryParams = new URLSearchParams(location.search);
    const inviteCode = queryParams.get('code');
    setCode(inviteCode);
  }, [location.search]);

  const handleAcceptInvite = async () => {
    try {
      setLoading(true);
      const request = handleInviteAction(
        inviteType,
        {
          ua: acceptInviteCodeUA,
          au: acceptInviteCodeAU,
          aa: acceptInviteCodeAA,
        },
        code,
      );
      const response = await dispatch(request).unwrap();

      if (response && !response.error) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Invite accepted successfully!',
        });

        if (user?.role === DASHBOARD_USER_ROLES.USER) {
          navigate('/wallets');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    try {
      setLoading(true);
      const request = handleInviteAction(
        inviteType,
        {
          ua: declineInviteCodeUA,
          au: declineInviteCodeAU,
          aa: declineInviteCodeAA,
        },
        code,
      );
      const response = await dispatch(request).unwrap();

      if (response && response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
        return;
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Invite declined successfully!',
        });

        if (user?.role === DASHBOARD_USER_ROLES.USER) {
          navigate('/wallets');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderAcceptInvite = () => (
    <div className="d-flex justify-content-center">
      <div className="text-center">
        <h4>Accept invite?</h4>
        <p>Somebody wants to manage your wallets on ChainGlance.</p>
        <div className="d-flex justify-content-center">
          <Button onClick={handleAcceptInvite} color="primary" className="me-2">
            Accept
          </Button>
          <Button onClick={handleDeclineInvite} color="danger">
            Decline
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLogInOrRegisterToAcceptInvite = () => (
    <div className="d-flex justify-content-center">
      <div className="text-center">
        <h4>Log in or Register to accept invite</h4>
        <div className="d-flex align-items-center justify-content-around">
          <Button
            onClick={() => navigate(`/login?code=${code}&type=${inviteType}`)}
            className="mt-3 d-flex btn-hover-light w-50 text-dark justify-content-center align-items-center"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            Log in
          </Button>
          <Button
            onClick={() =>
              navigate(`/register?code=${code}&type=${inviteType}`)
            }
            className="mt-3 d-flex btn-hover-light w-50 ms-2  text-dark justify-content-center align-items-center"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );

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
                          <div className="d-flex flex-column">
                            <Alert
                              className="mb-0"
                              color="danger"
                              isOpen={errorMsg !== ''}
                            >
                              {errorMsg}
                            </Alert>
                            <div className="mt-4 text-center">
                              <Link to="/login" className="text-muted">
                                Back to login
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <>
                            {user
                              ? renderAcceptInvite()
                              : renderLogInOrRegisterToAcceptInvite()}
                          </>
                        )}
                      </div>
                    )}
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
