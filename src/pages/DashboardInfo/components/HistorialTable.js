import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
} from "reactstrap";

import { fakeTransactions } from "../../../helpers/Fake-transactions/faketransactions";

const HistorialTable = () => {
  const inputRef = useRef(null);
  const [openCollapse, setOpenCollapse] = useState(null);

  const toggleCollapse = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Button color="soft-primary" size="sm">
            Transactions
          </Button>
          <Button color="soft-primary" size="sm" className="ms-2">
            All Assets
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xxl={6}>
          <InputGroup className="search-bar mb-3">
            <i className="ri-search-line text-muted fs-4 position-absolute ms-2"></i>
            <Input
              innerRef={inputRef}
              className="search-input form-control ps-5"
              placeholder="Filter for direction, protocol, active, type"
            />
          </InputGroup>
        </Col>
        <Col xxl={6} className="d-flex justify-content-end">
          <Button color="primary" size="sm">
            Descargar CSV
          </Button>
        </Col>
      </Row>
      <Col xxl={12}>
        {fakeTransactions.map((transaction, index) => (
          <div key={index} className="align-items-center">
            <Col
              xxl={12}
              className="d-flex justify-content-start pt-4 pb-1 align-items-center"
            >
              <div className="d-flex justify-content-center ps-2  align-items-center ">
                <h5 className="fw-semibold">{transaction.date}</h5>
              </div>
            </Col>
            <div
              className={`border-top border-bottom rounded${
                openCollapse === index ? " border border-primary" : " bg-light"
              }`}
            >
              <Row
                className={`align-items-center  justify-content-between p-3 `}
                onClick={() => toggleCollapse(index)}
                style={{ cursor: "pointer" }}
              >
                <Col xxl={3} className="d-flex align-items-center">
                  <img
                    src={transaction.img}
                    alt=""
                    className="me-2"
                    width={40}
                    height={40}
                  />
                  <div className="d-flex flex-column text-start justify-content-end">
                    <h5 className="fw-semibold my-0"> {transaction.action}</h5>
                    <p className="text-start my-0">{transaction.hour}</p>
                  </div>
                </Col>
                <Col
                  xxl={3}
                  className="d-flex justify-content-between align-items-center"
                >
                  <Col xxl={3} className="d-flex align-items-center">
                    <img
                      src={transaction.img2}
                      alt=""
                      className="me-2"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column text-start justify-content-end">
                      <h5 className="fw-semibold my-0">
                        {" "}
                        {transaction.number}
                      </h5>
                      <p
                        className="text-start my-0"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {" "}
                        {transaction.info}
                      </p>
                    </div>
                  </Col>
                  <div className="justify-content-end ">
                    <i className="ri-arrow-right-line text-end fs-4 "></i>
                  </div>
                </Col>
                <Col
                  xxl={3}
                  className="text-dark d-flex justify-content-center"
                >
                  <h5 className="fw-semibold my-0"> {transaction.amount}</h5>
                </Col>
                <Col xxl={3} className="d-flex align-items-center">
                  <img
                    src={transaction.img3}
                    alt=""
                    className="me-2"
                    style={{ borderRadius: "50%" }}
                    width={40}
                    height={40}
                  />
                  <div className="d-flex flex-column text-start justify-content-end">
                    <p className="text-start my-0">From</p>
                    <h5 className="fw-semibold my-0"> {transaction.from}</h5>
                  </div>
                </Col>
              </Row>
              <Collapse isOpen={openCollapse === index}>
                <CardBody
                  onClick={() => toggleCollapse(index)}
                  className={`ps-2 cursor-pointer ${
                    openCollapse === index ? "border-info" : ""
                  }`}
                >
                  <Col xxl={12}>
                    <Row className="d-flex flex-row align-items-center">
                      <Col xxl={4} className="p-2 d-flex ">
                        <div className="p-2  mx-2 d-flex flex-column">
                          <strong>Commission:</strong>
                          <span className="ms-2">{transaction.amount}</span>
                        </div>
                        <div className="p-2 d-flex flex-column">
                          <strong>Transaction Hash:</strong>
                          <span className="ms-1">{transaction.number}</span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </CardBody>
              </Collapse>
            </div>
          </div>
        ))}
      </Col>
    </React.Fragment>
  );
};

export default HistorialTable;
