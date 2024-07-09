import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { updateNftsSpamStatus } from '../../../slices/transactions/thunk';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';
import BlockchainImage from '../../../Components/BlockchainImage/BlockchainImage';
import { useDispatch, useSelector } from 'react-redux';
import { selectNetworkType } from '../../../slices/networkType/reducer';

const NftsCards = ({
  item,
  onVisitNft,
  showFiatValues,
  isDashboardPage,
  includeSpam,
}) => {
  const dispatch = useDispatch();
  const iconRefs = useRef([]);
  const [imageErrors, setImageErrors] = useState({});
  const [nfts, setNfts] = useState(item);
  const [tooltipTargetIds, setTooltipTargetIds] = useState([]);

  const networkType = useSelector(selectNetworkType);

  const handleVisitNFT = (contractAddress, tokenId, blockchain) => {
    onVisitNft(contractAddress, tokenId, blockchain);
  };

  useEffect(() => {
    iconRefs.current = iconRefs.current.slice(0, nfts.length);
    const ids = nfts.map((nft, index) => {
      return nft.isSpam
        ? `spam-icon-spam-${index}`
        : `spam-icon-not-spam-${index}`;
    });
    setTooltipTargetIds(ids);
  }, [nfts]);

  const handleSpam = async (contractAddress, tokenId, spam, blockchain) => {
    try {
      const response = await dispatch(
        updateNftsSpamStatus({
          blockchain,
          contractAddress,
          tokenId,
          spam,
        }),
      ).unwrap();

      if (response.spam !== undefined) {
        setNfts(
          (prevNfts) =>
            prevNfts.map((nft) =>
              nft.tokenId === tokenId && nft.contractAddress === contractAddress
                ? { ...nft, isSpam: response.spam }
                : nft,
            ),
          // .filter((nft) => !nft.isSpam),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setNfts(item);
  }, [item]);

  const nftsToRender = includeSpam
    ? nfts
    : nfts.filter((nft) => !nft.isSpam) || [];

  return (
    <div
      className="d-grid position-relative justify-content-center"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(186px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
      }}
    >
      {nftsToRender?.map((nft, index) => {
        const { floorPriceFiat, floorPriceNativeToken, isSpam } = nft;
        const hasFiatFloorPrice = floorPriceFiat && Number(floorPriceFiat) > 0;
        const hasNativeTokenFloorPrice =
          floorPriceNativeToken && Number(floorPriceNativeToken) > 0;
        const hasFloorPrice = showFiatValues
          ? hasFiatFloorPrice
          : hasNativeTokenFloorPrice;
        const floorPrice = showFiatValues
          ? parseValuesToLocale(floorPriceFiat, CurrencyUSD)
          : parseValuesToLocale(floorPriceNativeToken) +
            `${nft?.nativeSymbol || ''}`;
        const shouldShowUnsupported =
          !nft.logo || imageErrors[nft.contractAddress + nft.tokenId];
        const iconId = isSpam
          ? `spam-icon-spam-${index}`
          : `spam-icon-not-spam-${index}`;
        return (
          <div
            key={index}
            className="d-flex justify-content-center position-relative card-container"
          >
            <div className="spam-flag cursor-pointer">
              <span>
                {isSpam ? (
                  <div
                    id={iconId}
                    ref={(el) => (iconRefs.current[index] = el)}
                    onClick={() =>
                      handleSpam(
                        nft.contractAddress,
                        nft.tokenId,
                        false,
                        nft.blockchain,
                      )
                    }
                  >
                    <i className="ri-spam-fill fs-4 p-0"></i>
                    {tooltipTargetIds.includes(iconId) && (
                      <UncontrolledTooltip
                        placement="left"
                        target={iconId}
                        className="popover-dark"
                      >
                        <span style={{ fontSize: '0.70rem' }}>
                          Unflag as Spam
                        </span>
                      </UncontrolledTooltip>
                    )}
                  </div>
                ) : (
                  <div
                    id={iconId}
                    ref={(el) => (iconRefs.current[index] = el)}
                    onClick={() =>
                      handleSpam(nft.contractAddress, nft.tokenId, true)
                    }
                  >
                    <i className="ri-spam-line fs-4 p-0"></i>
                    {tooltipTargetIds.includes(iconId) && (
                      <UncontrolledTooltip
                        placement="left"
                        target={iconId}
                        className="popover-dark"
                      >
                        <span style={{ fontSize: '0.70rem' }}>
                          Flag as Spam
                        </span>
                      </UncontrolledTooltip>
                    )}
                  </div>
                )}
              </span>
            </div>
            <Card
              onClick={() =>
                handleVisitNFT(nft.contractAddress, nft.tokenId, nft.blockchain)
              }
              className="cursor-pointer border-2 border bg-transparent shadow-none"
              style={{
                borderRadius: '10px',
                minWidth: '100%',
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
                      <h3 className="text-center pt-5">Unsupported content</h3>
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
                      className="img-fluid border-dark border border-rounded border-1 d-flex justify-content-start shadow-md rounded-circle"
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
