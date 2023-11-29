import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  Card,
  CardBody,
  AccordionBody,
  AccordionHeader,
  Accordion,
  AccordionItem,
} from "reactstrap";
import classnames from "classnames";

const HistorialTable = () => {
  const inputRef = useRef(null);
  const [openCollapse, setOpenCollapse] = useState(null);

  const toggleCollapse = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };
  const [iconCol1, seticonCol1] = useState(true);
  const [iconCol2, seticonCol2] = useState(false);
  const [iconCol3, seticonCol3] = useState(false);

  const t_iconCol1 = () => {
    seticonCol1(!iconCol1);
    seticonCol2(false);
    seticonCol3(false);
  };

  const t_iconCol2 = () => {
    seticonCol2(!iconCol2);
    seticonCol1(false);
    seticonCol3(false);
  };

  const t_iconCol3 = () => {
    seticonCol3(!iconCol3);
    seticonCol1(false);
    seticonCol2(false);
  };

  const fakeTransactions = [
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
          <Button color="soft-primary" className="btn btn-sm">
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
                className="search-icon ps-2 position-absolute"
                onClick={() => inputRef.current.focus()}
                style={{ zIndex: 1, cursor: "text" }}
              >
                <i className="ri-search-line text-muted fs-3"></i>
              </span>
              <Input
                innerRef={inputRef}
                className="search-input py-2"
                style={{ borderRadius: "5px", zIndex: 0, paddingLeft: "47px" }}
                placeholder="Filter for direction, protocol, active, type"
              />
            </InputGroup>
          </Col>
          <Col xxl={6} className="d-flex justify-content-end">
            <Button color="primary" className="btn btn-sm">
              Descargar CSV
            </Button>
          </Col>
        </div>
        <Accordion
          open={openCollapse}
          className="border-0bg-transparent"
          toggle={toggleCollapse}
        >
          {fakeTransactions.map((transaction, index) => (
            <AccordionItem
              key={index}
              className="bg-transparent border-0"
              // style={{ backgroundColor: "red " }}
            >
              <Col
                xxl={12}
                className="d-flex justify-content-start pt-4 pb-1 align-items-center"
              >
                <div className="d-flex justify-content-center ps-2  align-items-center ">
                  <span className="text-dark">{transaction.date}</span>
                </div>
              </Col>
              <AccordionHeader
                targetId={`${index}`}
                className="border-0 bg-transparent"
              >
                <Col xxl={12}>
                  <Row className="mt-3">
                    <Col
                      xxl={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <span className="text-dark">{transaction.action}</span>
                    </Col>
                    <Col
                      xxl={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <span className="text-dark">{transaction.number}</span>
                    </Col>
                    <Col
                      xxl={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <span className="text-dark">{transaction.amount}</span>
                    </Col>
                    <Col
                      xxl={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className="d-flex flex-column justify-content-start align-items-center">
                        <small>From</small>
                        <span className="text-dark">{transaction.from}</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </AccordionHeader>
              <AccordionBody
                accordionId={`${index}`}
                className="border-bottom border-2"
              >
                <div className="py-2">
                  {/* Aquí puedes agregar el contenido detallado para cada transacción */}

                  <Col xxl={6} className="">
                    <div className="mt-3 my-0 d-flex fle-row justify-content-around">
                      <div className="d-flex flex-column">
                        <span className="text-mutedmb-0">Commission:</span>
                        <span className="fw-bold">{transaction.amount}</span>
                      </div>{" "}
                      <div className="d-flex flex-column">
                        <span className=" mb-0 text-muted ">
                          Has of transaction:
                        </span>
                        <span className="mb-0 fw-bold">
                          {transaction.number}
                        </span>
                      </div>
                    </div>
                  </Col>
                </div>
              </AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      </Col>
    </React.Fragment>
  );
};

export default HistorialTable;
