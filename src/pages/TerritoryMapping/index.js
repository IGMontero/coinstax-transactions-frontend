import React from "react";
import { Breadcrumb, Container } from "reactstrap";
import TerritoryGroupsChart from "./TerritoryGroupsChart";
import FileUpload from "../../Components/Common/FileUpload";
import Papa from "papaparse";

const TerritoryMapping = () => {
    document.title = "Territory Mapping | Velzon - React Admin & Dashboard Template";

    const [inputValue, setInputValue] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState(null);

    const [processResult, setProcessResult] = React.useState();

    const handleGroup = () => {
        if (!selectedFile) {
            alert("Please select a CSV file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const csvData = event.target.result;
            const parsedData = Papa.parse(csvData, { header: true }).data;
            const result = divideStatesIntoGroups(parsedData, inputValue);

            setProcessResult(result);
        };

        reader.readAsText(selectedFile);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container>
                    <Breadcrumb title="Territory Mapping" pageTitle="Dashboard" />

                    <FileUpload onSelectFile={file => setSelectedFile(file)} acceptedFiles=".csv" title="Upload a File (.csv)" />

                    <div className="mb-4">
                        <label htmlFor="tm-value-input" className="form-label">Input with value</label>
                        <input value={inputValue}
                            required
                            onChange={(evt) => setInputValue(evt.target.value)}
                            type="number"
                            id="tm-value-input" className="form-control" placeholder="Input value" />


                        <button disabled={!selectedFile || !inputValue} onClick={handleGroup} className="btn btn-primary mt-3" type="submit">Process Values</button>
                    </div>

                    {processResult && (
                        <TerritoryGroupsChart
                            data={processResult}
                        />
                    )
                    }

                </Container>
            </div>
        </React.Fragment>
    );
};

export default TerritoryMapping;



// Other snippets

function divideStatesIntoGroups(statesData, n) {
    // Array of n colors to be used in the chart
    const colors = [
        "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"
    ];

    const states = statesData.map((row) => row["State"]);
    const leads = statesData.map((row) => parseInt(row["Leads"]));

    const totalLeads = leads.reduce((acc, val) => acc + val, 0);
    const targetSum = Math.floor(totalLeads / n);

    const sortedStates = statesData.slice().sort((a, b) => parseInt(b["Leads"]) - parseInt(a["Leads"]));

    const groups = Array.from({ length: n }, () => []);
    const sums = Array.from({ length: n }, () => 0);

    for (const stateData of sortedStates) {
        const state = stateData["State"];
        const leadsInState = parseInt(stateData["Leads"]);
        const minSumIndex = sums.indexOf(Math.min(...sums));

        groups[minSumIndex].push({ state, leads: leadsInState });
        sums[minSumIndex] += leadsInState;
    }

    const result = groups.map((group, index) => {
        const percentage = (sums[index] / totalLeads) * 100;
        return {
            groupNumber: index + 1,
            states: group.map((stateData) => stateData.state),
            sumOfLeads: sums[index],
            percentage: percentage.toFixed(2),
            color: colors[index % colors.length],
        };
    });

    // Sort result by perc
    result.sort((a, b) => b.percentage - a.percentage);

    return result;
}

function handleFile() {
    const fileInput = document.getElementById("csvFile");

    if (fileInput.files.length === 0) {
        alert("Please select a CSV file.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;
        const parsedData = Papa.parse(csvData, { header: true }).data;
        const result = divideStatesIntoGroups(parsedData);
        document.getElementById("result").innerText = result;
    };

    reader.readAsText(file);
}