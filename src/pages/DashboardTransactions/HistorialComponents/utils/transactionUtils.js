export const composeTransactionNftUrl = ({
    contractAddress,
    tokenId,
    blockchain,
}) =>
    `/contract/${contractAddress}?blockchain=${blockchain}&tokenId=${tokenId}`;
