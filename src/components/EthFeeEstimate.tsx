import { DialogContentText } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useConnection } from "../utils/connection";
import { priceStore, serumMarkets } from "../utils/markets";

function FeeContentText({ ethFee, ethPrice, warning = false, prefix = "", bold = false }) {
  let usdFeeEstimate = ethPrice !== undefined ? ethPrice * ethFee : null;

  return (
    <DialogContentText
      color={warning ? 'secondary' : 'textPrimary'}
      // @ts-ignore
      style={{ marginBottom: '0px', fontWeight: bold ? '500' : undefined }}
    >
      {prefix}
      {ethFee.toFixed(4)}
      {' ETH'}
      {usdFeeEstimate && ` (${usdFeeEstimate.toFixed(2)} USD)`}
    </DialogContentText>
  );
}

export function EthFeeEstimate({ ethFeeData, insufficientEthBalance }) {
  let [ethFeeEstimate, loaded, error] = ethFeeData;
  const [ethPrice, setEthPrice] = useState<number | undefined>(undefined);
  const connection = useConnection();
  useEffect(() => {
    if (ethPrice === undefined) {
      let m = serumMarkets['ETH'];
      priceStore.getPrice(connection, m.name).then(setEthPrice);
    }
  }, [ethPrice, connection]);

  if (!loaded && !error) {
    return (
      <DialogContentText color="textPrimary">Loading...</DialogContentText>
    );
  } else if (error) {
    return (
      <DialogContentText color="textPrimary">
        Unable to estimate
      </DialogContentText>
    );
  }

  if (Array.isArray(ethFeeEstimate)) {
    const [approveFee, swapFee] = ethFeeEstimate;
    return (
      <DialogContentText>
        <FeeContentText ethFee={approveFee} ethPrice={ethPrice} prefix={"Approve: "} />
        <FeeContentText ethFee={swapFee} ethPrice={ethPrice} prefix={"Swap: "} />
        <FeeContentText
          warning={insufficientEthBalance}
          ethFee={approveFee + swapFee}
          ethPrice={ethPrice}
          prefix={"Total: "}
          bold
        />
      </DialogContentText>
    );
  }

  return (
    <FeeContentText
      warning={insufficientEthBalance}
      ethFee={ethFeeEstimate}
      ethPrice={ethPrice}
    />
  );
}