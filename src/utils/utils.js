export const getActionMapping = (action) => {
  switch (action) {
    case "RECEIVE":
      return { color: "success", icon: " ri-arrow-down-line fs-3" };
    case "SEND":
      return { color: "dark", icon: "ri-arrow-up-line fs-3" };
    case "APPROVE":
      return { color: "dark", icon: "ri-lock-unlock-line fs-3" };
    case "DESPOSIT":
      return { color: "dark", icon: "ri-download-2-line fs-3" };
    case "TRADE":
      return { color: "dark", icon: "ri-arrow-left-right-line fs-3" };
    case "WITHDRAW":
      return { color: "dark", icon: "ri-upload-2-line fs-3" };
    case "EXECUTE":
      return { color: "warning", icon: "ri-file-3-line fs-3" };
    case "BURN":
      return { color: "dark", icon: "ri-fire-line fs-3" };
    case "MINT":
      return { color: "dark", icon: "ri-vip-diamond-line fs-3" };
    default:
      return { color: "dark", icon: "ri-arrow-down-line fs-3" };
  }
};

export const blockchainActions = {
  EXECUTE: "EXECUTE",
  WITHDRAW: "WITHDRAW",
  TRADE: "TRADE",
  APPROVE: "APPROVE",
  RECEIVE: "RECEIVE",
  SEND: "SEND",
};

export const formatIdTransaction = (address, prefixLength, suffixLength) => {
  if (!address || typeof address !== "string") {
    return null;
  }

  const prefix = address.slice(0, prefixLength + 2);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

export const formatNumber = (number) => {
  if (typeof number !== "number" || isNaN(number)) {
    return "Invalid Number";
  }

  let shift = 0;
  let tempNumber = Math.abs(number);
  while (tempNumber < 1 && tempNumber > 0) {
    tempNumber *= 10;
    shift++;
  }

  const roundedNumber =
    Math.round(number * Math.pow(10, shift + 1)) / Math.pow(10, shift + 1);

  return roundedNumber.toFixed(shift + 1);
};
