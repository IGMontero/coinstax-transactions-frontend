import React, { useEffect, useState } from 'react';
import { Button, Input, Spinner, Table } from 'reactstrap';
import { fetchBlockchainContracts } from '../../slices/blockchainContracts/thunk';
import { useDispatch } from 'react-redux';
import { formatIdTransaction } from '../../utils/utils';

const DashboardBlockchainContracts = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  const getBlockchainContracts = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchBlockchainContracts({
          blockchain: 'ethereum',
          page: currentPage,
          address: debouncedSearch,
        }),
      );
      console.log(response);
      setContracts(response.payload);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blockchain contracts', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlockchainContracts();
  }, [currentPage, debouncedSearch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="mb-5 mt-2 d-flex justify-content-center align-items-center">
          <Input
            type="text"
            placeholder="Search"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table hover shadow responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Blockchain</th>
              <th>Address</th>
              <th>Type</th>
              <th>Name</th>
              <th>Logo</th>
              <th>Symbol</th>
              <th>Trusted State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr style={{ height: '100vh' }}>
                <td colSpan="9" className="text-center">
                  <Spinner style={{ width: '3rem', height: '3rem' }} />
                </td>
              </tr>
            ) : contracts !== null ? (
              contracts.map((contract) => (
                <tr key={contract.Id}>
                  <td className="align-middle">{contract.Id}</td>
                  <td className="align-middle">{contract.Blockchain}</td>
                  <td className="align-middle">
                    {formatIdTransaction(contract.Address, 4, 4)}
                  </td>
                  <td className="align-middle">{contract.Type}</td>
                  <td className="align-middle">
                    {formatIdTransaction(contract.Name, 4, 4)}
                  </td>
                  <td className="align-middle">
                    <img
                      src={contract.Logo || contract.Blockchain}
                      alt={contract.Logo}
                      className="ps-0 rounded"
                      width={35}
                      height={35}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const container = e.target.parentNode;
                        const textNode = document.createElement('div');
                        textNode.textContent = contract.Blockchain;
                        textNode.className = 'currency-placeholder';
                        container.appendChild(textNode);
                      }}
                    />
                  </td>
                  <td className="align-middle">{contract.Symbol}</td>
                  <td className="align-middle">{contract.TrustedState}</td>
                  <td className="align-middle">
                    <i className="ri-pencil-line text-primary cursor-pointer border rounded border-light p-2"></i>
                    <i className="ri-delete-bin-line text-danger cursor-pointer border rounded border-light p-2 ms-2"></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  <h4>No contracts found</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};

export default DashboardBlockchainContracts;
