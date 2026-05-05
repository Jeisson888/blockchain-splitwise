import { useCallback, useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useInterval } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { fetchPriceFromUniswap } from "~~/utils/scaffold-eth";

const enablePolling = false;

/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 */
export const useInitializeNativeCurrencyPrice = () => {
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const setIsNativeCurrencyFetching = useGlobalState(state => state.setIsNativeCurrencyFetching);
  const { targetNetwork } = useTargetNetwork();

  const fetchPrice = useCallback(async () => {
    setIsNativeCurrencyFetching(true);
    try {
      const price = await fetchPriceFromUniswap(targetNetwork);
      setNativeCurrencyPrice(price);
    } catch (error) {
      console.warn("useNativeCurrencyPrice: could not fetch price", error);
      setNativeCurrencyPrice(0);
    } finally {
      setIsNativeCurrencyFetching(false);
    }
  }, [setIsNativeCurrencyFetching, setNativeCurrencyPrice, targetNetwork]);

  // Get the price of ETH from Uniswap on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Get the price of ETH from Uniswap at a given interval
  useInterval(fetchPrice, enablePolling ? scaffoldConfig.pollingInterval : null);
};
