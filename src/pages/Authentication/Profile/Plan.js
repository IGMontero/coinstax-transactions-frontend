import React from 'react';
import { Button, Card, CardBody, Col, Row, TabPane } from 'reactstrap';
import { pricing1 } from '../../../common/data';
import { useTranslation } from 'react-i18next';

const Plan = () => {
  const { t } = useTranslation();
  return (
    <TabPane tabId="3">
      <Row>
        {(pricing1 || []).map((price1, key) => (
          <Col lg={6} key={key}>
            <Card className="pricing-box bg-light ribbon-box right">
              {price1.ribbon === true ? (
                <div className="ribbon-two ribbon-two-danger">
                  <span>Popular</span>
                </div>
              ) : (
                ''
              )}
              <CardBody className="m-2 p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-0 fw-semibold">{t(price1.type)}</h5>
                  </div>
                  <h3>${price1.rate}</h3>
                  <p>{price1.rate2 ? price1.rate2 : '00'}</p>
                </div>

                <div className="d-flex justify-content-center my-4">
                  <h6 style={{ fontStyle: 'italic' }}>
                    {'('}
                    {t(price1.description)}
                    {')'}
                  </h6>
                </div>
                {/* <div className="m-2 p-4 justify-content-center mt-n2"> */}
                {/* <div className="d-flex justify-content-center me-5 ms-5 text-center"> */}
                <ul className="list-unstyled d-flex vstack gap-3 justify-content-center">
                  <li className="mb-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0 text-success me-1">
                        <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div className="flex-grow-1">
                        <b>{t(price1.characteristicOne)}</b>
                      </div>
                    </div>
                  </li>

                  <li className="mb-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0 text-success me-1">
                        <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div className="flex-grow-1">
                        <b>{t(price1.characteristicTwo)}</b>
                      </div>
                    </div>
                  </li>
                  <li className="mb-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0 text-success me-1">
                        <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div className="flex-grow-1">
                        <b>{t(price1.characteristicThree)}</b>
                      </div>
                    </div>
                  </li>
                  <li className="mb-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0 text-success me-1">
                        <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div className="flex-grow-1">
                        <b>{t(price1.characteristicFour)}</b>
                      </div>
                    </div>
                  </li>
                </ul>
                {/* </div> */}
                <div className="mt-3 pt-2">
                  <Button className="btn btn-success w-100">
                    {t('Continue')}
                  </Button>
                </div>
                {/* </div> */}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </TabPane>
  );
};

export default Plan;
