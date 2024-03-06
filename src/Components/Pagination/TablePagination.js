import React from 'react';
import { Button } from 'reactstrap';

const TablePagination = ({ onChangePage, currentPage, totalPages }) => {
  const handleChangePage = (page) => {
    onChangePage(page);
  };

  console.log(totalPages);

  return (
    <tr>
      <td colSpan="12">
        <div className="d-flex  pt-3 mb-n2 justify-content-end align-items-center">
          {/* <span className="text-muted">
            Showing <span className="font-weight-bold">{itemsCount}</span> of{" "}
            <span className="font-weight-bold">{totalItems}</span> entries
          </span> */}
          <div className="d-flex align-items-center jusitfy-content-end">
            {currentPage !== 0 && (
              <Button
                onClick={() => handleChangePage(currentPage - 1)}
                color="soft-primary"
                className="btn btn-sm btn-pills "
                disabled={currentPage === 0}
              >
                <i className="ri-arrow-left-line"></i>
              </Button>
            )}
            <span className="mx-2">
              Page {currentPage + 1} of {isNaN(totalPages) ? 1 : totalPages}
            </span>
            {currentPage !== totalPages - 1 ||
              (isNaN(totalPages) && (
                <Button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handleChangePage(currentPage + 1)}
                  color="soft-primary"
                  className="btn btn-sm btn-pills me-1"
                >
                  <i className="ri-arrow-right-line"></i>
                </Button>
              ))}

            {/* <Button
              disabled={currentPage === totalPages - 1}
              onClick={() => handleChangePage(currentPage + 1)}
              color="primary"
              className="btn btn-sm btn-pills me-1"
            >
              <i className="ri-arrow-right-line"></i>
            </Button> */}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TablePagination;
