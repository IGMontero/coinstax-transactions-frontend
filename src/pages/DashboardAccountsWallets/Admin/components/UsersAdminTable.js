import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
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
import { formatDateToLocale } from '../../../../utils/utils';
import TablePagination from '../../../../Components/Pagination/TablePagination';
import DropdownMenuPortal from '../../../../Components/Dropdowns/DropdownPortal';

const UserAdminTable = ({ users, loading, onRefresh, pagination }) => {
  const navigate = useNavigate();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalEditClient, setModalEditClient] = useState(false);

  const handleOpenModalEditClient = () => {
    setModalEditClient(true);
  };

  const toggleDropdown = (id) => {
    if (dropdownOpenId === id) {
      setDropdownOpenId(null);
    } else {
      setDropdownOpenId(id);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 955);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEdit = (id) => {
    const user = users.find((user) => user.Id === id);
    setSelectedUser(user);
    handleOpenModalEditClient();
  };

  const handleRowClick = (row) => {
    if (row.role === 'user') {
      navigate(`/admin/users/${row.id}`);
    } else if (row.role === 'accountant') {
      navigate(`/admin/accountants/${row.id}`);
    }
  };

  const columns = [
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Account Type',
      selector: (row) => row.role,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Last Login Date',
      selector: (row) =>
        row.lastLogin ? formatDateToLocale(row.lastLogin) : null,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Manage',
      cell: (row) => (
        <Dropdown
          isOpen={dropdownOpenId === row.id}
          toggle={() => toggleDropdown(row.id)}
        >
          <DropdownToggle
            caret={false}
            className="btn btn-light btn-sm text-muted"
          >
            <i className="ri-more-2-fill"></i>
          </DropdownToggle>
          <DropdownMenuPortal>
            <DropdownMenu right>
              <DropdownItem
                className="d-flex align-items-center ps-3"
                onClick={() => handleRowClick(row)}
              >
                <i className="ri-eye-fill pe-3"></i> View
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center ps-3"
                onClick={() => handleEdit(row.Id)}
              >
                <i className="ri-edit-line pe-3"></i> Edit
              </DropdownItem>
            </DropdownMenu>
          </DropdownMenuPortal>
        </Dropdown>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="table-container">
        <EditClientModal
          isOpen={modalEditClient}
          setIsOpen={setModalEditClient}
          selectedUser={selectedUser}
          onRefresh={onRefresh}
        />
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner color="primary" />{' '}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            noDataComponent={<h4>No users found</h4>}
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
        )}
      </div>
      {users?.length > 0 && !loading ? (
        <TablePagination
          onChangePage={pagination.handleChangePage}
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
        />
      ) : null}
    </>
  );
};

export default UserAdminTable;
