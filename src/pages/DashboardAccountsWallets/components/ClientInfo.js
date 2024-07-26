import React from 'react';
import { Table } from 'reactstrap';
import { formatDateToLocale } from '../../../utils/utils';

const ClientInfo = ({ client }) => {
  return (
    <>
      {/* <Table responsive className="mt-3 border-none">
        <thead>
          <tr>
            <th className="text-start fs-5">Name</th>
            <th className="text-center fs-5">Email</th>
            <th className="text-end fs-5">Last Viewed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-start">{client.Name}</td>
            <td className="text-center">{client.Email}</td>
            <td className="text-end ">
              {formatDateToLocale(client.LastViewedDate)}
            </td>
          </tr>
        </tbody>
      </Table> */}
      {/* // Just render info without a table. */}

      {/* // Client name, email and last viewed date */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <h4>{client.Name}</h4>
          <p className="text-muted">{client.Email}</p>
        </div>
        {/* <p className="text-muted">
          Last viewed: {formatDateToLocale(client.LastViewedDate)}
        </p> */}
      </div>

      {/* <hr /> */}
    </>
  );
};

export default ClientInfo;
