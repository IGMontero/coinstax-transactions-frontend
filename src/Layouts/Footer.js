import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { fetchApiVersion } from '../slices/common/thunk';

const Footer = () => {
  const [apiVersion, setApiVersion] = React.useState('');
  const appVersion = process.env.REACT_APP_VERSION;
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch server version
    dispatch(fetchApiVersion())
      .unwrap()
      .then((response) => {
        setApiVersion(response.version);
      })
      .catch((error) => {
        console.error('Error fetching api version:', error);
      });
  }, []);

  return (
    <React.Fragment>
      <footer className="footer bg bg-transparent ">
        <Container fluid>
          <Row>
            {/* <Col sm={6}>{new Date().getFullYear()} © CoinsTax</Col> */}
            <Col sm={12}>
              <div className="text-lg-end d-none d-sm-block text-white">
                <h6>
                  Version {appVersion} ({apiVersion})
                </h6>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
