import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TabPane, Col, Table, Button } from 'reactstrap';

const Access = () => {
  const {t}= useTranslation()
  return (
    <TabPane tabId="3">
      <Col lg={12} className="mb-5">
        <h4 className="text-muted">{t("Accountant Access")}</h4>
        <p>{t("Invite your accountant, or third-party, to view your account.")}</p>
        <Table className="table  mb-3" striped>
          <thead>
            <tr>
              <th scope="col">{t("Name")}</th>
              <th scope="col">Email</th>
              <th scope="col">{t("Last Viewed")}</th>
              <th scope="col">{t("Access")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("No body has access")}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>

        <button className="btn btn-primary">{t("Invite")}</button>
      </Col>

      <Col lg={12}>
        <h4 className="text-muted">API KEY</h4>
        <p>
          {t("Allow third-party applications, such as exchanges and wallets, add transactions directly into your account.")}
        </p>
        <Table className="table mb-3" striped>
          <thead>
            <tr>
              <th scope="col">API Key</th>
              <th scope="col">API Secret</th>
              <th scope="col">{t("Created")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("You have no API keys")}</td>
              <td></td>
              <td></td>
            </tr>
           
          </tbody>
        </Table>
        <div className="hstack gap-2">
          <button type="submit" className="btn btn-primary">
            {t("Add an API Key")}
          </button>
        </div>
      </Col>
    </TabPane>
  );
};

export default Access;
