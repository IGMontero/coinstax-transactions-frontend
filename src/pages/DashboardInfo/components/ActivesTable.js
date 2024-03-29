import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from 'reactstrap';
import eth from '../../../assets/images/svg/crypto-icons/eth.svg';

const AcitvesTable = ({ data, loading }) => {
  const [viewMode, setViewMode] = useState('byPlatform');

  const [showMenu, setShowMenu] = useState(false);
  const [hideSmallBalances, setHideSmallBalances] = useState(false);

  const [hideZeroBalances, setHideZeroBalances] = useState(true);

  // useEffect(() => {
  //   if (data) {
  //     setLoading(false);
  //   }
  // }, [data]);

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

  const formatPriceAndValue = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
      return 'Invalid Number';
    }

    const hasComma = number > 999;
    const hasDecimal = number % 1 !== 0;
    const minimumFractionDigits = hasComma ? 2 : hasDecimal ? 2 : 0;

    const formattedNumber = number.toLocaleString(undefined, {
      minimumFractionDigits:
        number === 0 && hasDecimal ? 6 : minimumFractionDigits,
      maximumFractionDigits: 6,
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

  const isDashboardPage = location.pathname.includes('tokens');

  return (
    <React.Fragment>
      <h1 className={`${isDashboardPage ? 'd-none' : 'ms-1 mt-0 mb-4'}`}>
        Assets
      </h1>
      <div
        className={
          Object.keys(data).length === 0 && !loading ? 'd-none' : 'mb-3'
        }
      >
        <div className="flex-grow-1 d-flex justify-content-between">
          <h2 className={`${!isDashboardPage ? 'd-none' : 'ms-1 mb-3'}`}>
            Assets
          </h2>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <i className="ri-expand-left-right-line p-1 py-0 btn btn-soft-primary rounded"></i>
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
                if (
                  e.target.tagName !== 'INPUT' &&
                  e.target.tagName !== 'LABEL'
                ) {
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
        </div>
        <div className="border border-2 rounded p-3">
          {(data.items && data.items.length === 0) || !data ? (
            <div className="text-center py-2 mt-3 ">
              <h4>No Assets Found</h4>
            </div>
          ) : (
            <>
              {viewMode === 'byPlatform' && (
                <div className="d-flex flex-row align-items-center">
                  <h4>
                    <b> Wallet </b>
                    {data?.total && isNaN(data?.total)
                      ? loading
                        ? null
                        : `$${formatBalance(data.total)} US`
                      : null}
                  </h4>{' '}
                  <Badge
                    color="soft-dark"
                    className="mb-2 ms-2 p-1 fs-7"
                    style={{ fontWeight: 'inherit' }}
                  >
                    {' '}
                    <span className="text-dark">100%</span>
                  </Badge>
                </div>
              )}

              <table className="table table-borderless ">
                <thead>
                  <tr className="text-muted ">
                    <th scope="col">ASSETS</th>
                    <th scope="col">PRICE</th>
                    <th scope="col">BALANCE</th>
                    <th scope="col">VALUE</th>
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-center">
                        <Spinner
                          style={{ width: '4rem', height: '4rem' }}
                          className="mt-5"
                        />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {data.items &&
                      data?.items
                        .filter(
                          (asset) =>
                            (!hideSmallBalances || asset.value >= 1) &&
                            (!hideZeroBalances ||
                              (asset.value !== 0 && asset.value !== null)),
                        )
                        .map((asset, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center fw-high">
                                  <img
                                    src={asset.logo}
                                    alt={asset.name}
                                    className="rounded-circle avatar-xs me-2"
                                    onError={(e) => {
                                      e.target.onerror = null;
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
                                    }}
                                  />

                                  <div className="d-flex flex-column">
                                    <div className="d-flex flex-row align-items-center">
                                      {asset.name}{' '}
                                      {viewMode === 'perPosition' && (
                                        <Badge
                                          color="soft-dark"
                                          style={{ fontWeight: 'inherit' }}
                                          className="mx-2 p-1 fs-7"
                                        >
                                          <span className="text-dark">
                                            {' '}
                                            {asset.percentage < 1
                                              ? '<0.01'
                                              : asset.percentage}
                                            {'%'}
                                          </span>
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="d-flex align-items-center text-muted">
                                      <img
                                        src={eth}
                                        width={15}
                                        height={15}
                                        className="me-1 "
                                      />
                                      Ethereum · Wallet
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {asset.price
                                  ? '$' + formatPriceAndValue(asset.price)
                                  : '$0.00'}
                              </td>
                              <td>
                                {asset.balance ? (
                                  <span>
                                    {formatBalance(asset.balance) +
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
                                    {asset.value ? asset.prettyValue : '$0.00'}
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
                                      ? asset.prettyDeltaValuePercent
                                      : (asset.prettyDeltaValuePercent[0] ===
                                        '-'
                                          ? ''
                                          : '+') +
                                        asset.prettyDeltaValuePercent}
                                    {' (' +
                                      '$' +
                                      asset.deltaValue.toFixed(2) +
                                      ')'}
                                  </small>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                )}
              </table>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AcitvesTable;
