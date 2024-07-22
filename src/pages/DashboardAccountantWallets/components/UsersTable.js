import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../../../Components/constants/layout';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ users }) => {
  const navigate = useNavigate();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);

  const [dropdownOpen, setDropdownOpen] = useState(null);

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

  const handleEdit = (userId) => {
    // Handle edit user logic here
    console.log('Edit user', userId);
  };

  const handleDelete = (userId) => {
    // Handle delete user logic here
    console.log('Delete user', userId);
  };

  const handleRowClick = (row) => {
    navigate(`/${row.id}`);
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      sortable: true,
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
              onClick={() => handleDelete(row.id)}
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
