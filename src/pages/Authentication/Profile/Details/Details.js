import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Input, Row, TabPane } from 'reactstrap';

// Formk validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';

const Details = (props) => {
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;

  const authProvider = currentUser?.authProvider;

  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState(currentUser?.email);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  return (
    <TabPane tabId="1">
      <Row>
        <Col lg={12}>
          <Col lg={12}>
            {authProvider === 'credentials' ||
            authProvider === 'jwt' ||
            !authProvider ? (
              <>
                {/* <p>
                  You can change your email address that is also used as your
                  login
                </p> */}
                <ChangeEmail
                  onChangeEmail={() => {}}
                  currentUser={currentUser}
                />

                {/* CHANGE PASSWORD  */}
                <ChangePassword
                  onChangePassword={() => {}}
                  currentUser={currentUser}
                />

                {/* <Col lg={6}>
                  <h3 className="text-muted mb-2">Security Code (2FA)</h3> */}

                {/* {!has2FA && (
                    <>
                      {' '}
                      {!qrCode && (
                        <>
                          <p>
                            Two-factor authentication adds another layer of
                            security to your account by requiring a code that
                            changes over time along with your password.
                          </p>
                          <p>
                            Enter your password to start adding a 2FA/Security
                            code onto your account.
                          </p>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              className="form-control mb-3"
                              placeholder="Current Password"
                              id="password2FA"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                              tabIndex={-1}
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                              onClick={() => setShowPassword(!showPassword)}
                              type="button"
                              id="password2FA"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </>
                      )}
                      {qrCode && (
                        <>
                          <p>
                            If you don`t have an app yet, you can use one of
                            these or a number of other free ones in the app
                            stores.
                          </p>
                          <div className="mb-4">
                           
                          </div>
                          <p>
                            Scan the following image into your phone`s
                            two-factor authenticator app or enter the secret key
                            displayed below:
                          </p>
                          <div>
                            <div className="">
                              <img src={qrCode} width={200} alt="QR Code"></img>
                            </div>
                            <div className=" ms-4">
                              <p dangerouslySetInnerHTML={{ __html: code }}></p>
                            </div>
                          </div>
                        </>
                      )}
                      {!qrCode ? (
                        <button
                          disabled={!password || loadingCode}
                          onClick={() => {}}
                          className="btn btn-m btn-primary"
                        >
                          Add Security Code
                        </button>
                      ) : (
                        <>
                          <p>
                            After scanning the image, or entering the key, your
                            app should now show a 6 digit code that you can
                            enter here.
                          </p>
                          <Input
                            onChange={(e) => setSecurity2FA(e.target.value)}
                            placeholder="Current Security Code"
                          />
                          <button
                            disabled={!password || loadingCode}
                            onClick={() => {
                              setPassword('');
                            }}
                            className="btn btn-m btn-primary mt-3"
                          >
                            Confirm Security Code
                          </button>
                          <button
                            onClick={() => {
                              setQrCode('');
                            }}
                            className="btn btn-m btn-danger mx-2 mt-3"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {has2FA && (
                    <>
                      {' '}
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          id="password-addon"
                          className="form-control mb-3"
                          placeholder="Current Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          tabIndex={-1}
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                          id="password2FA"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </button>
                      </div>
                      <Input
                        onChange={(e) => setSecurity2FA(e.target.value)}
                        placeholder="Current Security Code"
                      />
                      <button
                        onClick={() => {
                          setPassword('');
                        }}
                        className="btn btn-m btn-danger mt-3"
                      >
                        Delete Security Code
                      </button>
                    </>
                  )} */}
                {/* </Col> */}
              </>
            ) : (
              <>
                <p>
                  Your login details are provided by{' '}
                  {authProvider === 'google'
                    ? 'Google'
                    : authProvider === 'coinbase' && 'Coinbase'}{' '}
                  and cannot be changed here
                </p>
                {authProvider === 'google' && (
                  <p>
                    Please visit your Google account to manage{' '}
                    <Link
                      target="_blank"
                      to="https://security.google.com/settings/security/permissions"
                    >
                      Account Permissions
                    </Link>
                    .
                  </p>
                )}
                <Col lg={6}>
                  <Input
                    className="form-control cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
                    value={currentUser?.email}
                    readOnly
                  />
                </Col>
              </>
            )}
          </Col>
        </Col>

        <h3 className="text-muted">Crypto Pricing</h3>
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
        </Col>
        <h3 className="text-muted mb-3">Communication</h3>
        <Col lg={12} className="mx-1">
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="formCheck6"
            />
            <label className="form-check-label" htmlFor="formCheck6">
              Keep me up to date about this website
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="formCheck7"
            />
            <label className="form-check-label" htmlFor="formCheck7">
              Share my information with partners to hear about related products
              and services
            </label>
          </div>
        </Col>
        <Col lg={12} className="mb-4">
          {/* {console.log(errorMessage)} */}
          <Button
            disabled={loadingUpdate}
            onClick={() => {}}
            className="btn btn-success mb-3"
          >
            Update
          </Button>
          <Col lg={3}>
            {errorMessage ? (
              <Alert color="danger"> {errorMessage} </Alert>
            ) : null}
          </Col>
        </Col>
      </Row>
    </TabPane>
  );
};

export default Details;
