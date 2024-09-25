import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Input, Label, Row, TabPane } from 'reactstrap';

const Details = (props) => {
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;

  const authProvider = currentUser?.authProvider;
  const fixedData = useSelector((state) => state.Common.fixedData);

  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState(currentUser?.email);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [timezone, setTimezone] = React.useState(currentUser?.timezone);
  const [country, setCountry] = React.useState(currentUser?.country);

  useEffect(() => {
    setEmail(currentUser?.email);
    setTimezone(currentUser?.timezone);
    setCountry(currentUser?.country);
  }, [currentUser]);

  console.log(currentUser.country);

  return (
    <TabPane tabId="1">
      <Row>
        <Col lg={12}>
          <h3 className="text-muted">Preferences</h3>
          <hr />
          <Row>
            <Col lg={6}>
              <Label className="form-label">Your Currency</Label>
              {/* <SelectSymbol value={currency} onChange={(value) => setCurrency(value)} /> */}
              <Input
                className="form-control mb-2"
                value={currentUser?.currency || 'USD'}
                readOnly
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mb-4">
              <div>
                <Label htmlFor="timezoneInput" className="form-label">
                  Time Zone
                </Label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="form-select"
                  id="timezoneInput"
                  name="timezone"
                >
                  <option value="">Auto</option>
                  {fixedData?.timezones.map((item) => (
                    <option key={item.item1} value={item.item1}>
                      <span dangerouslySetInnerHTML={{ __html: item.item2 }} />
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-2 mt-3 ">
                <Label className="form-label">Country</Label>
                <select
                  name="country"
                  id="countryInput"
                  value={country || ''}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  className="form-control"
                >
                  {fixedData?.countries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                  <option value="">Other</option>
                </select>
              </div>
            </Col>
          </Row>
          <Col lg={12} className="mb-4">
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
            {/* )} */}
          </Col>
        </Col>

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
