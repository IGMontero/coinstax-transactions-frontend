import React from 'react';
import { Col, Row } from 'reactstrap';
import { formatDateToLocale } from '../../../utils/utils';

const ClientInfo = ({ client }) => {
  return (
    <Row className="align-items-center justify-content-between border-top border-bottom py-3 px-0 mx-0">
      <Col sm={12} xs={12} md={12} lg={4} className="mb-2 mb-md-0">
        <h5>{client.Name}</h5>
      </Col>
      <Col sm={12} xs={12} md={12} lg={4} className="mb-2 mb-md-0">
        <h5>{client.Email}</h5>
      </Col>
      <Col sm={12} xs={12} md={12} lg={4}>
        <h5>Last viewed: {formatDateToLocale(client.LastViewedDate)}</h5>
      </Col>
    </Row>
  );
};

export default ClientInfo;
