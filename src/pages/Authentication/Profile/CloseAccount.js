import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, TabPane, Button } from 'reactstrap';

const CloseAccount = () => {
  const {t} = useTranslation();
  return (
    <TabPane tabId="5">
      <div>
        <h5 className="card-title text-decoration-underline mb-3">{("Close This Account")}:</h5>
        <p className="text-muted">
         {t("Closing your account will irreversibly remove all your trade data, capital gains results and closing positions.")}
        </p>
        <div className=" form-check mb-3">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">{t("I understand by closing my account. I will lose access to all my information.")}</label>
            </div>
        <div>
          <p>
            {t("To close your account, please type the word YES into the following field and click the button below")}
          </p>
          <Input
            type="text"
            className="form-control"
            placeholder="Enter the word YES"
            style={{ maxWidth: '265px' }}
          />
        </div>
        <div className="hstack gap-2 mt-3">
          <Button className="btn btn-danger">{t("Close my account now")}</Button>
        </div>
      </div>
    </TabPane>
  );
};

export default CloseAccount;
