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
import { useSelector } from 'react-redux';
import { addressSummary } from '../../../slices/addresses/reducer';

const AssetsTable = ({
  loading,
  displayItems,
  isDashboardPage,
  data,
  buttonSeeMore,
  viewMode,
}) => {
  // Values from Redux for the blockchains
  const addressInfo = useSelector(addressSummary);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);

  const addressTotalValue = addressInfo?.blockchains?.all?.totalValue || 0;
  const isLoadingAddressSummary = !addressInfo?.complete;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 955);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = [
    {
      name: 'ASSETS',
      selector: (row) => {
        // Calculate per position percent based on address total value. If it's laoding, show like it's loading the percent, or show the item percent.
        const perPositionPercent = isLoadingAddressSummary
          ? row.percentage
          : (row.value / addressTotalValue) * 100;

        const finalPerPositionPercent =
          perPositionPercent < 0.01 ? '<0.01' : perPositionPercent.toFixed(2);

        return (
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
                  textNode.textContent = row.name
                    ?.substring(0, 3)
                    .toUpperCase();
                  textNode.className = 'img-assets-placeholder avatar-xs me-2';

                  const container = e.target.parentNode;
                  container.insertBefore(textNode, container.firstChild);
                }
              }}
            />
            <div className="d-flex flex-column">
              <div
                style={{ height: '18px' }}
                className="d-flex flex-row align-items-center"
              >
                {row.name}{' '}
                {viewMode === 'perPosition' && (
                  <Badge
                    color="soft-light"
                    style={{ fontWeight: 'inherit' }}
                    className="mx-2 p-1 fs-7"
                  >
                    <span className="text-dark">
                      {isLoadingAddressSummary ? (
                        '...'
                      ) : (
                        <>{finalPerPositionPercent}%</>
                      )}
                    </span>
                  </Badge>
                )}
              </div>
              <div className="d-flex align-items-center mt-1 text-muted">
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
        );
      },
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
      cell: (row) => {
        return (
          <div className="value-cell flex-column d-flex">
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
        );
      },
      grow: 1,
    },
  ];

  return (
    <div className="table-container gmlwXk" style={{ overflow: 'hiden' }}>
      <div className=" ">
        <DataTable
          columns={columns}
          data={loading ? [] : displayItems}
          progressPending={loading}
          noDataComponent={<h4>No Assets Yet</h4>}
          noHeader
          responsive
          customStyles={{
            rows: {
              style: {
                border: 'none',
                minHeight: '82px',
              },
            },
            headCells: {
              style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: `${isDarkMode ? '#16161a' : ''}`,
                color: `${isDarkMode ? '#fff' : ''}`,
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
            noData: {
              style: {
                backgroundColor: `${isDarkMode ? '#16161a' : ''}`,
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
