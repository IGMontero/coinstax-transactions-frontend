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
  CardBody,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
  Card,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import PerformanceChart from "./components/PerformanceChart";
import HistorialList from "./components/HistorialList";
import AcitvesTable from "./components/ActivesTable";
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
        <div className="page-content">
          <Row className="d-flex justify-content-center align-items-center border-bottom border-2 mb-5">
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
                className="d-flex justify-content-center"
              >
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
            {" "}
            <Col xxl={12}>
              <Col xxl={6}>
                <Nav
                  tabs
                  className="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3"
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
                      Historial
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="home1">
                  <div className="d-flex">
                    <div className="flex-grow-1 ms-2">
                      <Col
                        xxl={12}
                        className="mt-3 mb-3 d-flex flex-row justify-content-around"
                      >
                        <Col xxl={6} className="me-1">
                          <PerformanceChart dataColors='["--vz-primary"]' />
                        </Col>
                        <Col xxl={4} className="ms-1">
                          <HistorialList />
                        </Col>
                      </Col>
                      <Col xxl={12}>
                        <AcitvesTable />
                      </Col>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="ri-checkbox-multiple-blank-fill text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      When, while the lovely valley teems with vapour around me,
                      and the meridian sun strikes the upper surface of the
                      impenetrable foliage of my trees, and but a few stray
                      gleams steal into the inner sanctuary, I throw myself down
                      among the tall grass by the trickling stream; and, as I
                      lie close to the earth, a thousand unknown.
                      <div className="mt-2">
                        <Link to="#" className="btn btn-sm btn-soft-primary">
                          Read More{" "}
                          <i className="ri-arrow-right-line ms-1 align-middle"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="3">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="ri-checkbox-multiple-blank-fill text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      Etsy mixtape wayfarers, ethical wes anderson tofu before
                      they sold out mcsweeney's organic lomo retro fanny pack
                      lo-fi farm-to-table readymade. Messenger bag gentrify
                      pitchfork tattooed craft beer, iphone skateboard locavore
                      carles etsy salvia banksy hoodie helvetica. DIY synth PBR
                      banksy irony.
                      <div className="mt-2">
                        <Link to="#" className="btn btn-sm btn-soft-primary">
                          Read More{" "}
                          <i className="ri-arrow-right-line ms-1 align-middle"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="4">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="ri-checkbox-multiple-blank-fill text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      when darkness overspreads my eyes, and heaven and earth
                      seem to dwell in my soul and absorb its power, like the
                      form of a beloved mistress, then I often think with
                      longing, Oh, would I could describe these conceptions,
                      could impress upon paper all that is living so full and
                      warm within me, that it might be the.
                      <div className="mt-2">
                        <Link to="#" className="btn btn-sm btn-soft-primary">
                          Read More{" "}
                          <i className="ri-arrow-right-line ms-1 align-middle"></i>
                        </Link>
                      </div>
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
