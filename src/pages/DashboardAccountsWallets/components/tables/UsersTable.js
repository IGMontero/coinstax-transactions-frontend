import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ReactDOM from 'react-dom';
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
import DropdownMenuPortal from '../../../../Components/Dropdowns/DropdownPortal';
import { formatDateToLocale } from '../../../../utils/utils';
import TablePagination from '../../../../Components/Pagination/TablePagination';
import { DASHBOARD_USER_ROLES } from '../../../../common/constants';

const UsersTable = ({ users, loading, onDelete, onRefresh, pagination }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentUserRole = user?.role;
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

  const handleDelete = (row) => {
    onDelete(row.Id);
  };

  const handleRowClick = (row) => {
    if (currentUserRole === DASHBOARD_USER_ROLES.ADMIN) {
      navigate(`/admin/clients/${row.id}`);
    } else {
      navigate(`${row.Id || row.id}`);
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.Name || row.name,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row) => row.Email || row.email,
      sortable: false,
      grow: 2,
    },
    // Account Type, Last Date Viewed,
    // {
    //   name: 'Address',
    //   selector: (row) => row.address,
    //   sortable: false,
    //   grow: 3,
    //   cell: (row) => (
    //     <div className="d-flex flex-column">
    //       <span>{row.address}</span>
    //     </div>
    //   ),
    // },
    {
      name: 'Account Type',
      selector: (row) => row.AccountType || row.accountType,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Last Date Viewed',
      selector: (row) =>
        row.LastViewedDate || row.lastViewedDate
          ? formatDateToLocale(row.LastViewedDate) ||
            formatDateToLocale(row.lastViewedDate)
          : null,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Manage',
      cell: (row) => (
        <Dropdown
          isOpen={dropdownOpen === row.id || row.Id}
          toggle={() => toggleDropdown(row.id || row.Id)}
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
              <DropdownItem
                className="d-flex aling-items-center ps-3"
                onClick={() => handleDelete(row)}
              >
                <i className="ri-delete-bin-line  pe-3"></i> Delete
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
    <div className="table-container">
      <EditClientModal
        isOpen={modalEditClient}
        setIsOpen={setModalEditClient}
        selectedUser={selectedUser}
        onRefresh={onRefresh}
      />
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        noDataComponent={<h4>No clients found</h4>}
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
      {users?.length > 0 && (
        <TablePagination
          onChangePage={pagination.handleChangePage}
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
        />
      )}
    </div>
  );
};
export default UsersTable;
