import React from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  Button,
  CardTitle,
} from "reactstrap";

const DashboardInfo = () => {
  return (
    <React.Fragment>
      <Container fluid>
        <div className="page-content">
          <Row className="d-flex justify-content-center align-items-center border-bottom border-2 mb-5">
            <Col
              lg={12}
              className="d-flex jusitfy-content-between align-items-center"
            >
              <Col lg={6} className="d-flex flex-column">
                <h4>puzzledandamused.eth</h4>
                <h2 className="fw-bold">7656,01 US$</h2>
                <h5 className="text-danger">-5,6% (452,07 US$)</h5>
              </Col>
              <Col lg={6}>
                <div className="d-flex justify-content-end flex-row">
                  <Button className="rounded-circle bg-transparent border-1  border-dark btn btn-sm">
                    <i className="ri-share-forward-fill text-dark fs-4 p-1"></i>
                  </Button>
                  <Button className="rounded-circle bg-transparent border-1 mx-3 border-dark btn btn-sm">
                    <i className="ri-send-plane-fill text-dark fs-4 p-1"></i>
                  </Button>
                  <Button color="primary" className="btn btn-sm">
                    Add wallet
                  </Button>
                </div>
              </Col>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center border-bottom border-2 mt-5 mb-3">
            <Col>
              <CardTitle tag="h5">Transaction History</CardTitle>
              {/* Transaction list can be mapped from an array of transaction objects */}
              <div className="transaction">
                <div>
                  <strong>Date:</strong> 25 July 2023
                </div>
                <div>
                  <strong>Action:</strong> Receive
                </div>
                <div>
                  <strong>Amount:</strong> +0.022 MTG
                </div>
                {/* ... other transaction details ... */}
              </div>
              {/* Repeat for other transactions */}
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default DashboardInfo;
