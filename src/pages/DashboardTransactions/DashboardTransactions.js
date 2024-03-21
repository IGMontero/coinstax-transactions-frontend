import React from 'react';
import HistorialTable from '../DashboardInfo/components/HistorialTable';
import { useParams } from 'react-router-dom';

const DashboardTransactions = () => {
  const { address } = useParams();
  console.log(address);
  const [historyData, setHistoryData] = React.useState([]);

  return (
    <div className="page-content mt-5">
      <HistorialTable
        data={historyData}
        setData={setHistoryData}
        address={address}
      />
    </div>
  );
};

export default DashboardTransactions;
