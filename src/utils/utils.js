export const getActionMapping = (action) => {
  switch (action) {
    case "RECEIVE":
      return { color: "success", icon: " ri-arrow-down-line fs-3" };
    case "SEND":
      return { color: "dark", icon: "ri-arrow-up-line fs-3" };
    case "WITHDRAW":
      return { color: "dark", icon: "ri-upload-2-line fs-3" };
    case "EXECUTE":
      return { color: "warning", icon: "ri-arrow-down-line fs-3" };
    default:
      return { color: "dark", icon: "ri-arrow-down-line fs-3" };
  }
};

export const formatIdTransaction = (
  address,
  prefixLength = 4,
  suffixLength = 4
) => {
  if (!address || typeof address !== "string") {
    return null;
  }

  const prefix = address.slice(0, prefixLength + 2);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

{
  // NO BORRAR ESTO
  /* <Col xxl={12} lg={12} className="border-top ">
                      {transaction.blockchainAction && (
                        <Row className="align-items-start g-0 mt-2">
                          <Col xxl={12} className="d-flex mb-2">
                            <Col xxl={3} className="ps-2">
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
                                src={""}
                                alt=""
                                className="me-2"
                                width={40}
                                height={40}
                              />
                              <div className="d-flex flex-column text-start justify-content-start">
                                <h6 className="fw-semibold my-0 text-success">
                                  {transaction.action}
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
                          </Col> */
}

{
  /* <Col
                            xxl={9}
                            className="d-flex align-items-center flex-column justify-content-center"
                          >
                            {transaction.recipient && (
                              <div className="d-flex align-items-center w-100 ps-2">
                                <img
                                  src={transaction.ledgers[0].txInfo.logo}
                                  alt=""
                                  className="me-2 rounded mb-3"
                                  width={40}
                                  height={40}
                                />
                                <h6 className="fw-semibold my-0 text-success">
                                  {transaction.volume}
                                </h6>
                              </div>
                            )}
                          </Col>
                        </Row>
                      )} 
                    </Col>*/
}
