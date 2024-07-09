import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import {
  CurrencyUSD,
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
  const [nft, setNft] = useState({});

  const queryParams = new URLSearchParams(location.search);
  const tokenId = queryParams.get('tokenId');
  const blockchain = queryParams.get('blockchain');


  const collectionLogo = nft?.collection?.logo;
  const collectionName = nft?.collection?.name;
  const attributes = nft?.metadata?.attributes;
  const description = nft?.description;
  const logo = nft?.logoLarge || nft?.logo;
  const name = nft?.name;
  const ownerAddress = nft?.ownerAddress;
  const details = [
    'Network',
    `${blockchain === 'bnb' ? 'BNB Chain' : capitalizeFirstLetter(blockchain)}`,
  ];



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
        setNft(res);
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
    // return (
    //   <div
    //     // className="d-flex"
    //     style={{
    //       whiteSpace: 'pre-wrap',
    //     }}
    //     dangerouslySetInnerHTML={{
    //       __html: description,
    //     }}
    //   ></div>
    // );

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

  document.title = `${name || 'NFTs'}  ${'- ' + collectionName || ''} | Chain Glance`;

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
            {nft?.floorPriceFiat != 0 ? (
              <>
                <div className="my-3">
                  <p>Price by floor Price</p>
                </div>
                <div className="my-3">
                  <h1>
                    {parseValuesToLocale(nft?.floorPriceFiat, CurrencyUSD)}
                  </h1>
                  {nft?.floorPriceNativeToken != 0 ? (
                    <p>
                      {parseValuesToLocale(nft?.floorPriceNativeToken, '') +
                        ` ${nft?.nftNativeSymbol || ''}`}
                    </p>
                  ) : null}
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
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardNFT;
