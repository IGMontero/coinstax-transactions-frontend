import React, { useState } from "react";
import {
  Container,
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";
import PerformanceChart from "./components/PerformanceChart";
import AcitvesTable from "./components/ActivesTable";
import HistorialTable from "./components/HistorialTable";
import Nfts from "./components/Nfts";
import eth from "../../assets/images/svg/crypto-icons/eth.svg";
import btc from "../../assets/images/svg/crypto-icons/btc.svg";
import arb from "../../assets/images/svg/crypto-icons/ankr.svg";
import pol from "../../assets/images/svg/crypto-icons/poly.svg";
import gnosis from "../../assets/images/svg/crypto-icons/gno.svg";
const DashboardInfo = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <Container fluid>
        <div className="page-content pb-5">
          <Row className="d-flex justify-content-center align-items-center  border-2  ">
            <Col
              lg={12}
              className="d-flex jusitfy-content-between align-items-center"
            >
              <Col
                xxl={9}
                lg={9}
                md={9}
                sm={9}
                xs={9}
                className="d-flex flex-column"
              >
                <div className="d-flex flex-row">
                  <h4>puzzledandamused.eth </h4>
                  <UncontrolledDropdown className="card-header-dropdown">
                    <DropdownToggle
                      tag="a"
                      className="text-reset"
                      role="button"
                    >
                      <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end ms-3">
                      <DropdownItem className="d-flex align-items-center">
                        {" "}
                        <i className="ri-qr-code-line fs-2 me-2"></i>
                        <span className="fw-semibold">Show QR code</span>
                      </DropdownItem>
                      <DropdownItem className="d-flex align-items-center">
                        <i className="ri-file-copy-line fs-2 me-2"></i>{" "}
                        <span className="fw-semibold">Copy direction</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="d-flex flex-row ">
                  <h2 className="fw-bold">7656,01 US$ </h2>
                  <UncontrolledDropdown className="card-header-dropdown">
                    <DropdownToggle
                      tag="a"
                      className="text-reset"
                      role="button"
                    >
                      <i className="ri-more-fill ms-2 fs-5"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end ms-3">
                      <DropdownItem className="d-flex align-items-center">
                        <span className="fw-semibold">
                          Include NFTs in Totals
                          <input
                            type="checkbox"
                            className="form-check-input ms-2"
                          />
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <h5 className="text-danger">-5,6% (452,07 US$)</h5>{" "}
              </Col>
              <Col
                xxl={3}
                lg={3}
                md={3}
                sm={3}
                xs={3}
                className="d-flex justify-content-end"
              >
                <div className="d-flex justify-content-center flex-row">
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
          <Row className="d-flex justify-content-center align-items-center  border-2 mb-3 mt-3 border-top">
            {" "}
            <Col xxl={12}>
              <div className="d-flex justify-content-between">
                <Col xxl={6}>
                  <Nav
                    tabs
                    className="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3 border-bottom"
                  >
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        Tokens
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        NFTs
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "3",
                        })}
                        onClick={() => {
                          toggleCustom("3");
                        }}
                      >
                        History
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col
                  xxl={6}
                  className="d-flex justify-content-end align-items-center"
                >
                  <div className="d-flex justify-content-end align-items-center">
                    <UncontrolledDropdown className="card-header-dropdown">
                      <DropdownToggle
                        tag="a"
                        className="btn btn-sm p-1 btn-soft-primary d-flex align-items-center"
                        role="button"
                      >
                        <span className="ms-2 d-flex align-items-center">
                          {" "}
                          <i className="ri-function-line text-primary fs-4 me-2"></i>
                          All Networks
                        </span>
                        <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end mt-2 ">
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <i className="ri-function-line text-primary fs-2 me-2"></i>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold ">All Networks</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>$9k </small>{" "}
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small>$12.7k </small>
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <img
                            src={eth}
                            alt="btc"
                            className="ms-n1 me-2"
                            width={30}
                            height={30}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">Ethereum</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>$8.6k </small>{" "}
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small>$12.7k </small>
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <img
                            src={pol}
                            alt="btc"
                            className="ms-n1 me-2"
                            width={30}
                            height={30}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">Polygon</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>$434.44k </small>
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small>$0.352901k </small>
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <img
                            src={btc}
                            alt="btc"
                            className="ms-n1 me-2"
                            width={30}
                            height={30}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">BNB Chain</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>$0.020028</small>
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small></small>
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <img
                            src={arb}
                            alt="btc"
                            className="ms-n1 me-2"
                            width={30}
                            height={30}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">Arbitrum</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>{"<"} $0.0001 </small>
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small>{"<"} $0.0001</small>
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem className="d-flex align-items-center">
                          {" "}
                          <img
                            src={gnosis}
                            alt="btc"
                            className="ms-n1 me-2"
                            width={30}
                            height={30}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">Gnosis Chain</span>
                            <div className="d-flex flex-row align-items-center">
                              <small>{"<"} $0.0001 </small>
                              <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                              <small>{"<"} $0.0001</small>
                            </div>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </Col>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="home1">
                  <div className="d-flex">
                    <div className="flex-grow-1 ms-2">
                      <Col
                        xxl={12}
                        className="mt-3 mb-3 d-flex flex-row justify-content-around"
                      >
                        <Col xxl={12} className="me-1">
                          <PerformanceChart dataColors='["--vz-primary"]' />
                        </Col>
                        {/* <Col xxl={6} className="ms-1 border-0">
                          <HistorialList />
                        </Col> */}
                      </Col>
                      <Col xxl={12}>
                        <AcitvesTable />
                      </Col>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <div className="d-flex">
                    <div className="flex-grow-1 ms-2">
                      <Nfts />
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="3">
                  <div className="d-flex">
                    <div className="flex-grow-1 ms-2">
                      <HistorialTable />
                    </div>
                  </div>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default DashboardInfo;
