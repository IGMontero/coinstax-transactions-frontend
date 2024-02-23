import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { formatIdTransaction } from '../../utils/utils';

const DashboardNFT = () => {
  const { nftId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address');

  const attributes = [
    {
      trait_type: 'Background',
      value: 'shell',
    },
    {
      trait_type: 'Fur',
      value: 'White',
    },
    {
      trait_type: 'Clothes',
      value: 'Fav Tee',
    },
    {
      trait_type: 'Eyes',
      value: 'Sleepy',
    },
    {
      trait_type: 'Cheeks',
      value: 'Rosy cheeks',
    },
    {
      trait_type: 'Face Piercings',
      value: 'Silver Nose Piercing R',
    },
    {
      trait_type: 'Mouth',
      value: 'Bored',
    },
  ];

  const handleSeeProfile = () => {
    navigate(`/address/${address}/tokens`);
  };

  const renderCardProfile = () => {
    return (
      <div className="card mt-4 p-2 rounded">
        <div className="d-flex align-items-center ">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7t3SGuHUcUhOF5ODTAICAoezCNrGwh3NRrMPIKAkzDswkvxDAKyAbMIsWL+CyVjvw/XtPn1vmnenpu334v//398/8P/L16+yuok6oD//75iS7xEgDk31wcAPMWbAsIgK3/89EDYN6CbQEBsPV/PnoAzFuwLSAAtv7PRw+AeQu2BQTA1v/56AEwb8G2gADY+j8fPQDmLdgWEABb/+ejB8C8BdsCAmDr/3x0BuCP17/RfoAPP/xEJrz/8g/pr4vX/r0EwBahACgBiEBN0BKA7HdxCVACEEUlANm3F5cAJQBRWAKQfXtxCVACEIUlANm3F5cAJQBRWAKQfXtxCVACEIUlANm3F5cAJQBRWAKQfXvxPAF+fPOW9gMoge/++kxdWJ9PoBsyPv7+C31+BeglAMj/JwBwDi8BSgC6BZsCbEteUwDh9zQF9BBohzT1ENgqgDKoVcD4mLpWAa0C6A5uCmgKIICaApoCCKCWgWRfy8CnZWDLQLqHehXcq2ACqFfBvQomgFR8/j1Ax8UrAlu9Atj/C9j2j0cPALbw9gUC4Hb/uPoAYAtvXyAAbvePqw8AtvD2BQLgdv+4+gBgC29fIABu94+rDwC28PYFAuB2/7j6AGALb18gAG73j6sPALbw9gUC4Hb/uHoGQI+LX2/p0j2J2gHdlq0N1N8V8GnhAWBbsgIA9/WXALaptATAOaApYPzTrhKgBMB72OQlQAlABPUQ2EMgAdQyEM8nIPef52kKaAoghpoCmgIIoKaApgACqBdBZF/PAE/fBfRdAN1D+vv+3gT2JpAAVPH5ZeD6uHhtwPeuVwDnp4R97w3Uzx8A6uBxfQAcb6CWHwDq4HF9ABxvoJYfAOrgcX0AHG+glh8A6uBxfQAcb6CWHwDq4HF9ABxvoJYfAOrgcX0AHG+glh8A6uBxfQAcb6CWzwDo+QD6AVSvW9J0fN2Vq+OrnjeFagGqDwBzMADMv6cEQANVXgKYgyWA+VcCoH8sLwHMwhLA/CsB0D+WlwBmYQlg/pUA6B/LSwCzsAQw/0oA9I/lJYBZWAKYfyUA+sfyEsAsLAHMvxIA/WN5CWAWcgLohoT1CR9mn6vX/gWA95CuEADjY96oe99AHAABQBjpFNoUQPa7uAQoAYiiEoDs24tLgBKAKCwByL69uAQoAYjCEoDs24tLgBKAKCwByL69uAQoAYjCEoDs24tLgBKAKNQE+Arayrsu/JzeUgAAAABJRU5ErkJggg=="
            alt="NFT"
            style={{
              borderRadius: '20%',
              height: '30px',
              width: 'auto',
            }}
          />
          <h6 className="m-0 ms-3">
            Viewing {formatIdTransaction(address, 4, 4)} balances
          </h6>

          <div className="ms-auto">
            <p
              onClick={handleSeeProfile}
              className="m-0 cursor-pointer text-primary"
            >
              See profile
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAttributes = (attributes) => {
    return (
      <div>
        <h4>Attributes</h4>
        <div className="d-flex flex-wrap justify-content-start">
          {attributes.map((attribute, index) => (
            <div
              key={index}
              className="bg-transparent border-1 border m-2 p-2"
              style={{
                borderRadius: '15px',
                minWidth: '120px',
                maxWidth: 'fit-content',
              }}
            >
              <p className="text-muted mb-0">{attribute.trait_type}</p>
              <p className="mb-0">{attribute.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <div className="my-1">
        <h4 className="mb-4">Details</h4>
        <ul
          style={{
            listStyle: 'none',
            padding: '0',
          }}
        >
          <li>Created by: Bored Ape Yacht Club</li>
          <li>Collection: Bored Milady</li>
        </ul>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className="my-1">
        <h4 className="mb-4">Description</h4>
        <p>
          Bored Milady Maker is a collection of 6,911 generative pfpNFT's in a
          neochibi aesthetic inspired by street style tribes that infected the
          apes with Network Spirituality.
        </p>
      </div>
    );
  };

  const renderAbout = () => {
    return (
      <div className="my-1">
        <h4 className="mb-4">About Bored Milady Maker</h4>
        <p>
          Bored Milady Maker is a collection of 6,911 generative pfpNFT's in a
          neochibi aesthetic inspired by street style tribes that infected the
          apes with Network Spirituality.
        </p>
        <div className="d-flex align-items-center">
          <p className="cursor-pointer text-primary d-flex align-items-center m-0">
            <span className=" text-hover-underline">Opensea</span>{' '}
            <i className="ri-arrow-right-up-line  fs-4"></i>{' '}
          </p>
          <p className="cursor-pointer ms-4 text-primary d-flex align-items-center m-0">
            <span className=" text-hover-underline">Etherscan</span>{' '}
            <i className="ri-arrow-right-up-line  fs-4"></i>{' '}
          </p>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            <div className="d-flex align-items-center mb-2">
              <img
                src="https://lh3.googleusercontent.com/2QUb8EfLW1jFTAskGZii8ugWfbe5hSmjNriq62dg6g26mGcLTWi4uL3yifWB3eM6Mjz1xge3zkhFWcH5SxtxXLC4guoHBeb1cQ"
                alt="NFT"
                className="img-fluid"
                style={{ height: '32px', width: 'auto', borderRadius: '30%' }}
              />

              <h4 className="text-primary mb-0 ms-2"> Bored Milady Maker</h4>
            </div>
          </Col>
        </Row>
        <div className="my-3">
          <h1>Boder Milady #2867</h1>
        </div>
        <div className="my-3">
          <p>Price by floor Price</p>
        </div>
        <div className="my-3">
          <h1>0.0092 ETH</h1>
        </div>
        <div className="d-flex justify-content-center">
          <img
            src="https://lh3.googleusercontent.com/B5MlCNYzuPTMwkIbWRqrRPSEtuuzIif6kY_LteFgyrhmkdLne62O8lCG0Ni77WAK9un-dA1d0UY5qykNCtWt1pZ8W3VeqWz8mTX0"
            className="d-block mx-auto img-fluid"
            alt="NFT"
            style={{
              borderRadius: '20px',
              height: 'auto',
              maxHeight: '400px',
              width: 'auto',
            }}
          />
        </div>

        {renderCardProfile()}

        {renderAttributes(attributes)}
        <hr />
        <div className="py-2">{renderDetails()}</div>
        <hr />
        <div className="py-2">{renderDescription()}</div>
        <hr />
        <div className="py-2">{renderAbout()}</div>
      </div>
    </React.Fragment>
  );
};

export default DashboardNFT;
