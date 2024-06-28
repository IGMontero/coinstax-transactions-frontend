import React from 'react';
import HistorialTable from './HistorialTable';
import { useParams } from 'react-router-dom';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';

const DashboardTransactions = () => {
  const { address } = useParams();
  const [historyData, setHistoryData] = React.useState([]);

  document.title = 'Transactions | Chain Glance';

  return (
    <div>
      <HistorialTable
        isDashboardPage={false}
        data={historyData}
        setData={setHistoryData}
        address={address}
      />
    </div>
  );
};

export default DashboardTransactions;
