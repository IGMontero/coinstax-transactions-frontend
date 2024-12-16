import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import {
  selectNetworkType,
  setNetworkType,
} from '../../slices/networkType/reducer';
import { CurrencyUSD, parseValuesToLocale } from '../../utils/utils';
import { layoutModeTypes } from '../constants/layout';

const TokenSVG = (
  <svg
    width="16"
    height="16"
    className="me-1"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Tokens on chain"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.698 8.224a5.753 5.753 0 00-4.922-4.922 3.5 3.5 0 114.922 4.922zM7 5a4 4 0 100 8 4 4 0 000-8z"
      fill="#81848E"
    ></path>
  </svg>
);

const NFTsSVG = (
  <svg
    width="14"
    className="ms-2 me-1"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="NFTs on chain"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2a6 6 0 000 12 1.262 1.262 0 00.937-2.11.63.63 0 01.471-1.047h1.118A3.475 3.475 0 0014 7.367C14 4.368 11.277 2 8 2zM4.605 8.632c-.568 0-1.026-.424-1.026-.948s.458-.947 1.026-.947c.568 0 1.027.423 1.027.947s-.459.948-1.027.948zm1.369-2.527c-.568 0-1.027-.423-1.027-.947s.459-.947 1.027-.947c.568 0 1.026.423 1.026.947s-.458.947-1.026.947zm2.737-.631c-.568 0-1.027-.423-1.027-.948 0-.524.459-.947 1.027-.947.567 0 1.026.423 1.026.947 0 .525-.459.948-1.026.948zm2.052 1.894c-.568 0-1.026-.423-1.026-.947s.458-.947 1.026-.947c.568 0 1.027.423 1.027.947s-.459.947-1.027.947z"
      fill="currentColor"
    ></path>
  </svg>
);

const CheckSVG = (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary ms-2"
  >
    <path
      d="M9.5 16.2L6 12.7a.984.984 0 00-1.4 0 .984.984 0 000 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.8 7.7a.984.984 0 000-1.4.984.984 0 00-1.4 0l-9.9 9.9z"
      fill="currentColor"
    ></path>
  </svg>
);

const NetworkDropdown = ({
  addressBlockchains,
  incompleteBlockchains,
  loading,
  isAdminPage,
}) => {
  const dispatch = useDispatch();
  const networkType = useSelector(selectNetworkType);
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const fixedData = useSelector((state) => state.Common.fixedData);

  const { chains } = fixedData;

  const chainsWithInfo = chains?.filter(chain => {
    // Chain model: name, label, isTestnet, logoUrl, whiteLogoUrl, blackLogoUrl, chainId.
    // Look for addrress blockchains that match the chainId
    return addressBlockchains?.[chain.name]

  })

  const selectedChain =
    networkType === 'all' ? {
      name: 'all',
    } :
      chainsWithInfo?.find(chain => chain.name === networkType)

  const addressSummaryChains = chainsWithInfo?.map(chain => {
    return addressBlockchains[chain.name]
  })


  const handleChangeNetwork = (newType) => {
    dispatch(setNetworkType(newType));
  };

  const renderNetworkIcon = (chain) => {
    // Find network in chains
    if (!chain) {
      return null;
    }

    const logoUrl = chain?.logoUrl;
    const colorTheme = chain?.colorTheme;

    // Set styles for the wrapper
    const wrapperStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px', // Adjust size as needed
      height: '30px', // Adjust size as needed
      borderRadius: '50%', // Circle for 'all', square otherwise
      backgroundColor: colorTheme?.hex || colorTheme?.css_rgb || '#ccc', // Fallback to a default color
      padding: '5px',
      marginRight: '10px',
    };


    return (
      <>
        {chain.name === 'all' ? (
          // <>{chain.icon}</>
          null
        ) : (
          <div style={wrapperStyle}>
            <img
              src={logoUrl}
              alt={chain.label}
              width={25}
              height={25}
              style={{
                borderRadius: '3px',
              }}
            // className="ms-n1 me-2"
            />
          </div>
        )}
      </>
    );
  };

  const renderSummaryChainsItem = (chainSummary) => {
    if (!chainSummary) return null;


    const displayValue =
      chainSummary?.totalValue !== undefined && chainSummary.totalValue !== null
        ? chainSummary.totalValue
        : 0;

    const isIncomplete = isAdminPage
      ? false
      : incompleteBlockchains.includes(chainSummary.blockchain);

    const nftsValue = chainSummary.nftsValue
    const shouldDisplayNftsValue = nftsValue && nftsValue > 0;
    const chainInfo = chains.find(chain => chain.name === chainSummary.blockchain)

    if (!chainInfo) return null;

    return (
      <React.Fragment key={chainInfo.name}>
        <DropdownItem
          key={chainInfo.name}
          onClick={() => handleChangeNetwork(chainInfo.name)}
          className="d-flex align-items-center mt-0 py-2"
        >
          {renderNetworkIcon(chainInfo)}
          <div className="d-flex align-items-center flex-row w-100">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <span className="fw-normal">{chainInfo.label}</span>
              </div>

              <div
                className={`d-${isAdminPage ? 'none' : 'flex'} flex-row align-items-center`}
              >
                {TokenSVG}
                <small>
                  {isIncomplete ? (
                    <Skeleton
                      width={50}
                      baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                      highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
                    />
                  ) : (
                    parseValuesToLocale(
                      displayValue,
                      CurrencyUSD,
                      false,
                      displayValue,
                    )
                  )}
                </small>
                {shouldDisplayNftsValue ? (
                  <>
                    {NFTsSVG}
                    <small>
                      {parseValuesToLocale(
                        nftsValue?.toFixed(2),
                        CurrencyUSD,
                      )}
                    </small>
                  </>
                ) : null}
              </div>
            </div>
            <div className="ms-auto">
              {chainInfo.name === networkType && CheckSVG}
            </div>
          </div>
        </DropdownItem>

      </React.Fragment>
    );
  };


  if (!selectedChain || !chains) {
    return null;
  }

  return (
    <Col xxl={6} className="d-flex justify-content-end align-items-center">
      <div className="d-flex justify-content-end align-items-center">
        <UncontrolledDropdown className="card-header-dropdown ">
          <DropdownToggle
            tag="a"
            className={`btn btn-sm  ${loading ? 'btn-light' : 'btn-hover-light'} p-1 ps-3 d-flex justify-content-between align-items-center border rounded`}
            role="button"
            color="soft-primary"
            disabled={loading}
            style={{
              maxHeight: '40px',
              height: '40px',
              width: '170px',
              maxWidth: '170px',
              minWidth: '170px',
              borderRadius: '10px',
              border: '0.5px solid grey',
              cursor: `${loading ? 'default' : 'pointer'}`,
            }}
          >
            <span className="d-flex align-items-center py-0">
              {renderNetworkIcon(selectedChain)}
              <span
                className={`fs-6 ${loading ? 'text-muted' : 'text-dark'} py-0`}
                style={{ maxWidth: '140px' }}
              >
                {selectedChain.label}
              </span>
            </span>
            <i
              className={`mdi mdi-chevron-down ${loading ? 'text-muted' : 'text-dark'} ms-2 fs-5`}
            ></i>
          </DropdownToggle>
          <DropdownMenu
            className="dropdown-menu-end mt-2"
            id="network-dropdown-menu"
            style={{
              minWidth: '240px',
            }}
          >
            {addressSummaryChains?.map((chainSummary) => {
              return renderSummaryChainsItem(chainSummary)
            })}


          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Col>
  );
};

export default NetworkDropdown;
