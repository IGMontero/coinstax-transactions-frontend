import React, { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
} from 'reactstrap';

import { getAppOptions, setAppOptions } from '../../../helpers/cookies_helper';
import AssetsSkeleton from '../../../Components/Skeletons/AssetsSkeleton';
import AssetsTable from '../../DashboardAssets/components/AssestTable';

const ActivesTable = ({ data, loading, isDashboardPage, buttonSeeMore }) => {
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
          className={`btnAsset btn btn-sm btn-soft-primary text-dark border-0`}
          onClick={() => handleViewModeChange('byPlatform')}
          style={{borderRadius: '16px', boxShadow: `${viewMode === 'byPlatform' ? 'rgb(0 0 0 / 5%) 0px 2px 1px 1px' : ""}`}}
        >
          By Platform
        </Button>
        <Button
          className={`btnAsset btn mx-2 btn-sm btn-soft-primary text-dark border-0`}
          onClick={() => handleViewModeChange('perPosition')}
          style={{borderRadius: '16px', boxShadow: `${viewMode === 'perPosition' ? 'rgb(0 0 0 / 5%) 0px 2px 1px 1px' : ""}`}}
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
            <i className="ri-arrow-down-s-line p-1 py-0 btn rounded" style={{color: "#909ACA"}}></i>
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
              <h4>No assets found</h4>
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
              <div
                style={{
                  overflow: 'hidden',
                }}
              >
                {loading ? (
                  <>
                    {/* <thead>
                      <tr>
                        <th>ASSETS</th>
                        <th>PRICE</th>
                        <th>BALANCE</th>
                        <th>VALUE</th>
                      </tr>
                    </thead> */}
                    <AssetsSkeleton />
                  </>
                ) : (
                  <AssetsTable
                    loading={loading}
                    displayItems={displayItems}
                    data={data}
                    isDashboardPage={isDashboardPage}
                    buttonSeeMore={buttonSeeMore}
                    viewMode={viewMode}
                  />
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActivesTable;
