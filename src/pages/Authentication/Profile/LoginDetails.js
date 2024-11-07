import React from 'react';
import { Col, TabPane } from 'reactstrap';
import ChangeEmail from './Details/ChangeEmail';
import ChangePassword from './Details/ChangePassword';

const LoginDetails = ({ currentUser }) => {
  return (
    <TabPane tabId="2">
      <Col lg={12}>
        {/* <h3 className="text-muted">Login Details</h3> */}
        {/* {authProvider === 'credentials' || */}
        {/* authProvider === 'jwt' || */}
        {/* !authProvider ? ( */}
        {/* <> */}
        {/* <p>
          You can change your email address that is also used as your login
        </p>{' '} */}
        {/* CHANGE PASSWORD  */}
        <ChangePassword currentUser={currentUser} />
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
        {/* </> */}
        {/*  )  */}
      </Col>
    </TabPane>
  );
};

export default LoginDetails;
