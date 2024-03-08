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
  // const [loading, setLoading] = useState(false);
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
    event.stopPropagation();
    event.preventDefault();
    setHideSmallBalances(!hideSmallBalances);
  };

  const handleHideZeroBalancesChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setHideZeroBalances(!hideZeroBalances);
  };

  const handleShowMenu = (e) => {
    setShowMenu(!showMenu);
  };

  return (
    <React.Fragment>
      <div className="mb-3">
        <div className="flex-grow-1 d-flex justify-content-between">
          <h2 className="ms-1 mb-3">Assets</h2>
          <div className="d-flex justify-content-between align-items-center ">
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
                  onClick={handleHideSmallBalancesChange}
                  className="d-flex justify-content-start align-items-center"
                >
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="hideBalances"
                    checked={hideSmallBalances}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="hideBalances"
                    onClick={handleHideSmallBalancesChange}
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    Hide small balances
                  </label>
                </DropdownItem>
                <DropdownItem
                  toggle={false}
                  onClick={handleHideZeroBalancesChange}
                  className="d-flex justify-content-start align-items-center"
                >
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="hideZeroBalances"
                    checked={hideZeroBalances}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="hideZeroBalances"
                    style={{ cursor: 'pointer', margin: 0 }}
                    onClick={handleHideZeroBalancesChange}
                  >
                    Hide zero balances
                  </label>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="border border-2 rounded p-3">
          {data.items && data.items.length === 0 ? (
            <div className="text-center py-2 mt-3">
              <h4>No Assets Found</h4>
            </div>
          ) : (
            <>
              {viewMode === 'byPlatform' && (
                <div className="d-flex flex-row align-items-center">
                  <h4>
                    <b> Wallet </b>${formatBalance(data.total)} US${' '}
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
                        .map((asset, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center fw-high">
                                <img
                                  src={asset.logo || asset.name}
                                  alt={asset.logo}
                                  className="avatar-xs me-2"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';

                                    const siblingDiv =
                                      e.target.nextElementSibling;
                                    if (
                                      siblingDiv &&
                                      siblingDiv.classList.contains(
                                        'img-assets-placeholder',
                                      )
                                    ) {
                                      siblingDiv.style.display = 'block';
                                    }
                                  }}
                                />
                                <div className="label-assets-placeholder">
                                  {asset.name}
                                </div>
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
                                      : asset.prettyDeltaValuePercent[0] === '-'
                                        ? 'text-danger'
                                        : 'text-success'
                                  }`}
                                >
                                  {asset.prettyDeltaValuePercent === '0.00%'
                                    ? asset.prettyDeltaValuePercent
                                    : (asset.prettyDeltaValuePercent[0] === '-'
                                        ? ''
                                        : '+') + asset.prettyDeltaValuePercent}
                                  {' (' +
                                    '$' +
                                    asset.deltaValue.toFixed(2) +
                                    ')'}
                                </small>
                              </div>
                            </td>
                          </tr>
                        ))}
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
