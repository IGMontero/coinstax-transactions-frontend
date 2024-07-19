import React, { useState } from 'react';
import { Container, Row, Col, Collapse, CardBody } from 'reactstrap';
import { useHistory, useNavigate } from 'react-router-dom';

const AddressTable = ({ addresses, user }) => {
  const [openCollapse, setOpenCollapse] = useState(new Set());
  const navigate = useNavigate();

  const toggleCollapse = (collapseId) => {
    const newSet = new Set(openCollapse);
    if (newSet.has(collapseId)) {
      newSet.delete(collapseId);
    } else {
      newSet.add(collapseId);
    }
    setOpenCollapse(newSet);
  };

  const handleItemClick = (collapseId, address) => {
    if (user) {
      navigate(`/address/${address.value}`);
    } else {
      toggleCollapse(collapseId);
    }
  };

  return (
    <Container fluid>
      <Row>
        {addresses.map((address, index) => {
          const collapseId = `address-${index}`;
          return (
            <Col lg={6} md={12} sm={12} xs={12} key={index} className="mb-3">
              <div
                onClick={() => handleItemClick(collapseId, address)}
                className={` address-card border rounded-4 p-2 bg-transparent cursor-pointer ${
                  openCollapse.has(collapseId)
                    ? 'border border-primary rounded px-2 mb-2'
                    : 'bg-light'
                }`}
              >
                <Row
                  className="align-items-center justify-content-between"
                  style={{
                    cursor: 'pointer',
                    padding: '.7rem',
                    paddingRight: '1rem',
                  }}
                >
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                  >
                    <div className="d-flex flex-column">
                      <h5>{address.label}</h5>
                      <span className="text-muted">{address.value}</span>
                    </div>
                  </Col>
                </Row>
                {!user && (
                  <Collapse isOpen={openCollapse.has(collapseId)}>
                    <CardBody
                      className={`cursor-pointer ${
                        openCollapse.has(collapseId) ? 'border-info' : ''
                      }`}
                    >
                      <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between">
                          <strong>Type:</strong> {address.type}
                        </div>
                      </div>
                    </CardBody>
                  </Collapse>
                )}
              </div>
            </Col>
          );
        })}
        {addresses.length === 0 && (
          <Col>
            <h4>No addreesses Yet</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AddressTable;
