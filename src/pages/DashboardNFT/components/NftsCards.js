import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';
import eth from '../../../assets/images/svg/crypto-icons/eth.svg';
import BlockchainImage from '../../../Components/BlockchainImage/BlockchainImage';

const NftsCards = ({ item, onVisitNft, showFiatValues, isDashboardPage }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleVisitNFT = (contractAddress, tokenId, blockchain) => {
    onVisitNft(contractAddress, tokenId, blockchain);
  };

  return (
    <div
      className="d-grid position-relative justify-content-center"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(186px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
      }}
    >
      {item &&
        item?.length > 0 &&
        item?.map((nft, index) => {
          const { floorPriceFiat, floorPriceNativeToken } = nft;
          const hasFiatFloorPrice =
            floorPriceFiat && Number(floorPriceFiat) > 0;
          const hasNativeTokenFloorPrice =
            floorPriceNativeToken && Number(floorPriceNativeToken) > 0;
          const hasFloorPrice = showFiatValues
            ? hasFiatFloorPrice
            : hasNativeTokenFloorPrice;
          const floorPrice = showFiatValues
            ? parseValuesToLocale(floorPriceFiat, CurrencyUSD)
            : parseValuesToLocale(floorPriceNativeToken) +
            ` ${nft?.nativeSymbol || ''}`;
          const shouldShowUnsupported =
            !nft.logo || imageErrors[nft.contractAddress + nft.tokenId];

          return (
            <div
              key={index}
              className="d-flex justify-content-center"
              style={{ maxWidth: '186px' }}
            >
              <Card
                onClick={() =>
                  handleVisitNFT(
                    nft.contractAddress,
                    nft.tokenId,
                    nft.blockchain,
                  )
                }
                className="cursor-pointer border-2 border bg-transparent shadow-none"
                style={{
                  borderRadius: '10px',
                  minWidth: '100%',
                  // maxWidth: '186px',
                }}
              >
                <CardHeader className="border-0 bg-transparent p-1">
                  <div
                    style={{
                      position: 'relative',
                      minHeight: '200px',
                    }}
                  >
                    {shouldShowUnsupported ? (
                      <div
                        className="d-flex justify-content-center align-item-center"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          backgroundColor: '',
                        }}
                      >
                        <h3 className="text-center pt-5">
                          Unsupported content
                        </h3>
                      </div>
                    ) : (
                      <img
                        src={nft.logo}
                        alt=""
                        className="img-fluid w-100 position-realative"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                        onError={() =>
                          setImageErrors((prev) => ({
                            ...prev,
                            [nft.contractAddress + nft.tokenId]: true,
                          }))
                        }
                      />
                    )}
                    <div className="">
                      <BlockchainImage
                        blockchainType={nft.blockchain}
                        style={{
                          position: 'absolute',
                          bottom: `${isDashboardPage ? '11%' : '7%'}`,
                          left: '2%',
                          width: 'auto',
                          height: '10%',
                        }}
                        className="img-fluid border-dark border border-rounded  border-1 d-flex justify-content-start shadow-md rounded-circle"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-1">
                  <div
                    className="d-flex flex-column justify-content-between"
                    style={{ height: '100%' }}
                  >
                    <div>
                      {nft?.collection?.name ? (
                        <span
                          style={{
                            fontSize: '11px',
                            marginBottom: '6px',
                            display: 'block',
                          }}
                          className="text-dark"
                        >
                          {nft.collection.name || ' '}
                        </span>
                      ) : null}

                      <h6 style={{ fontSize: '14px' }} className="text-dark">
                        {nft.name || ' '}
                      </h6>
                    </div>
                    {hasFloorPrice ? (
                      <div>
                        <span>{hasFloorPrice ? 'Floor Price' : ' '}</span>
                        <h6 className="text-dark d-flex mb-0">{floorPrice}</h6>
                      </div>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
    </div>
  );
};

export default NftsCards;
