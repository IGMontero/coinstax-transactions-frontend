import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import {
  capitalizeFirstLetter,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../utils/utils';
import { getNftsByContractAddress } from '../../slices/transactions/thunk';
import { useDispatch } from 'react-redux';

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

  const [floorPriceNativeToken, setFloorPriceNativeToken] = useState(0);
  const [symbol, setSymbol] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const tokenId = queryParams.get('tokenId');
  const blockchain = queryParams.get('blockchain');

  const fetchNftByContractAddress = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getNftsByContractAddress({
          blockchain,
          contractAddress,
          tokenId,
        }),
      );
      const res = response.payload;
      if ((res && res.error) || !res) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
        return;
      } else {
        setCollectionLogo(res.collection.logo);
        setCollectionName(res.collection.name);
        setLogo(res.logo);
        setName(res.name);
        setOwnerAddress(res.ownerAddress);
        setFloorPriceNativeToken(res.floorPriceNativeToken);
        setSymbol(res.symbol);
        setAttributes(res.metadata.attributes);
        setDescription(res.description);
        setDetails([
          'Network',
          `${
            blockchain === 'bnb'
              ? 'BNB Chain'
              : capitalizeFirstLetter(blockchain)
          }`,
        ]);
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
    navigate(`/address/${ownerAddress}`);
  };

  const renderCardProfile = () => {
    return (
      <div className="card mt-4 p-2 rounded">
        <div className="d-flex align-items-center ">
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

  document.title = `${name || 'NFTs | Chain Glance'}  ${'-' + collectionName || ''}`;

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
            {floorPriceNativeToken != 0 ? (
              <>
                <div className="my-3">
                  <p>Price by floor Price</p>
                </div>
                <div className="my-3">
                  <h1>{parseValuesToLocale(floorPriceNativeToken, '')} ETH</h1>
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
            {details.length ? renderDetails() : null}
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
