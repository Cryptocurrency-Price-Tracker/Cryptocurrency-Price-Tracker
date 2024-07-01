import React, { useEffect, useState } from "react";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/DashBoard/List";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Compare() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  // id states
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  // data states
  const [coin1Data, setCoin1Data] = useState({});
  const [coin2Data, setCoin2Data] = useState({});
  // days state
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getData();
  }, []);

  // const getData = async () => {
  //   setLoading(true);
  //   const coins = await get100Coins();
  //   if (coins) {
  //     setAllCoins(coins);
  //     const data1 = await getCoinData(crypto1);
  //     const data2 = await getCoinData(crypto2);
  //     settingCoinObject(data1, setCoin1Data);
  //     settingCoinObject(data2, setCoin2Data);
  //     if (data1 && data2) {
  //       // getPrices
  //       const prices1 = await getPrices(crypto1, days, priceType);
  //       const prices2 = await getPrices(crypto2, days, priceType);
  //       settingChartData(setChartData, prices1, prices2);
  //       setLoading(false);
  //     }
  //   }
  // };

  // const onCoinChange = async (e, isCoin2) => {
  //   setLoading(true);
  //   if (isCoin2) {
  //     const newCrypto2 = e.target.value;
  //     // crypto2 is being changed
  //     setCrypto2(newCrypto2);
  //     // fetch coin2 data
  //     const data2 = await getCoinData(newCrypto2);
  //     settingCoinObject(data2, setCoin2Data);
  //     // fetch prices again
  //     const prices1 = await getPrices(crypto1, days, priceType);
  //     const prices2 = await getPrices(newCrypto2, days, priceType);
  //     settingChartData(setChartData, prices1, prices2);
  //   } else {
  //     const newCrypto1 = e.target.value;
  //     // crypto1 is being changed
  //     setCrypto1(newCrypto1);
  //     // fetch coin1 data
  //     const data1 = await getCoinData(newCrypto1);
  //     settingCoinObject(data1, setCoin1Data);
  //     // fetch coin prices
  //     const prices1 = await getPrices(newCrypto1, days, priceType);
  //     const prices2 = await getPrices(crypto2, days, priceType);
  //     settingChartData(setChartData, prices1, prices2);
  //   }
  //   setLoading(false);
  // };

  const getData = async () => {
    setLoading(true);
    try {
      const coins = await get100Coins();
      if (coins) {
        setAllCoins(coins);

        const data1 = await getCoinData(crypto1);
        if (data1) {
          settingCoinObject(data1, setCoin1Data);
        } else {
          console.error("Failed to fetch data for coin 1:", crypto1);
        }

        const data2 = await getCoinData(crypto2);
        if (data2) {
          settingCoinObject(data2, setCoin2Data);
        } else {
          console.error("Failed to fetch data for coin 2:", crypto2);
        }

        if (data1 && data2) {
          const prices1 = await getPrices(crypto1, days, priceType);
          const prices2 = await getPrices(crypto2, days, priceType);
          settingChartData(setChartData, prices1, prices2);
        }
      }
    } catch (error) {
      console.error("Error in getData:", error);
    } finally {
      setLoading(false);
    }
  };


  const onCoinChange = async (e, isCoin2) => {
    setLoading(true);
    try {
      if (isCoin2) {
        const newCrypto2 = e.target.value;
        setCrypto2(newCrypto2);
  
        const data2 = await getCoinData(newCrypto2);
        if (data2) {
          settingCoinObject(data2, setCoin2Data);
        } else {
          console.error("Failed to fetch data for new coin 2:", newCrypto2);
        }
  
        const prices1 = await getPrices(crypto1, days, priceType);
        const prices2 = await getPrices(newCrypto2, days, priceType);
        settingChartData(setChartData, prices1, prices2);
      } else {
        const newCrypto1 = e.target.value;
        setCrypto1(newCrypto1);
  
        const data1 = await getCoinData(newCrypto1);
        if (data1) {
          settingCoinObject(data1, setCoin1Data);
        } else {
          console.error("Failed to fetch data for new coin 1:", newCrypto1);
        }
  
        const prices1 = await getPrices(newCrypto1, days, priceType);
        const prices2 = await getPrices(crypto2, days, priceType);
        settingChartData(setChartData, prices1, prices2);
      }
    } catch (error) {
      console.error("Error in onCoinChange:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDaysChange = async (e) => {
    const newDays = e.target.value;
    setLoading(true);
    setDays(newDays);
    const prices1 = await getPrices(crypto1, newDays, priceType);
    const prices2 = await getPrices(crypto2, newDays, priceType);
    settingChartData(setChartData, prices1, prices2);
    setLoading(false);
  };

  const handlePriceTypeChange = async (e) => {
    const newPriceType = e.target.value;
    setLoading(true);
    setPriceType(newPriceType);
    const prices1 = await getPrices(crypto1, days, newPriceType);
    const prices2 = await getPrices(crypto2, days, newPriceType);
    settingChartData(setChartData, prices1, prices2);
    setLoading(false);
  };

  return (
    <div>
      <Header />
      {loading || !coin1Data?.id || !coin2Data?.id ? (
        <Loader />
      ) : (
        <>
          <SelectCoins
            allCoins={allCoins}
            crypto1={crypto1}
            crypto2={crypto2}
            onCoinChange={onCoinChange}
            days={days}
            handleDaysChange={handleDaysChange}
          />
          <div className="grey-wrapper">
            <List coin={coin1Data} />
          </div>
          <div className="grey-wrapper">
            <List coin={coin2Data} />
          </div>
          <div className="grey-wrapper">
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} multiAxis={true} />
          </div>
          <Info title={coin1Data.name} desc={coin1Data.desc} />
          <Info title={coin2Data.name} desc={coin2Data.desc} />
        </>
      )}
    </div>
  );
}

export default Compare;