import { CardBody, Col, Collapse, Row } from "reactstrap";
import BlockChainActionColumn from "./HistorialComponents/components/Columns/BlockChainActionColumn";
import SentColumn from "./HistorialComponents/components/Columns/SentColumn";
import ApprovalColumn from "./HistorialComponents/components/Columns/ApprovalColumn";
import ReceivedColumn from "./HistorialComponents/components/Columns/ReceivedColumn";
import ContractInfoColumn from "./HistorialComponents/components/Columns/ContractInfoColumn";
import ListTransactions from "./HistorialComponents/components/List/ListTransactions";
import InformationLedger from "./HistorialComponents/components/InformationLedger";
import { blockchainActions } from "../../utils/utils";
import { useEffect } from "react";

const TransactionItem = ({ transaction, index,
    toggleCollapse,
    openCollapse,
    setTransactions,
    copiedIndex,
    handleCopy,
}) => {


    useEffect(() => {
        // If transaction is in preview for more than 3 minutes, set it as not preview.
        if (transaction.preview) {
            setTimeout(() => {
                setTransactions((prev) =>
                    prev.map((tx) => {
                        if (tx.txHash === transaction.txHash) {
                            return { ...tx, preview: false };
                        }
                        return tx;
                    })
                );
            }, 1000 * 60);
        }
    }, [transaction]);

    const sentTxSummary = transaction.txSummary?.sent;

    const hasList =
        transaction.txSummary?.receivedAssetsCount > 1 ||
        transaction.txSummary?.sentAssetsCount > 1;

    const isApproval =
        transaction.txSummary?.approval && blockchainActions.APPROVE;
    const collapseId = transaction.txHash;

    return (
        <div key={transaction.txHash} className="align-items-center">
            <div
                className={` border-bottom bg-transparent px-0 ${openCollapse.has(collapseId)
                    ? 'border border-primary rounded px-2 mb-2'
                    : 'bg-light'
                    }`}
                style={{
                    transition: `all 0.3s ease-in-out`,
                }}
            >
                <Row
                    className={`align-items-center justify-content-between col-12`}
                    onClick={() => toggleCollapse(collapseId)}
                    style={{
                        cursor: 'pointer',
                        padding: '.7rem',
                        paddingRight: '1rem',
                    }}
                >
                    {/* BLOCKCHAIN ACTION && VALUE COLUMN */}
                    <Col
                        lg={4}
                        md={12}
                        sm={12}
                        xs={12}
                        className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                    >
                        <BlockChainActionColumn transaction={transaction} />
                    </Col>
                    {/* NEGATIVE LEDGERS  || SENT TXSUMMARY */}
                    <Col
                        lg={sentTxSummary ? 3 : 0}
                        md={sentTxSummary ? 6 : 0}
                        sm={sentTxSummary ? 6 : 0}
                        xs={sentTxSummary ? 6 : 0}
                        className={`mb-lg-0 mb-3  p-0 ${sentTxSummary
                            ? 'd-flex justify-content-start ps-1 '
                            : 'd-none'
                            }`}
                    >
                        <SentColumn transaction={transaction} />
                    </Col>
                    {/* POSITIVE LEDGERS || RECEIVED TXSUMMARY  */}
                    <Col
                        lg={sentTxSummary ? 3 : 6}
                        md={sentTxSummary ? 6 : 6}
                        sm={sentTxSummary ? 6 : 12}
                        xs={sentTxSummary ? 6 : 12}
                        className={`d-flex justify-content-start ${sentTxSummary ? '' : 'ps-1'} d-flex  mb-lg-0 mb-3`}
                    >
                        {isApproval ? (
                            <ApprovalColumn transaction={transaction} />
                        ) : (
                            <ReceivedColumn
                                isApproval={isApproval}
                                transaction={transaction}
                                negativeLedgers={sentTxSummary}
                            />
                        )}
                    </Col>
                    <Col
                        lg={2}
                        md={12}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-end  align-items-center  pb-lg-0 pb-3"
                    >
                        {transaction.blockchainAction === blockchainActions.BURN ||
                            transaction.blockchainAction === blockchainActions.MINT ||
                            transaction.blockchainAction ===
                            blockchainActions.OTHER ? null : (
                            <ContractInfoColumn
                                transaction={transaction}
                                setTransactions={setTransactions}
                            />
                        )}
                    </Col>
                </Row>
                <Collapse isOpen={openCollapse.has(collapseId)}>
                    <CardBody
                        onClick={() => toggleCollapse(collapseId)}
                        className={`cursor-pointer ${openCollapse === index ? 'border-info' : ''
                            }`}
                    >
                        {/* CODE FOR LIST */}
                        {hasList && <ListTransactions transaction={transaction} />}

                        {/* HASH AND FEE  */}
                        <InformationLedger
                            transaction={transaction}
                            onCopy={handleCopy}
                            collapseId={collapseId}
                            copiedIndex={copiedIndex}
                        />
                    </CardBody>
                </Collapse>
            </div>
        </div>
    );
}


export default TransactionItem;