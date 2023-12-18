import React, { useEffect, useState } from "react";
import { Badge, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import eth from "../../../assets/images/svg/crypto-icons/eth.svg";
const AcitvesTable = ({ data }) => {
  // const address = "0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const formatBalance = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "Invalid Number";
    }
    const hasComma = number > 999;
    const formattedNumber = number.toLocaleString(undefined, {
      minimumFractionDigits: hasComma ? 4 : 0,
      maximumFractionDigits: 4,
    });
    return formattedNumber;
  };

  const formatPriceAndValue = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "Invalid Number";
    }

    const hasComma = number > 999;
    const hasDecimal = number % 1 !== 0;
    const minimumFractionDigits = hasComma ? 2 : hasDecimal ? 2 : 0;

    const formattedNumber = number.toLocaleString(undefined, {
      minimumFractionDigits:
        number === 0 && hasDecimal ? 6 : minimumFractionDigits,
      maximumFractionDigits: 6,
    });

    return formattedNumber;
  };

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
              <b> Wallet </b>${formatBalance(data.total)} US${" "}
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
                {data.items &&
                  data?.items.map((asset, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center fw-medium">
                          <img
                            src={asset.logo}
                            alt=""
                            className="avatar-xxs me-2"
                          />
                          <div className="d-flex flex-column">
                            {asset.name}
                            <div className="d-flex align-items-center">
                              <img
                                src={eth}
                                width={15}
                                height={15}
                                className="me-1"
                              />
                              Ethereum
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {asset.price
                          ? "$" + formatPriceAndValue(asset.price)
                          : "$0.00"}
                      </td>
                      <td>
                        {asset.balance ? (
                          <span>
                            {formatBalance(asset.balance) + " " + asset.symbol}
                          </span>
                        ) : (
                          "0.00"
                        )}
                      </td>
                      <td>
                        {asset.value
                          ? "$" + formatPriceAndValue(asset.value)
                          : "$0.00"}
                      </td>
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
