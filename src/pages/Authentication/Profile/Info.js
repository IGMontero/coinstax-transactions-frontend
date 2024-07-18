import React from 'react';
import { Button, Card, CardBody, Table } from 'reactstrap';

const Info = ({ currentUser }) => {
  return (
    <Card className="shadow-none border">
      <CardBody>
        <div className="table-responsive">
          <Table className="table-borderless mb-0">
            <tbody>
              <tr>
                <th className="ps-0" scope="row">
                  Email:
                </th>
                <td className="text-muted">{currentUser?.email || ''}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default Info;
