import React, { useRef } from "react";
import { Button, Input, Row, Col, InputGroup } from "reactstrap";

const HistorialTable = () => {
  const inputRef = useRef(null);

  const fakeTransactions = [
    // muste be action, numbers, date amount, from
    {
      action: "recieved",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "trade",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "mint",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "send",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "approved",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "executed",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
    {
      action: "success",
      number: "0x4b8d...",
      date: "2021-07-12",
      amount: "0.0001",
      from: "0x4b8d...",
    },
  ];
  return (
    <React.Fragment>
      <Row>
        <div className="d-flex justify-content-start align-items-center">
          <Button color="soft-primary" className="btn btn-sm ">
            Transactions
          </Button>
          <Button color="soft-primary" className="ms-2 btn btn-sm">
            All Assets
          </Button>
        </div>
      </Row>
      <Col xxl={12}>
        <div className="d-flex justify-content-between mt-4">
          <Col xxl={6}>
            <InputGroup className="py-2 search-bar col-lg-12 col-md-12 pe-3">
              <span
                className="search-icon ps-2 position-absolute "
                onClick={() => inputRef.current.focus()}
                style={{ zIndex: 1, cursor: "text" }}
              >
                <i className="ri-search-line text-muted fs-3"></i>
              </span>
              <Input
                innerRef={inputRef}
                className="search-input py-2"
                style={{
                  borderRadius: "5px",
                  zIndex: 0,
                  paddingLeft: "47px",
                }}
                placeholder="Filter for direction, protocol, active, type"
                // value={searchTerm}
                // onChange={handleSearch}
              />
            </InputGroup>
          </Col>
          <Col xxl={6} className="d-flex justify-content-end">
            <Button color="primary" className="btn btn-sm">
              <span className=""> Descargar CSV</span>
            </Button>
          </Col>
        </div>
        {fakeTransactions.map((transaction, index) => (
          <div key={index}>
            <Col
              xxl={12}
              className="d-flex justify-content-start pt-4 pb-1 align-items-center"
            >
              <div className="d-flex justify-content-center align-items-center">
                <span className="text-muted">{transaction.date}</span>
              </div>
            </Col>
            <Col xxl={12} className="border-top border-bottom ">
              <Row className="mt-3">
                <Col
                  xxl={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="d-flex justify-content-start align-items-center">
                    <span className="text-muted">{transaction.action}</span>
                  </div>
                </Col>
                <Col
                  xxl={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="text-muted">{transaction.number}</span>
                  </div>
                </Col>

                <Col
                  xxl={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="text-muted">{transaction.amount}</span>
                  </div>
                </Col>
                <Col
                  xxl={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <small>From</small>
                    <span className="text-muted">
                      {transaction.from}{" "}
                      <i className="ri-arrow-right-line fs-4"></i>
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
        ))}
      </Col>
    </React.Fragment>
  );
};

export default HistorialTable;
