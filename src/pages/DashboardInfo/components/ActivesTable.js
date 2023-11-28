import React, { useMemo } from "react";
import { Badge, Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import { marketStatus } from "../../../common/data";
import { Link } from "react-router-dom";

import { Quantity, AvgPrice, CurrentValue, Returns } from "./ActivesStatus";

const AcitvesTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "ASSETS",
        Cell: (wallet) => (
          <>
            <div className="d-flex align-items-center fw-medium">
              <img
                src={wallet.row.original.img}
                alt=""
                className="avatar-xxs me-2"
              />
              <Link to="#" className="currency_name">
                {wallet.row.original.coinName}
              </Link>
            </div>
          </>
        ),
      },

      {
        Header: "PRICE",
        accessor: "avgPrice",
        filterable: false,
        Cell: (cellProps) => {
          return <AvgPrice {...cellProps} />;
        },
      },
      {
        Header: "BALANCE",
        accessor: "returns",
        filterable: false,
        Cell: (cellProps) => {
          return <Returns {...cellProps} />;
        },
      },
      {
        Header: "VALUE",
        accessor: "value",
        filterable: false,
        Cell: (cellProps) => {
          return <CurrentValue {...cellProps} />;
        },
      },
    ],
    []
  );
  return (
    <React.Fragment>
      <div className="mb-3 px-5">
        <div className="flex-grow-1 d-flex justify-content-between">
          <h2 className="ms-1 mb-3">Actives</h2>
          <div className="d-flex justify-content-between align-items-center ">
            <i class="ri-arrow-down-s-line p-1 py-0 btn btn-soft-primary rounded"></i>

            <Button className="mx-2 btn btn-sm btn-soft-primary  rounded">
              {" "}
              By Platform
            </Button>
            <Button className=" btn btn-sm btn-soft-primary rounded">
              Per Position
            </Button>
          </div>
        </div>
        <div className="border border-2 rounded p-3">
          <div className="d-flex flex-row align-items-center">
            <h4>
              <b> Wallet </b>$6242,15 US${" "}
            </h4>{" "}
            <Badge color="primary" className="mb-2 ms-2">
              {" "}
              80,3%
            </Badge>
          </div>
          <TableContainer
            columns={columns}
            data={marketStatus || []}
            isGlobalFilter={false}
            isAddUserList={false}
            customPageSize={6}
            className="custom-header-css"
            divClass="table-responsive table-card mb-3"
            tableClass="align-middle table-nowrap"
            theadClass="table-light text-muted"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default AcitvesTable;
