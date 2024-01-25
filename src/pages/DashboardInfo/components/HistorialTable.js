import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import { useDispatch } from "react-redux";
import {
  fetchHistory,
  fetchSearchHistoryTable,
  fetchTransactionsFilter,
} from "../../../slices/transactions/thunk";
import RenderTransactions from "./HistorialComponents/RenderTransactions";

const HistorialTable = ({ address, activeTab }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [showTransactionFilterMenu, setShowTransactionFilterMenu] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAssetsMenu, setShowAssetsMenu] = useState(false);

  const [hasMoreData, setHasMoreData] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [groupedTransactions, setGroupedTransactions] = useState({});

  const [selectedFilters, setSelectedFilters] = useState({
    Trade: false,
    Mint: false,
    Send: false,
    Receive: false,
    Others: false,
  });

  const [selectedAssets, setSelectedAssets] = useState({
    "All Assets": true,
    Tokens: false,
    NFTs: false,
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const fetchData = async () => {
    try {
      setIsInitialLoad(true);
      setLoading(true);
      const response = await dispatch(
        fetchHistory({ address, count: 10, page: 0 })
      ).unwrap();
      setData(response);

      if (response.length === 0) {
        setHasMoreData(false);
      }
      setLoading(false);
      setIsInitialLoad(false);
    } catch (error) {
      setLoading(true);
      console.error("Error fetching performance data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab == "3") {
      fetchData();
      setCurrentPage(0);
      setHasMoreData(true);
    }
  }, [address, activeTab, dispatch]);

  useEffect(() => {
    const groupByDate = (transactions) => {
      if (!Array.isArray(transactions)) {
        console.error(
          "Expected an array of transactions, received:",
          transactions
        );
        return {};
      }
      return transactions.reduce((acc, transaction) => {
        const date = formatDate(transaction.date);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {});
    };

    if (data) {
      setGroupedTransactions(groupByDate(data));
    }
  }, [data]);

  const getMoreTransactions = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await dispatch(
        fetchHistory({ address, count: 10, page: nextPage })
      ).unwrap();

      console.log(response);
      setData((prevData) => [...prevData, ...response]);
      if (response.length === 0) {
        setHasMoreData(false);
      }
      setCurrentPage(nextPage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAssetsMenu = (e) => {
    setShowAssetsMenu(!showAssetsMenu);
  };

  const handleAssetChange = (asset) => {
    setSelectedAssets((prevAssets) => {
      const resetAssets = Object.keys(prevAssets).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      return { ...resetAssets, [asset]: true };
    });
  };

  const handleShowTransactionFilterMenu = (e) => {
    setShowTransactionFilterMenu(!showTransactionFilterMenu);
  };

  const handleTransactionFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (value) => value
  );

  const handleDeselectFilter = async (filter) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: false,
    }));

    await dispatch(fetchHistory({ address, count: 10, page: 0 }));
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 65) {
      setIsInitialLoad(true);
      setLoading(true);
      try {
        const response = await dispatch(
          fetchSearchHistoryTable({ address, query: e.target.value })
        ).unwrap();

        setData(response);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsInitialLoad(false);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await dispatch(fetchHistory({ address, count: 10, page: 0 })).unwrap();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    // dispatch(fetchHistory({ address, count: 10, page: 0 }));
  };
  const handleApplyFilters = async () => {
    const isAnyFilterActive = Object.values(selectedFilters).some(
      (value) => value
    );
    setLoading(true);

    // if (isAnyFilterActive) {
    //   try {
    //     const response = await dispatch(
    //       fetchTransactionsFilter({
    //         address,
    //         filters: selectedFilters,
    //       })
    //     ).unwrap();
    //     setData(response);
    //   } catch (error) {
    //     console.error("Error fetching filtered transactions:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // } else {
    //   await dispatch(fetchHistory({ address, count: 10, page: 0 }));
    // }
    setLoading(false);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      Trade: false,
      Mint: false,
      Send: false,
      Receive: false,
      Others: false,
    });

    // dispatch(fetchHistory({ address, count: 10, page: 0 }));
  };

  const renderBadges = () => {
    return Object.entries(selectedFilters)
      .filter(([filter, isSelected]) => isSelected)
      .map(([filter]) => (
        <Badge key={filter} color="soft-dark" className="p-2 my-2 me-2">
          <span className="fs-6 d-flex align-items-center fw-semibold">
            {filter}
            <button
              onClick={() => handleDeselectFilter(filter)}
              className="bg-transparent p-0 border-0 text-dark ms-2 fs-5"
            >
              <i className="ri-close-line"></i>
            </button>
          </span>
        </Badge>
      ));
  };

  return (
    <React.Fragment>
      <Row>
        <Col className="d-flex">
          <Dropdown
            isOpen={showTransactionFilterMenu}
            toggle={handleShowTransactionFilterMenu}
            className=""
          >
            <DropdownToggle
              tag="a"
              className={`btn btn-sm p-1 btn-soft-primary d-flex align-items-center ${
                showTransactionFilterMenu ? "active" : ""
              }`}
              role="button"
            >
              <span className="fs-6">Transactions</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-1">
              {Object.keys(selectedFilters).map((filter) => (
                <DropdownItem
                  key={filter}
                  className={`d-flex align-items-center justify-content-between w-100`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTransactionFilterChange(filter);
                    handleApplyFilters();
                  }}
                >
                  <label className="w-100 py-1 d-flex align-items-center justify-content-start m-0 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      checked={!!selectedFilters[filter]}
                      onClick={handleApplyFilters}
                      onChange={() => handleTransactionFilterChange(filter)}
                    />
                    {filter}
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown
            isOpen={showAssetsMenu}
            toggle={handleShowAssetsMenu}
            className=""
          >
            <DropdownToggle
              tag="a"
              className={`btn btn-sm p-1 btn-soft-primary d-flex align-items-center ms-2 ${
                showAssetsMenu ? "active" : ""
              }`}
              role="button"
            >
              <span className="fs-6">Assets</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-1">
              {Object.keys(selectedAssets).map((asset) => (
                <DropdownItem
                  key={asset}
                  className="d-flex align-items-center justify-content-between w-100"
                  onClick={() => handleAssetChange(asset)}
                >
                  <label className="w-100 py-1 d-flex align-items-center justify-content-start m-0 cursor-pointer">
                    {asset}
                    {selectedAssets[asset] ? (
                      <i className="ri-check-line fs-5 ms-4"></i>
                    ) : (
                      ""
                    )}
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
      <Col className="col-12">
        {renderBadges()}
        {hasActiveFilters && (
          <span
            className="text-primary ms-2 cursor-pointer "
            onClick={handleResetFilters}
          >
            <span className="text-hover-dark">Reset</span>
          </span>
        )}
      </Col>
      <Row className="mt-4">
        <Col lg={6} md={8} sm={10} xs={12}>
          <InputGroup className="py-3 search-bar col-lg-12 col-md-12 pe-3">
            <span
              className="search-icon ps-3 position-absolute"
              onClick={() => inputRef.current.focus()}
              style={{ zIndex: 1, cursor: "text" }}
            >
              <i className="ri-search-line text-muted fs-3"></i>
            </span>
            <Input
              innerRef={inputRef}
              className="search-input py-2 rounded"
              style={{
                zIndex: 0,
                paddingLeft: "47px",
                paddingRight: "30px",
              }}
              placeholder="Filter by Address, Protocol, Assets, Type"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Button
                color="link"
                className="btn-close position-absolute btn btn-sm  border-0"
                style={{
                  right: "25px",
                  top: "25px",
                  zIndex: 2,
                }}
                onClick={handleClearSearch}
              />
            )}
          </InputGroup>
        </Col>
        <Col
          lg={6}
          md={4}
          sm={2}
          xs={12}
          className="d-flex btn btn-sm py-3 justify-content-end"
        >
          <Button color="primary" size="sm">
            Download CSV
          </Button>
        </Col>
      </Row>
      <Col lg={12} className="position-relative" style={{ minHeight: "50vh" }}>
        {loading && isInitialLoad && (
          <div
            className="position-absolute d-flex justify-content-center align-items-center bg-transparent"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(5px)",
              zIndex: 2,
            }}
          >
            <Spinner style={{ width: "3rem", height: "3rem" }} />
          </div>
        )}

        <div className="">
          {groupedTransactions &&
            Object.keys(groupedTransactions).map((date, index) => (
              <RenderTransactions
                date={date}
                transactions={groupedTransactions[date]}
              />
            ))}
        </div>
      </Col>
      {!isInitialLoad && hasMoreData && (
        <div className="d-flex justify-content-center mt-2">
          <Button
            disabled={loading}
            onClick={getMoreTransactions}
            color="soft-light"
            style={{ borderRadius: "10px", border: ".5px solid grey" }}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <h6 className="text-dark fw-semibold my-2">More transactions</h6>
            )}
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
