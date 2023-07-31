import React from "react";
import { Breadcrumb, Container } from "reactstrap";
import TerritoryGroupsChart from "./TerritoryGroupsChart";
import FileUpload from "../../Components/Common/FileUpload";

const TerritoryMapping = () => {
    const [processed, setProcessed] = React.useState(false);
    document.title = "Territory Mapping | Velzon - React Admin & Dashboard Template";

    const handleGroup = () => {
        setProcessed(true);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Territory Mapping" pageTitle="Dashboard" />

                    <FileUpload acceptedFiles=".csv" title="Upload a File (.csv)" />

                    <div className="mb-4">
                        <label htmlFor="tm-value-input" className="form-label">Input with value</label>
                        <input id="tm-value-input" className="form-control" placeholder="Input value" />


                        <button onClick={handleGroup} className="btn btn-primary mt-3" type="submit">Process Values</button>
                    </div>

                    {processed && (
                        <TerritoryGroupsChart />
                    )
                    }

                </Container>
            </div>
        </React.Fragment>
    );
};

export default TerritoryMapping;
