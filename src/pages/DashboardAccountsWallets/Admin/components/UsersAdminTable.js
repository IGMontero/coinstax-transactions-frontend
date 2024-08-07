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
import DropdownMenuPortal from '../../../../Components/Dropdowns/DropdownPortal';
import { formatDateToLocale } from '../../../../utils/utils';
import TablePagination from '../../../../Components/Pagination/TablePagination';
import { DASHBOARD_USER_ROLES } from '../../../../common/constants';

const UserAdminTable = ({ users, loading, onRefresh, pagination }) => {
  const navigate = useNavigate();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
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
    // {
    //   name: 'Name',
    //   selector: (row) => row.Name || row.name,
    //   sortable: false,
    //   grow: 2,
    // },
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
      name: 'Last Date Logged In',
      selector: (row) =>
        row.lastLogin ? formatDateToLocale(row.lastLogin) : null,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Manage',
      cell: (row) => (
        <Dropdown
          isOpen={dropdownOpen === row.Id}
          toggle={() => toggleDropdown(row.Id)}
        >
          <DropdownToggle
            caret={false}
            className="btn btn-light btn-sm text-muted"
          >
            <i className="ri-more-2-fill"></i>
          </DropdownToggle>
          <DropdownMenuPortal>
            <DropdownMenu>
              <DropdownItem
                className="d-flex aling-items-center ps-3"
                onClick={() => handleRowClick(row)}
              >
                <i className="ri-eye-fill pe-3"></i> View
              </DropdownItem>
              <DropdownItem
                className="d-flex aling-items-center ps-3"
                onClick={() => handleEdit(row.Id)}
              >
                {' '}
                <i className="ri-edit-line pe-3"></i> Edit
              </DropdownItem>
              {/* <DropdownItem
                className="d-flex aling-items-center ps-3"
                onClick={() => handleDelete(row)}
              >
                <i className="ri-delete-bin-line  pe-3"></i> Delete
              </DropdownItem> */}
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
            noDataComponent={<h4>Add a client to get started</h4>}
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
