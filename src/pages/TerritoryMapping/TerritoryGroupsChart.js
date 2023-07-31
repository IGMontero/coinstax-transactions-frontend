import React from 'react';
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { GroupsChart } from './TerritoryMappingCharts';

const TerritoryGroupsChart = (props) => {
    const { data } = props;

    const [chartData, setChartData] = React.useState([15, 30, 25, 30]);

    const percentages = data.map(d =>
        parseFloat(d.percentage)
    );

    const labels = data.map(d =>
        `Group ${d.groupNumber}`
    );

    const colors = data.map(d =>
        d.color
    );

    // useEffect(() => {
    //     setChartData(portfolioData);
    // }, [portfolioData]);

    return (
        <React.Fragment>
            <Col xl={4}>
                <Card className="card-height-100">
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Grouped Territories</h4>
                        {/* <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown" direction='start'>
                                <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                    <span className="text-muted">Report<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem>Download Report</DropdownItem>
                                    <DropdownItem>Export</DropdownItem>
                                    <DropdownItem>Import</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div> */}
                    </CardHeader>

                    <div className="card-body">
                        <div dir="ltr">
                            <GroupsChart labels={labels} series={percentages} colors={colors} dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                        </div>
                        <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">

                            {/* Map throguh all groups and show data like the example above. */}
                            {data.map((group, index) => (
                                <li className="list-group-item px-0" key={index}>
                                    <div className="d-flex">
                                        {/* <div className="flex-shrink-0 avatar-xs">
                                            <span className="avatar-title bg-light p-1 rounded-circle">
                                                <img className="img-fluid" alt="" />
                                            </span>

                                        </div> */}
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1">Group {group.groupNumber}</h6>
                                            <p className="fs-12 mb-0 text-muted">
                                                <i className="mdi mdi-circle 
                                            fs-10 align-middle me-1"
                                                    style={{
                                                        color: group.color,
                                                    }}
                                                ></i>{group.states.join(", ")}</p>
                                        </div>
                                        <div className="flex-shrink-0 text-end">
                                            <h6 className="mb-1">{group.sumOfLeads} Leads</h6>
                                            <p className="text-success fs-12 mb-0">{group.percentage}%</p>
                                        </div>
                                    </div>
                                </li>
                            )
                            )}

                        </ul>
                    </div>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TerritoryGroupsChart;