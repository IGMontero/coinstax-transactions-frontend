import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { formatIdTransaction } from '../../utils/utils';
import { getNftsByContractAddress } from '../../slices/transactions/thunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const DashboardNFT = () => {
  const { contractAddress } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState('');

  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [collectionLogo, setCollectionLogo] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');

  const [ownerAddress, setOwnerAddress] = useState('');

  const [details, setDetails] = useState([]);

  const [floorPriceFiat, setFloorPriceFiat] = useState(0);
  const [symbol, setSymbol] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const tokenId = queryParams.get('tokenId');

  const fetchNftByContractAddress = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getNftsByContractAddress({
          blockchain: 'ethereum',
          contractAddress,
          tokenId,
        }),
      );
      const res = response.payload;
      if ((res && res.error) || !res) {
        return;
      } else {
        setCollectionLogo(res.collection.logo);
        setCollectionName(res.collection.name);
        setLogo(res.logo);
        setName(res.name);
        setOwnerAddress(res.ownerAddress);
        setFloorPriceFiat(res.floorPriceNativeToken);
        setSymbol(res.symbol);
        setAttributes(res.metadata.attributes);
        setDescription(res.description);
        setDetails(['Network', 'Ethereum']);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      window.history.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNftByContractAddress();
  }, []);

  const handleSeeProfile = () => {
    navigate(`/address/${ownerAddress}/tokens`);
  };

  const renderCardProfile = () => {
    return (
      <div className="card mt-4 p-2 rounded">
        <div className="d-flex align-items-center ">
          {/* <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5NJREFUeF7t3SGuHUcUhOF5ODTAICAoezCNrGwh3NRrMPIKAkzDswkvxDAKyAbMIsWL+CyVjvw/XtPn1vmnenpu334v//398/8P/L16+yuok6oD//75iS7xEgDk31wcAPMWbAsIgK3/89EDYN6CbQEBsPV/PnoAzFuwLSAAtv7PRw+AeQu2BQTA1v/56AEwb8G2gADY+j8fPQDmLdgWEABb/+ejB8C8BdsCAmDr/3x0BuCP17/RfoAPP/xEJrz/8g/pr4vX/r0EwBahACgBiEBN0BKA7HdxCVACEEUlANm3F5cAJQBRWAKQfXtxCVACEIUlANm3F5cAJQBRWAKQfXtxCVACEIUlANm3F5cAJQBRWAKQfXvxPAF+fPOW9gMoge/++kxdWJ9PoBsyPv7+C31+BeglAMj/JwBwDi8BSgC6BZsCbEteUwDh9zQF9BBohzT1ENgqgDKoVcD4mLpWAa0C6A5uCmgKIICaApoCCKCWgWRfy8CnZWDLQLqHehXcq2ACqFfBvQomgFR8/j1Ax8UrAlu9Atj/C9j2j0cPALbw9gUC4Hb/uPoAYAtvXyAAbvePqw8AtvD2BQLgdv+4+gBgC29fIABu94+rDwC28PYFAuB2/7j6AGALb18gAG73j6sPALbw9gUC4Hb/uHoGQI+LX2/p0j2J2gHdlq0N1N8V8GnhAWBbsgIA9/WXALaptATAOaApYPzTrhKgBMB72OQlQAlABPUQ2EMgAdQyEM8nIPef52kKaAoghpoCmgIIoKaApgACqBdBZF/PAE/fBfRdAN1D+vv+3gT2JpAAVPH5ZeD6uHhtwPeuVwDnp4R97w3Uzx8A6uBxfQAcb6CWHwDq4HF9ABxvoJYfAOrgcX0AHG+glh8A6uBxfQAcb6CWHwDq4HF9ABxvoJYfAOrgcX0AHG+glh8A6uBxfQAcb6CWzwDo+QD6AVSvW9J0fN2Vq+OrnjeFagGqDwBzMADMv6cEQANVXgKYgyWA+VcCoH8sLwHMwhLA/CsB0D+WlwBmYQlg/pUA6B/LSwCzsAQw/0oA9I/lJYBZWAKYfyUA+sfyEsAsLAHMvxIA/WN5CWAWcgLohoT1CR9mn6vX/gWA95CuEADjY96oe99AHAABQBjpFNoUQPa7uAQoAYiiEoDs24tLgBKAKCwByL69uAQoAYjCEoDs24tLgBKAKCwByL69uAQoAYjCEoDs24tLgBKAKNQE+Arayrsu/JzeUgAAAABJRU5ErkJggg=="
            alt="NFT"
            style={{
              borderRadius: '20%',
              height: '30px',
              width: 'auto',
            }}
          /> */}
          <h6 className="m-0 ms-3 py-2">
            Viewing {formatIdTransaction(ownerAddress, 4, 4)} balances
          </h6>

          <div className="ms-auto">
            <p
              onClick={handleSeeProfile}
              className="m-0 me-2 cursor-pointer text-primary text-hover-underline"
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
      <>
        <div className="my-1">
          <h4 className="mb-4">Details</h4>
          <ul className="p-0 list-unstyled">
            {details.map((detail, index) => (
              <li className="mt-1" key={index}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderDescription = () => {
    const segments = description.split('\n\n');
    const formattedDescription = segments.map((segment, index) => (
      <React.Fragment key={index}>
        {index > 0 && <p></p>}
        {segment}
      </React.Fragment>
    ));

    return (
      <div className="my-1">
        <h4 className="mb-4">Description</h4>
        <p>{formattedDescription}</p>
      </div>
    );
  };

  const renderAbout = () => {
    return (
      <>
        <hr />
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
        </div>{' '}
      </>
    );
  };

  document.title = `${name ? name : 'NFTs'} - ${collectionName || ''}`;

  return (
    <React.Fragment>
      <div className="page-content mt-5">
        {loading ? (
          <div
            style={{ height: '100vh' }}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Row>
              {collectionLogo && (
                <Col>
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={collectionLogo}
                      alt="NFT"
                      className="img-fluid"
                      style={{
                        height: '32px',
                        width: 'auto',
                        borderRadius: '30%',
                      }}
                    />
                    <h4 className=" mb-0 ms-2">{collectionName}</h4>
                  </div>
                </Col>
              )}
            </Row>
            <div className="my-3">
              <h1>{name}</h1>
            </div>
            {floorPriceFiat != 0 ? (
              <>
                <div className="my-3">
                  <p>Price by floor Price</p>
                </div>
                <div className="my-3">
                  <h1>{floorPriceFiat} ETH</h1>
                </div>
              </>
            ) : null}
            <div className="d-flex justify-content-center">
              {logo && (
                <img
                  src={logo}
                  className="d-block mx-auto img-fluid"
                  alt="NFT"
                  style={{
                    borderRadius: '20px',
                    height: 'auto',
                    maxHeight: '400px',
                    width: 'auto',
                  }}
                />
              )}
            </div>
            {ownerAddress ? <>{renderCardProfile()}</> : null}
            {attributes && attributes.length ? (
              <>
                {renderAttributes(attributes)}
                <hr />
              </>
            ) : null}
            {/* {details.length ? renderDetails() : null} */}
            {renderDetails()}
            {description ? (
              <>
                <hr />
                <div className="py-2">{renderDescription()}</div>
              </>
            ) : null}
            {/* <div className="py-2">{renderAbout()}</div> */}
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardNFT;
