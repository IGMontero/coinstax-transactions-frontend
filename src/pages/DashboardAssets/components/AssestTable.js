import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import BlockchainImage from '../../../Components/BlockchainImage/BlockchainImage';
import { Badge } from 'reactstrap';
import { layoutModeTypes } from '../../../Components/constants/layout';
import {
  CurrencyUSD,
  capitalizeFirstLetter,
  parseValuesToLocale,
} from '../../../utils/utils';
import AssetsSkeleton from '../../../Components/Skeletons/AssetsSkeleton';
import { useSelector } from 'react-redux';

const AssetsTable = ({
  loading,
  displayItems,
  isDashboardPage,
  data,
  buttonSeeMore,
  viewMode,
}) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 820);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 820);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = [
    {
      name: 'ASSETS',
      selector: (row) => (
        <div className="d-flex align-items-center fw-high">
          <img
            src={row.logo}
            alt={row.name}
            className="rounded-circle avatar-xs me-2"
            onError={(e) => {
              e.target.onerror = null;
              if (
                !e.target.parentNode.querySelector('.img-assets-placeholder')
              ) {
                e.target.style.display = 'none';

                const textNode = document.createElement('div');
                textNode.textContent = row.name?.substring(0, 3).toUpperCase();
                textNode.className = 'img-assets-placeholder avatar-xs me-2';

                const container = e.target.parentNode;
                container.insertBefore(textNode, container.firstChild);
              }
            }}
          />
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center">
              {row.name}{' '}
              {viewMode === 'perPosition' && (
                <Badge
                  color="soft-light"
                  style={{ fontWeight: 'inherit' }}
                  className="mx-2 p-1 fs-7"
                >
                  <span className="text-dark">
                    {row.percentage < 1 ? '<0.01' : row.percentage}
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
                blockchainType={row.blockchain}
              />
              {row.blockchain === 'bnb'
                ? 'BNB Chain'
                : capitalizeFirstLetter(row.blockchain)}{' '}
              · Wallet
            </div>
          </div>
        </div>
      ),
      sortable: false,
      grow: 2,
    },
    {
      name: 'PRICE',
      selector: (row) =>
        row.price ? parseValuesToLocale(row.price, CurrencyUSD) : '$0.00',
      sortable: false,
      omit: isSmallScreen,
      cell: (row) => (
        <div className="">
          {row.price ? parseValuesToLocale(row.price, CurrencyUSD) : '$0.00'}
        </div>
      ),
    },
    {
      name: 'BALANCE',
      selector: (row) =>
        row.balance ? (
          <span>{parseValuesToLocale(row.balance, '') + ' ' + row.symbol}</span>
        ) : (
          '0.00'
        ),
      sortable: false,
      omit: isSmallScreen,
      cell: (row) => (
        <div className="">
          {row.balance ? (
            <span>
              {parseValuesToLocale(row.balance, '') + ' ' + row.symbol}
            </span>
          ) : (
            '0.00'
          )}
        </div>
      ),
    },
    {
      name: 'VALUE',
      selector: (row) =>
        row.value
          ? parseValuesToLocale(row.value, CurrencyUSD)
          : parseValuesToLocale(0, CurrencyUSD),
      sortable: false,
      cell: (row) => (
        <div
          //   kind="label/reg"
          //   color="var(--neutral-700)"
          className="d-flex flex-column align-items-start"
        >
          <span>
            {row.value
              ? parseValuesToLocale(row.value, CurrencyUSD)
              : parseValuesToLocale(0, CurrencyUSD)}
          </span>
          <small
            className={`${
              row.prettyDeltaValuePercent === '0.00%'
                ? 'text-primary'
                : row.prettyDeltaValuePercent[0] === '-'
                  ? 'text-danger'
                  : 'text-success'
            }`}
          >
            {row.prettyDeltaValuePercent === '0.00%'
              ? parseValuesToLocale(row.deltaValuePercent, '')
              : (row.prettyDeltaValuePercent[0] === '-' ? '' : '+') +
                parseValuesToLocale(row.deltaValuePercent, '')}
            {row.deltaValue
              ? ' (' + parseValuesToLocale(row.deltaValue, CurrencyUSD) + ')'
              : null}
          </small>
        </div>
      ),
    },
  ];

  return (
    <div className="table-container gmlwXk" style={{ overflow: 'hiden' }}>
      <div className=" ">
        <DataTable
          columns={columns}
          data={loading ? [] : displayItems}
          progressPending={loading}
          //   progressComponent={<AssetsSkeleton />}
          noDataComponent={<h4>No Assets Yet</h4>}
          noHeader
          responsive
          //   striped
          customStyles={{
            rows: {
              style: {
                border: 'none',
                minHeight: '82px',
                // border: '1px solid #6c757d',
              },
            },
            headCells: {
              style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: `${isDarkMode ? '#16161a' : ''}`,
                color: `${isDarkMode ? '#fff' : ''}`,
                // borderBottom: '2px solid #6c757d',
              },
            },
            cells: {
              style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: `${isDarkMode ? '#16161a' : ''}`,
                color: `${isDarkMode ? '#fff' : ''}`,
                border: 'none',
              },
            },
          }}
        />
      </div>
      {isDashboardPage &&
        data?.items?.length > 0 &&
        buttonSeeMore('assets', 'Assets')}
    </div>
  );
};

export default AssetsTable;
