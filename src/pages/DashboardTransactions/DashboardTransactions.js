import React from 'react';
import HistorialTable from './HistorialTable';
import { useParams } from 'react-router-dom';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';
import Helmet from '../../Components/Helmet/Helmet';

const DashboardTransactions = () => {
  const { address } = useParams();
  const [historyData, setHistoryData] = React.useState([]);


  return (
    <div>
      <Helmet title="Transactions" />
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
