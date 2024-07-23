import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../../../../Components/constants/layout';
import { useNavigate } from 'react-router-dom';
import EditClientModal from '../../../../Components/Modals/EditClientModal';

const UsersTable = ({ users, loading, onDeleteAddress }) => {
  const { userId } = useSelector((state) => ({
    userId: state.auth.user.id,
  }));

  const navigate = useNavigate();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalEditClient, setModalEditClient] = useState(false);

  const handleOpenModalEditClient = () => {
    setModalEditClient(true);
  };

  const toggleDropdown = (id) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(id);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 955);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    handleOpenModalEditClient();
  };

  const handleDelete = (row) => {
    onDeleteAddress(userId, row.address);
  };

  const handleRowClick = (row) => {
    navigate(`${row.id}`);
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      sortable: false,
      grow: 3,
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>{row.address}</span>
        </div>
      ),
    },
    {
      name: 'Manage',
      cell: (row) => (
        <Dropdown
          isOpen={dropdownOpen === row.id}
          toggle={() => toggleDropdown(row.id)}
        >
          <DropdownToggle
            caret={false}
            className="btn btn-light btn-sm text-muted"
          >
            <i className="ri-more-2-fill"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="d-flex aling-items-center ps-3"
              onClick={() => handleEdit(row.id)}
            >
              {' '}
              <i className="ri-edit-line pe-3"></i> Edit
            </DropdownItem>
            <DropdownItem
              className="d-flex aling-items-center ps-3"
              onClick={() => handleDelete(row)}
            >
              <i className="ri-delete-bin-line  pe-3"></i> Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="table-container">
      <EditClientModal
        isOpen={modalEditClient}
        setIsOpen={setModalEditClient}
        selectedUser={selectedUser}
      />

      <DataTable
        columns={columns}
        data={users}
        noDataComponent={<h4>No Users Yet</h4>}
        noHeader
        responsive
        onRowClicked={handleRowClick}
        customStyles={{
          rows: {
            style: {
              cursor: 'pointer',
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
  );
};
export default UsersTable;
