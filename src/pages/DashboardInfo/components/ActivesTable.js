import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { fetchAssets } from "../../../slices/transactions/thunk";
import { useDispatch } from "react-redux";

const AcitvesTable = ({ address }) => {
  const dispatch = useDispatch();
  // const address = "0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6";

  const [assetsData, setAssetsData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setLoading(true);
      dispatch(fetchAssets(address))
        .unwrap()
        .then((response) => {
          const transformedData = response.map((asset) => ({
            logo: asset.logo_url,
            name: asset.contract_name,
            price: asset.quote_rate,
            balance: (asset.balance / 10) ^ asset.contract_decimals,
            value: asset.pretty_quote,
          }));
          setAssetsData(transformedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching performance data:", error);
          setLoading(false);
        });
    }
  }, [dispatch, address]);

  return (
    <React.Fragment>
      <div className="mb-3">
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

          <table className="table table-borderless ">
            <thead>
              <tr className="text-muted">
                <th scope="col">ASSETS</th>
                <th scope="col">PRICE</th>
                <th scope="col">BALANCE</th>
                <th scope="col">VALUE</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center">
                    <Spinner
                      style={{ width: "4rem", height: "4rem" }}
                      className="mt-5"
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {assetsData &&
                  assetsData.map((asset, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center fw-medium">
                          <img
                            src={asset.logo}
                            alt=""
                            className="avatar-xxs me-2"
                          />
                          <Link to="#" className="currency_name">
                            {asset.name}
                          </Link>
                        </div>
                      </td>
                      <td>{asset.price ? "$" + asset.price : "$0.00"}</td>
                      <td>{asset.balance ? asset.balance : "0.00"}</td>
                      <td>{asset.value ? asset.value : "$0.00"}</td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AcitvesTable;
