import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Form, Button, Col, Input, Label, Row, TabPane } from 'reactstrap';
import {
  updateUserInfo,
  updateNotificationsPreferences,
  resendVerificationEmail,
  changeEmail,
  changeEmailPending,
  forgotPassword,
} from '../../../../slices/auth2/thunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import ChangeEmail from './ChangeEmail';
import { capitalizeFirstLetter } from '../../../../utils/utils';
import { layoutModeTypes } from '../../../../Components/constants/layout';

const Details = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;

  const authProvider = currentUser?.authProvider;
  const fixedData = useSelector((state) => state.Common.fixedData);

  const hasPassword = currentUser?.hasPassword;

  const isEmailAuth = authProvider === 'email';
  const isGoogleAuth = authProvider === 'google';

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [errorMessage, setErrorMessage] = React.useState('');
  const [errorMessageVerifyEmail, setErrorMessageVerifyEmail] =
    React.useState('');
  const [email, setEmail] = React.useState(currentUser?.email);
  const [loadingNotificationsPreference, setLoadingNotificationsPreference] =
    React.useState(false);

  const [notificationPreferences, setNotificationPreference] = React.useState(
    currentUser?.notificationsPreferences,
  );

  const [loadingEmailConfirmed, setLoadingPendingChangeEmail] =
    React.useState(false);
  const [pendingChangeEmail, setPendingChangeEmail] = React.useState(false);

  const [loadingUpdateInfo, setLoadingUpdateInfo] = React.useState(false);
  const [loadingResendVerificationEmail, setLoadingResendVerificationEmail] =
    React.useState(false);
  const [timezone, setTimezone] = React.useState(currentUser?.timezone);
  const [country, setCountry] = React.useState(currentUser?.country);
  const [currency, setCurrency] = React.useState(currentUser?.currency);

  const [pendingEmailChangeSent, setPendingEmailChangeSent] = React.useState();

  useEffect(() => {
    setEmail(currentUser?.email);
    setTimezone(currentUser?.timezone);
    setCountry(currentUser?.country);
    setCurrency(currentUser?.currency);
    setNotificationPreference(currentUser?.notificationPreferences);
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      setLoadingUpdateInfo(true);
      const res = await dispatch(
        updateUserInfo({
          country,
          timezone,
          currency,
        }),
      );
      const response = res.payload;
      if (res.error || response.error) {
        setErrorMessage(response.error || 'An error occurred');
      } else {
        setErrorMessage('');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User info updated successfully',
        });
      }
      setLoadingUpdateInfo(false);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
      setLoadingUpdateInfo(false);
    }
  };

  const handleUpdateNotificationsPreference = async () => {
    try {
      setLoadingNotificationsPreference(true);
      const res = await dispatch(
        updateNotificationsPreferences({
          emailMarketing: notificationPreferences?.emailMarketing,
        }),
      );
      const response = res.payload;
      if (res.error || response.error) {
        setErrorMessage(response.error || 'An error occurred');
      } else {
        setErrorMessage('');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notifications preferences updated successfully',
        });
      }
      setLoadingNotificationsPreference(false);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
      setLoadingNotificationsPreference(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      setLoadingResendVerificationEmail(true);
      const res = await dispatch(resendVerificationEmail());
      const response = res.payload;

      console.log('response', response);
      if (response.error) {
        setErrorMessageVerifyEmail(response.message || 'An error occurred');
      } else {
        setErrorMessageVerifyEmail('');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Verification email sent successfully',
        });
        setPendingChangeEmail(true);
      }
      setLoadingResendVerificationEmail(false);
    } catch (error) {
      setErrorMessageVerifyEmail(error.message || 'An error occurred');
      setLoadingResendVerificationEmail(false);
    }
  };

  const handlePendingChangeEmail = async () => {
    try {
      setLoadingPendingChangeEmail(true);
      const res = await dispatch(changeEmailPending());
      const response = res.payload;

      if (res.error || !response || response.error) {
        setPendingChangeEmail(false);
      } else {
        setPendingChangeEmail(true);
        setPendingEmailChangeSent(response?.newEmail || '');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
    } finally {
      setLoadingPendingChangeEmail(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
      setErrorMessageVerifyEmail('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [errorMessage, errorMessageVerifyEmail]);

  const [showChangeEmail, setShowChangeEmail] = React.useState(false);

  const toggleChangeEmail = () => {
    if (!showChangeEmail) {
      handlePendingChangeEmail();
    }
    setShowChangeEmail(!showChangeEmail);
  };

  return (
    <TabPane tabId="1">
      <Row>
        <Col className='col-xl-6 col-12'>
          <div className="mb-2">
            <Label className="form-label">Email</Label>
            <Input
              className="form-control cursor-not-allowed text-muted"
              style={{ cursor: 'not-allowed' }}
              value={currentUser?.email}
              readOnly
            />
          </div>

          {!isEmailAuth && (
            <p
              style={{
                // color: 'green',
                marginTop: '10px',
              }}
            >
              Your account is connected with{' '}
              {capitalizeFirstLetter(authProvider)}.
              {/* <br />Please visit your Google account to manage{' '}
              <Link
                target="_blank"
                to="https://security.google.com/settings/security/permissions"
              >
                Account Permissions
              </Link>
              . */}
            </p>
          )}

          {currentUser?.emailVerified ? null : ( // <span className="badge bg-soft-success fs-8 mt-2">Verified</span>
            <div className='mb-3'>
              <span className="badge bg-danger fs-8 mt-2">
                Not Verified
              </span>
              {loadingResendVerificationEmail ? (
                <span className="spinner-border spinner-border-sm ms-2"></span>
              ) : (
                <Button
                  color="link"
                  className="text-decoration-none"
                  onClick={handleResendVerificationEmail}
                >
                  Resend Verification Email
                </Button>
              )}{' '}
              {errorMessageVerifyEmail ? (
                <Alert color="danger"> {errorMessageVerifyEmail}</Alert>
              ) : null}
            </div>
          )}

          {/* {isEmailAuth && ( */}
          <Button
            color={isDarkMode ? "primary" : "soft-primary"}
            className='mt-2'
            onClick={toggleChangeEmail}
          >
            {showChangeEmail ? 'Hide' : 'Change Email'}
          </Button>

          {showChangeEmail && (
            <>
              {loadingEmailConfirmed ? (
                <div className="d-flex mt-4">
                  <span className="spinner-border spinner-border-sm ms-2"></span>
                </div>
              ) : (
                <>
                  {!hasPassword ? (
                    <>
                      <p className="my-4">
                        You need to create a password to change your email. <br /> Click the <em>Security</em>
                        tab to set up a new password.
                        {/* <Link
                          style={{
                            marginLeft: '5px',
                          }}
                          to="/profile/security"
                        >
                          Security
                        </Link> */}

                      </p>
                    </>
                  ) : (
                    <ChangeEmail
                      onRefresh={handlePendingChangeEmail}
                      pendingChangeEmail={pendingChangeEmail}
                      pendingEmailChangeSent={pendingEmailChangeSent}
                    />
                  )}
                </>
              )}
            </>
          )}

          <hr />
          <h3 className="text-muted mb-3">Preferences</h3>

          <div className="mb-3">
            <Label className="form-label">Country</Label>
            <select
              name="country"
              id="countryInput"
              className="form-select"
              value={country || ''}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            >
              <option value="">Select Country</option>
              {fixedData?.countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div class="mb-3">
            <Label htmlFor="timezoneInput" className="form-label">
              Time Zone
            </Label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="form-select"
              id="timezoneInput"
              name="timeZone"
            >
              <option value="">Auto</option>
              {fixedData?.timezones.map((item) => (
                <option key={item.id} value={item.id}>
                  <span dangerouslySetInnerHTML={{ __html: item.name }} />
                </option>
              ))}
            </select>
          </div>

          {/* <Row>
            <Col lg={6}>
              <Label className="form-label">Your Currency</Label>
              <select
                name="currency"
                id="currencyInput"
                value={currency || ''}
                onChange={(e) => {
                  setCurrency(e.target.value);
                }}
                className="form-select"
              >
                <option value="">Select Currency</option>
                {fixedData?.currencies.map((item) => (
                  <option key={item.id} value={item.id}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${item.symbol} - ${item.name}`,
                      }}
                    />
                  </option>
                ))}
              </select>
            </Col>
          </Row> */}

          <Button
            type="submit"
            color={isDarkMode || loadingUpdateInfo ? "primary" : "soft-primary"}
            onClick={handleUpdate}
            disabled={loadingUpdateInfo}
            className={`mb-3 ${loadingUpdateInfo
              ? 'border border-0 cursor-not-allowed'
              : ''
              }`}
          >
            Update
          </Button>
          
          {/* <h3 className="text-muted">Crypto Pricing</h3>
          <Col lg={12} className="mx-1">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="formCheck1"
              />
              <label className="form-check-label" htmlFor="formCheck1">
                Use daily pricing (2019 and earlier)
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="formCheck2"
              />
              <label className="form-check-label" htmlFor="formCheck2">
                USDC always equals 1 USD
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="formCheck3"
              />
              <label className="form-check-label" htmlFor="formCheck3">
                USDT always equals 1 USD
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="formCheck4"
              />
              <label className="form-check-label" htmlFor="formCheck4">
                1 GUSD always equals 1 USD
              </label>
            </div>
            <div className=" form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="formCheck5"
              />
              <label className="form-check-label" htmlFor="formCheck5">
                1 BUSD always equals 1 USD
              </label>
            </div>
          </Col> */}
          <hr />
          <h3 className="text-muted mb-3">Communication</h3>
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="formCheck6"
              checked={notificationPreferences?.emailMarketing}
              onChange={(e) =>
                setNotificationPreference({
                  ...notificationPreferences,
                  emailMarketing: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="formCheck6">
              Keep me up to date about this website
            </label>
          </div>

          <div class="mt-4">
            {errorMessage ? (
              <Alert color="danger"> {errorMessage} </Alert>
            ) : null}
          </div>

          <Button
            type="submit"
            color={isDarkMode || loadingNotificationsPreference ? "primary" : "soft-primary"}
            onClick={handleUpdateNotificationsPreference}
            disabled={loadingNotificationsPreference}
            className={`mb-0 ${loadingNotificationsPreference
              ? 'border border-0 cursor-not-allowed'
              : ''
              }`}
          >
            Update
          </Button>
        </Col>
      </Row>
    </TabPane>
  );
};

export default Details;
