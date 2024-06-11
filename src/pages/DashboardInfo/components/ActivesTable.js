import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
} from 'reactstrap';
import {
  CurrencyUSD,
  capitalizeFirstLetter,
  parseValuesToLocale,
} from '../../../utils/utils';
import BlockchainImage from '../../../Components/BlockchainImage/BlockchainImage';
import { getAppOptions, setAppOptions } from '../../../helpers/cookies_helper';
import AssetsSkeleton from '../../../Components/Skeletons/AssetsSkeleton';

const ActivesTable = ({
  data,
  loading,
  isDashboardPage,
  buttonSeeMore,
  loadingAddressesInfo,
}) => {
  const appOptions = getAppOptions();

  const [viewMode, setViewMode] = useState('byPlatform');
  const [showMenu, setShowMenu] = useState(false);
  const [hideSmallBalances, setHideSmallBalances] = useState(
    appOptions.hideSmallBalances,
  );
  const [hideZeroBalances, setHideZeroBalances] = useState(
    appOptions.hideZeroBalances,
  );

  useEffect(() => {
    setAppOptions({ ...appOptions, hideSmallBalances, hideZeroBalances });
  }, [hideSmallBalances, hideZeroBalances]);

  const formatBalance = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
      return 'Invalid Number';
    }
    const hasComma = number > 999;
    const formattedNumber = number.toLocaleString(undefined, {
      minimumFractionDigits: hasComma ? 4 : 0,
      maximumFractionDigits: 4,
    });
    return formattedNumber;
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleHideSmallBalancesChange = (event) => {
    setHideSmallBalances(!hideSmallBalances);
  };

  const handleHideZeroBalancesChange = (event) => {
    setHideZeroBalances(!hideZeroBalances);
  };

  const handleShowMenu = (e) => {
    setShowMenu(!showMenu);
  };

  const renderFilterButtons = () => {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          className={`btn btn-sm btn-soft-primary rounded ${
            viewMode === 'byPlatform' ? 'active' : ''
          }`}
          onClick={() => handleViewModeChange('byPlatform')}
        >
          By Platform
        </Button>
        <Button
          className={`mx-2 btn btn-sm btn-soft-primary rounded ${
            viewMode === 'perPosition' ? 'active' : ''
          }`}
          onClick={() => handleViewModeChange('perPosition')}
        >
          Per Position
        </Button>

        <Dropdown
          isOpen={showMenu}
          toggle={(e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
              handleShowMenu();
            }
          }}
          className="card-header-dropdown"
        >
          <DropdownToggle tag="a" className="text-reset" role="button">
            <i className="ri-arrow-down-s-line p-1 py-0 btn btn-soft-primary rounded"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-start mt-2">
            <DropdownItem
              toggle={false}
              onClick={(e) => handleHideSmallBalancesChange(e)}
              className="d-flex justify-content-start align-items-center"
            >
              <input
                className="form-check-input me-2 my-0"
                type="checkbox"
                id="hideBalances"
                onChange={(e) =>
                  handleHideSmallBalancesChange(e.stopPropagation())
                }
                checked={hideSmallBalances}
              />
              <label
                className="form-check-label"
                htmlFor="hideBalances"
                onClick={(e) =>
                  handleHideSmallBalancesChange(e.preventDefault())
                }
                style={{ cursor: 'pointer' }}
              >
                Hide small balances
              </label>
            </DropdownItem>
            <DropdownItem
              toggle={false}
              onClick={(e) => handleHideZeroBalancesChange(e)}
              className="d-flex justify-content-start align-items-center"
            >
              <input
                className="form-check-input me-2 my-0"
                type="checkbox"
                id="hideZeroBalances"
                onChange={(e) =>
                  handleHideZeroBalancesChange(e.stopPropagation())
                }
                checked={hideZeroBalances}
              />
              <label
                className="form-check-label"
                htmlFor="hideZeroBalances"
                style={{ cursor: 'pointer', margin: 0 }}
                onClick={(e) =>
                  handleHideZeroBalancesChange(e.preventDefault())
                }
              >
                Hide zero balances
              </label>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  const filteredItems = data.items
    ? data?.items?.filter(
        (asset) =>
          (!hideSmallBalances || asset.value >= 1) &&
          (!hideZeroBalances || (asset.value !== 0 && asset.value !== null)),
      )
    : [];

  const displayItems = isDashboardPage
    ? filteredItems.slice(0, 10)
    : filteredItems;

  return (
    <React.Fragment>
      {isDashboardPage ? null : (
        <div className="mt-0">
          <h1 className={` ms-1  mb-4 mt-4 `}>Assets</h1>
        </div>
      )}
      <div
        className={`${!isDashboardPage ? 'border rounded border-2 p-3' : ''}`}
      >
        <div>
          {!loading && (!data || !data.items || data.items?.length === 0) ? (
            <div className="text-center py-2 mt-3">
              <h4>No Assets Found</h4>
            </div>
          ) : (
            <div>
              <div className="d-flex flex-row align-items-center justify-content-between ">
                {/* {viewMode === 'byPlatform' && ( */}
                <h4>
                  <b> Wallet </b>
                  {data?.total && isNaN(data?.total)
                    ? loading
                      ? null
                      : `$${formatBalance(data.total)} US`
                    : null}
                </h4>
                {/* )} */}
                <div className="flex-grow-1 d-flex justify-content-end align-items-center">
                  {renderFilterButtons()}
                </div>
              </div>
              <div className="table-container ">
                <div className="live-preview">
                  <div className="table-responsive ">
                    <Table className="table  table-borderless table-centered align-middle table-nowrap mb-0">
                      <thead>
                        <tr className="text-muted">
                          <th scope="col">ASSETS</th>
                          <th scope="col">PRICE</th>
                          <th scope="col">BALANCE</th>
                          <th scope="col">VALUE</th>
                        </tr>
                      </thead>
                      {loadingAddressesInfo || loading ? (
                        <tr>
                          <td colSpan="12" className="text-center">
                            <tbody>
                              <AssetsSkeleton />
                            </tbody>
                          </td>
                        </tr>
                      ) : displayItems.length === 0 ? (
                        <tbody className="">
                          <tr>
                            <td colSpan="4" className="text-center pb-2 pt-5">
                              <h4>No Assets Yet</h4>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {displayItems.map((asset, index) => (
                            <tr key={index} className="">
                              <td>
                                <div className="d-flex align-items-center fw-high">
                                  <img
                                    src={asset.logo}
                                    alt={asset.name}
                                    className="rounded-circle avatar-xs me-2"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      if (
                                        !e.target.parentNode.querySelector(
                                          '.img-assets-placeholder',
                                        )
                                      ) {
                                        e.target.style.display = 'none';

                                        const textNode =
                                          document.createElement('div');
                                        textNode.textContent = asset.name
                                          ?.substring(0, 3)
                                          .toUpperCase();
                                        textNode.className =
                                          'img-assets-placeholder avatar-xs me-2';

                                        const container = e.target.parentNode;
                                        container.insertBefore(
                                          textNode,
                                          container.firstChild,
                                        );
                                      }
                                    }}
                                  />

                                  <div className="d-flex flex-column ">
                                    <div className="d-flex flex-row align-items-center">
                                      {asset.name}{' '}
                                      {viewMode === 'perPosition' && (
                                        <Badge
                                          color="soft-dark"
                                          style={{ fontWeight: 'inherit' }}
                                          className="mx-2 p-1 fs-7"
                                        >
                                          <span className="text-dark">
                                            {asset.percentage < 1
                                              ? '<0.01'
                                              : asset.percentage}
                                            {'%'}
                                          </span>
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="d-flex align-items-center text-muted">
                                      <BlockchainImage
                                        width={15}
                                        height={15}
                                        className={'me-1'}
                                        blockchainType={asset.blockchain}
                                      />
                                      {asset.blockchain === 'bnb'
                                        ? 'BNB Chain'
                                        : capitalizeFirstLetter(
                                            asset.blockchain,
                                          )}{' '}
                                      · Wallet
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {asset.price
                                  ? parseValuesToLocale(
                                      asset.price,
                                      CurrencyUSD,
                                    )
                                  : '$0.00'}
                              </td>
                              <td>
                                {asset.balance ? (
                                  <span>
                                    {parseValuesToLocale(asset.balance, '') +
                                      ' ' +
                                      asset.symbol}
                                  </span>
                                ) : (
                                  '0.00'
                                )}
                              </td>
                              <td>
                                <div className="d-flex flex-column align-items-start">
                                  <span>
                                    {asset.value
                                      ? parseValuesToLocale(
                                          asset.value,
                                          CurrencyUSD,
                                        )
                                      : parseValuesToLocale(0, CurrencyUSD)}
                                  </span>
                                  <small
                                    className={`${
                                      asset.prettyDeltaValuePercent === '0.00%'
                                        ? 'text-primary'
                                        : asset.prettyDeltaValuePercent[0] ===
                                            '-'
                                          ? 'text-danger'
                                          : 'text-success'
                                    }`}
                                  >
                                    {asset.prettyDeltaValuePercent === '0.00%'
                                      ? parseValuesToLocale(
                                          asset.deltaValuePercent,
                                          '',
                                        )
                                      : (asset.prettyDeltaValuePercent[0] ===
                                        '-'
                                          ? ''
                                          : '+') +
                                        parseValuesToLocale(
                                          asset.deltaValuePercent,
                                          '',
                                        )}
                                    {asset.deltaValue
                                      ? ' (' +
                                        parseValuesToLocale(
                                          asset.deltaValue,
                                          CurrencyUSD,
                                        ) +
                                        ')'
                                      : null}
                                  </small>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </Table>
                  </div>
                </div>
                {isDashboardPage &&
                  data?.items?.length > 0 &&
                  buttonSeeMore('assets', 'Assets')}
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActivesTable;
