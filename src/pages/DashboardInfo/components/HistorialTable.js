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
          <InputGroup className="py-3 search-bar col-lg-12 col-md-12 pe-3">
            <span
              className="search-icon ps-3 position-absolute"
              onClick={() => inputRef.current.focus()}
              style={{ zIndex: 1, cursor: "text" }}
            >
              <i className="ri-search-line text-muted fs-3"></i>
            </span>
            <Input
              innerRef={inputRef}
              className="search-input py-2 rounded"
              style={{
                zIndex: 0,
                paddingLeft: "47px",
              }}
              placeholder="Filter by Address, Protocol, Assets, Type"
              // value={searchTerm}
              // onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col xxl={6} className="d-flex btn btn-sm py-3 justify-content-end">
          <Button color="primary" size="sm">
            Download CSV
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
                <h6 className="fw-semibold">{transaction.date}</h6>
              </div>
            </Col>
            <div
              className={`border-top border-bottom  bg-transparent${
                openCollapse === index
                  ? " border border-primary rounded"
                  : " bg-light"
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
                    <h6 className="fw-semibold my-0"> {transaction.action}</h6>
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
                      <h6 className="fw-semibold my-0 text-success">
                        {" "}
                        {transaction.hash}
                      </h6>
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
                <Col xxl={3} className="d-flex justify-content-center">
                  <h6 className="fw-semibold my-0"> {transaction.fee}</h6>
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
                    <h6 className="fw-semibold my-0"> {transaction.from}</h6>
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
                  <Col xxl={12} lg={12} className="border-top ">
                    {transaction.action2 && transaction.received && (
                      <Row className="align-items-start g-0 mt-2">
                        <Col xxl={12} className="d-flex mb-2">
                          <Col xxl={3} className="ps-2">
                            <span>{transaction.action2[0].title}</span>
                          </Col>
                          <Col xxl={9} className="ps-2">
                            <span>Received</span>
                          </Col>
                        </Col>
                        <Col
                          xxl={2}
                          className="d-flex align-items-start flex-column ps-2"
                        >
                          <div className="d-flex">
                            <img
                              src={transaction.action2[0].img}
                              alt=""
                              className="me-2"
                              width={40}
                              height={40}
                            />
                            <div className="d-flex flex-column text-start justify-content-start">
                              <h6 className="fw-semibold my-0 text-success">
                                {transaction.hash}
                              </h6>
                              <p
                                className="text-start my-0"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {transaction.info}
                              </p>
                            </div>
                          </div>
                        </Col>

                        <Col
                          xxl={1}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <div className="d-flex flex-column align-items-center">
                            <div
                              className="bg-dark"
                              style={{ width: 1.5, height: 50 }}
                            />
                            <div
                              style={{
                                marginTop: "-12px",
                                marginBottom: "-12px",
                              }}
                            >
                              <i className="ri-arrow-right-circle-line text-success fs-1 mb-0 mt-0"></i>
                            </div>
                            <div
                              className="bg-dark"
                              style={{ width: 1.5, height: 60 }}
                            />
                          </div>
                        </Col>

                        <Col
                          xxl={9}
                          className="d-flex align-items-center flex-column justify-content-center"
                        >
                          {transaction.received.map(
                            (received, receivedIndex) => (
                              <div
                                key={receivedIndex}
                                className="d-flex align-items-center w-100 ps-2"
                              >
                                <img
                                  src={received.img}
                                  alt=""
                                  className="me-2 rounded mb-3"
                                  width={40}
                                  height={40}
                                />
                                <h6 className="fw-semibold my-0 text-success">
                                  {received.amount}
                                </h6>
                              </div>
                            )
                          )}
                        </Col>
                      </Row>
                    )}
                  </Col>

                  <Col xxl={12}>
                    <Row className="d-flex flex-row align-items-center">
                      <Col xxl={12} className="p-2 d-flex ">
                        {transaction.collection && (
                          <div className="p-2 mx-2 d-flex flex-column">
                            <strong className="mb-1">Collection:</strong>
                            <span>{transaction.collection}</span>
                          </div>
                        )}
                        {transaction.fee && (
                          <div className="p-2  mx-2 d-flex flex-column">
                            <strong className="mb-1">Fee:</strong>
                            <span>{transaction.fee}</span>
                          </div>
                        )}
                        {transaction.hash && (
                          <div className="align-items-center d-flex">
                            <div className="p-2 d-flex flex-column">
                              <strong>Transaction Hash:</strong>
                              <div className="d-flex">
                                <span className="ms-1d -flex align-items-center">
                                  {transaction.hash}
                                  <i className="ri-arrow-right-up-line fs-6"></i>
                                </span>
                              </div>
                            </div>
                            <div>
                              <button className="btn btn-transparent p-0 ">
                                <i className="ri-file-copy-line ms-2 fs-4"></i>
                              </button>
                            </div>
                          </div>
                        )}
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
