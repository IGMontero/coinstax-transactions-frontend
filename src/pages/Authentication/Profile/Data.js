import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TabPane, Input, Label, Col, Button } from 'reactstrap';

const Data = () => {
  const {t}= useTranslation()
  return (
    <TabPane tabId="4">
      <Col lg={6} className="mb-4">
        <h4 className="text-muted">{t("Reset")}</h4>

        <p>{t("Clear and reset all the data for specific tax year.")}</p>
        <select className="form-control">
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
          <option>2020</option>
          <option>2019</option>
        </select>
        <div className="d-flex mb-1 mt-3">
          <Input type="checkbox" className="form-control-check me-2" />{' '}
          <p>{t("Keep addresses in Address tab")}</p>
        </div>
        <Button className="btn btn-danger">{t("Clear Data")}</Button>
      </Col>

      <Col lg={6} className="mb-4">
        <h4 className="text-muted">Backup </h4>
        <p>{t("Save data from all your tax years from this version of BitcoinTaxes.")}</p>
        <Button className="btn btn-secondary"> {t("Download Data")}</Button>
      </Col>
      <Col lg={6} className="mb-4">
        <h4 className="text-muted">{t("Restore")}</h4>
        <p>{t("Restore all your data or for a specific tax year.")}</p>
        <select className="form-control">
          <option defaultValue={'All Years'}>{t("All Years")}</option>
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
          <option>2020</option>
          <option>2019</option>
        </select>

        <Input type="file" className="form-control mt-3" placeholder="Click to select and upload" />
      </Col>
    </TabPane>
  );
};

export default Data;
