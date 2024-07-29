import React from 'react';
import { Table } from 'reactstrap';
import { formatDateToLocale } from '../../../utils/utils';

const ClientInfo = ({ client }) => {
  return (
    <>
      <Table responsive className="mt-3 border-none">
        <thead>
          <tr>
            <th className="text-start fs-5">Email</th>
            <th className="text-center fs-5">Name</th>
            <th className="text-end fs-5">Last Viewed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-start">{client?.Email}</td>
            <td className="text-center">{client?.Name}</td>
            <td className="text-end ">
              {formatDateToLocale(client?.LastViewedDate)}
            </td>
          </tr>
        </tbody>
      </Table>
      {/* <hr /> */}
    </>
  );
};

export default ClientInfo;
