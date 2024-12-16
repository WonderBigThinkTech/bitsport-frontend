import { Header } from "@/components";
import Button, { variantTypes, volumeTypes } from "@/components/Button";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SwapArrow } from "@/public/icons";
import USDT from "@/public/usdt.png";
import BUSD from "@/public/busd.png";
import BNB from "@/public/bnb.png";
import BITP from "@/public/bitp.png";
import axios from "axios";
import { notification } from "antd";
import Select from "@/components/Select";
import { networks } from "./deposit";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store";
import { SERVER_URI } from "@/config";
import { authActions } from "@/store/auth";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import MoneyImg from "@/public/referral-money.png";
import LinkImg from "@/public/referral-link.png";
import UserImg from "@/public/referral-user.png";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import copy from "copy-to-clipboard";
import ResponsivePagination from "react-responsive-pagination";

const DynamicQRCode = dynamic(() => import("@/components/QrCode"), {
  ssr: false,
});

const itemsFrom = [
  {
    icon: BNB,
    name: "BNB",
    ratio: 2,
  },
  {
    icon: BUSD,
    name: "BUSD",
    ratio: 1,
  },
  {
    icon: USDT,
    name: "USDT",
    ratio: 1,
  },
];

const BuyBitp: React.FC = () => {
  const [toTokenAmount, setToTokenAmount] = useState<number>();
  const [fromItem, setFromItem] = useState<any>(itemsFrom[0]);
  const [fromList, setFromList] = useState(false);
  const [fromTokenAmount, setFromTokenAmount] = useState<number>();
  const [bnbPrice, setBnbPrice] = useState(1);
  const [isBuy, setIsBuy] = useState(false);
  const [network, setNetwork] = useState("BNB CHAIN");
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();
  const [isRefUrlCopied, setIsRefUrlCopied] = useState(false);
  const [sum, setSum] = useState<number>(0);
  const [cakePrice, setCakePrice] = useState(0);
  const [totalData, setTotalData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getBNBPrice();
    } else {
      localStorage.setItem("trypage", "buy_bitp");
      router.push("/?signin=true");
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(totalData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  useEffect(() => {
    if (currentUser.id && cakePrice) {
      axios
        .post(`${SERVER_URI}/getReferalInfo`, { userId: currentUser.id })
        .then((res) => {
          // setData(res.data.models);
          let rewardSum = 0;
          const temp = res.data.data.map((item: any) => {
            console.log(rewardSum);
            rewardSum +=
              (Number(item.earnMoney.busd) +
                Number(item.earnMoney.usdt) +
                Number(item.earnMoney.usd) +
                Number(item.earnMoney.bitp) * 0.06 +
                Number(Math.round(Number(item.earnMoney.cake) * cakePrice))) *
              0.05;
            return {
              ...item,
            };
          });
          setSum(rewardSum);
          setTableData(temp.slice(0, 10));
          setTotalData(temp);
        });
    }
  }, [currentUser, cakePrice]);

  useEffect(() => {
    itemsFrom[0].ratio = bnbPrice;
  }, [bnbPrice]);

  const getBNBPrice = async () => {
    await axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
      )
      .then((response) => {
        const bnbPriceInUSD = response.data.binancecoin.usd;
        setBnbPrice(bnbPriceInUSD);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const handleBuy = () => {
    if (fromTokenAmount) {
      setIsBuy(true);
    } else {
      notification.warning({
        message: "Warning",
        description: "Token Amount is invalid.",
      });
    }
  };

  const handleDone = async () => {
    await axios
      .post(`${SERVER_URI}/buyBitp`, {
        user: currentUser.id,
        buyCurrency: fromItem.name,
      })
      .then((res) => {
        if (res.data.success) {
          notification.success({
            message: "Success",
            description: res.data.message,
          });
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        } else {
          notification.warning({
            message: "Warning",
            description: res.data.message,
          });
        }
      });
  };

  const handleFromItemChange = (item: any) => {
    setFromItem(item);
    setFromList(false);
    // setFromTokenAmount(fromTokenAmount);
    let ratioFrom = itemsFrom.filter((f) => f.name == item.name)[0].ratio;
    let toTokenVal = (Number(fromTokenAmount) * ratioFrom) / 0.06;
    console.log(ratioFrom, toTokenVal);
    setToTokenAmount(toTokenVal === 0 ? undefined : toTokenVal);
    if (!fromTokenAmount) {
      setToTokenAmount(0);
    }
  };

  const handleFromChange = (e: any) => {
    if (Number(e.target.value) >= 0) {
      setFromTokenAmount(parseFloat(e.target.value));
      let ratioFrom = itemsFrom.filter((item) => item.name == fromItem.name)[0]
        .ratio;
      let toTokenVal = (Number(e.target.value) * ratioFrom) / 0.06;
      setToTokenAmount(toTokenVal === 0 ? undefined : toTokenVal);
      if (!e.target.value) {
        setToTokenAmount(0);
      }
    }
  };
  return (
    <div className="w-full">
      <Header />
      <div>
        <div className="text-white max-w-[550px] m-auto my-10 bg-[#1e2126] p-6 rounded-lg">
          <h1 className="text-center text-4xl font-bold m-0 pb-5 border-b border-[#ffffff20] border-dashed">
            $BITP IDO - Phase 1
          </h1>

          {/* IDO Stats Section */}
          <div className="my-5">
            <h2 className="text-2xl font-bold">IDO Stats</h2>
            <p>IDO Price: 1 $BITP = $0.06 USD</p>
            <p>Chain Network: BNB Chain</p>
            <p>IDO Phase 1 Allocation: 5,000,000 BITP</p>
          </div>
          <div>
            {!isBuy ? (
              <div className="py-5 border-b border-[#ffffff20] border-dashed">
                <div className="border border-[#ffffff20] rounded-2xl h-[70px] swap-input flex">
                  <div className="flex flex-col justify-center items-start h-full border-r border-[#ffffff20] swap-coins w-[120px]">
                    <p className="px-3 mb-0 text-[#ffffffa0]">Buy Currency</p>
                    <div className="w-full px-3 relative">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setFromList((prev) => !prev);
                        }}
                      >
                        <div className="flex items-center">
                          <Image
                            priority={true}
                            height={16}
                            width={16}
                            src={fromItem.icon}
                            alt="icon"
                          />
                          <div className="text-white ml-2 font-medium text-sm xl:text-lg">
                            {fromItem.name}
                          </div>
                        </div>
                        <div className="cursor-pointer">
                          <SwapArrow />
                        </div>
                      </div>
                      {fromList && (
                        <div className="absolute z-10 top-10 w-full left-0 bg-[#101114] border border-[#ffffff20] rounded-lg py-1">
                          {itemsFrom
                            .filter((f) => f.name !== "Quest")
                            .map((item, key) => (
                              <div
                                key={key}
                                className="flex items-center py-1 hover:bg-[#ffffff40]  px-2"
                                onClick={() => handleFromItemChange(item)}
                              >
                                <Image
                                  priority={true}
                                  height={16}
                                  width={16}
                                  src={item.icon}
                                  alt="icon"
                                />
                                <div className="ml-3">{item.name}</div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-full flex-1 flex flex-col items-end justify-center px-3">
                    <input
                      type="number"
                      className="bg-transparent border-none outline-none text-right text-2xl w-full"
                      placeholder="0.0"
                      value={fromTokenAmount}
                      onChange={handleFromChange}
                    />
                    <p className="mb-0 text-[#ffffff70]">
                      = $
                      {Number(
                        (fromTokenAmount ? fromTokenAmount : 0) * fromItem.ratio
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="border border-[#ffffff20] rounded-2xl h-[70px] swap-input flex mt-8">
                  <div className="flex flex-col justify-center items-start h-full border-r border-[#ffffff20] swap-coins w-[120px]">
                    <p className="px-3 mb-0 text-[#ffffffa0]">Bitp</p>
                    <div className="w-full px-3 relative">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center flex-1">
                          <Image
                            priority={true}
                            height={16}
                            width={16}
                            src={BITP}
                            alt="icon"
                          />
                          <div className="text-white ml-2 font-medium text-sm xl:text-lg flex-1 text-center">
                            BITP
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full flex-1 flex flex-col items-end justify-center px-3">
                    <input
                      type="number"
                      className="bg-transparent border-none outline-none text-right text-2xl w-full"
                      placeholder="0.0"
                      value={toTokenAmount}
                      readOnly
                    />
                    <p className="mb-0 text-[#ffffff70]">
                      = $
                      {Number(
                        (toTokenAmount ? toTokenAmount : 0) * 0.06
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-5 border-b border-[#ffffff20] border-dashed">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-2">
                    <Image
                      priority={true}
                      height={16}
                      width={16}
                      src={fromItem.icon}
                      alt="icon"
                    />
                    <div className="text-white ml-2 font-medium text-sm xl:text-lg">
                      {fromItem.name}
                    </div>
                  </div>
                  <Select
                    key={1}
                    name={network}
                    handleChange={(value) => {
                      setNetwork(value);
                    }}
                    items={networks}
                    bordered
                    label="SELECT NETWORK"
                  />
                  <Select
                    key={2}
                    name={
                      currentUser.buy_BitpAddr &&
                      currentUser.buy_BitpAddr.address
                    }
                    label="ADDRESS"
                    bordered
                    hasCopy
                  />
                  <div className="py-2 px-4 bg-red-200 text-red-800 rounded border border-red-300 mb-4">
                    <strong>Warning:</strong> Do not close this page while
                    completing the transaction. Click &apos;Done&apos; button below after
                    payment is sent.
                  </div>
                </motion.div>

                <DynamicQRCode
                  qrValue={
                    currentUser.buy_BitpAddr && currentUser.buy_BitpAddr.address
                  }
                />
              </div>
            )}
            {isBuy ? (
              <div className="flex items-center">
                <Button
                  variant={variantTypes.secondary}
                  textVol={volumeTypes.sm}
                  onClick={() => setIsBuy(false)}
                  px="w-full mt-5 mr-4"
                  text="Back"
                />
                <Button
                  variant={variantTypes.primary}
                  textVol={volumeTypes.sm}
                  onClick={handleDone}
                  px="w-full mt-5"
                  text="Done"
                />
              </div>
            ) : (
              <Button
                variant={variantTypes.secondary}
                textVol={volumeTypes.sm}
                onClick={handleBuy}
                px="w-full mt-5"
                text="BUY BITP"
              />
            )}
          </div>
        </div>
        <div className="w-full flex-1 text-white">
          <p className="text-center text-2xl mb-10 max-w-[768px] w-full mx-auto">
           Invite others to join the IDO using your unique referral link below, Earn whopping 10% referral commission on their contribution.
          </p>
          <div className="flex justify-center gap-6 mb-20 flex-wrap">
            <div className="referral-card !flex-row max-w-[250px] w-full">
              <Image src={MoneyImg} alt="" />
              <p className="!ml-2">Earned: {sum.toFixed(2)} USD</p>
            </div>
            <div className="referral-card !flex-row max-w-[250px] w-full">
              <Image src={LinkImg} alt="" />
              <p className="flex space-x-1 !ml-2">
                <span>
                  {" "}
                  {currentUser.index
                    ? `play.bitpool.gg?refid=${currentUser.index}`
                    : "play.bitpool.gg"}{" "}
                </span>
                {!isRefUrlCopied && (
                  <IoCopyOutline
                    className="cursor-pointer"
                    size={24}
                    onClick={() => {
                      copy(`play.bitpool.gg?refid=${currentUser.index}`);
                      setIsRefUrlCopied(true);
                      setTimeout(() => {
                        setIsRefUrlCopied(false);
                      }, 2000);
                    }}
                  />
                )}
                {isRefUrlCopied && <IoCopy size={24} />}
              </p>
            </div>
            {/* <div className="referral-card">
                <Image src={UserImg} className="mb-2" alt="" />
                <p>{currentUser.referralCnt ? currentUser.referralCnt : 0}</p>
              </div> */}
          </div>
        </div>
        <div className="referral-table">
          <div className="referral-table-header">
            <span className="pl-2 max-w-[40px]">No</span>
            <span className="min-w-[150px]">Username</span>
            <span className="max-w-[120px] min-w-[120px]">
              <br />
              {"(BUSD)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(USDT)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(BITP)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(CAKE)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(USD)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(TOTAL)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              My Reward
              <br />
              {"(USD)"}
            </span>
          </div>
          {tableData.map((item: any, key: number) => (
            <div className="referral-table-body" key={key}>
              <span className="pl-2 max-w-[40px]">{key + 1}</span>
              <span className="min-w-[150px]">{item.username}</span>
              <span className="max-w-[120px] min-w-[120px]">
                {Number(item.earnMoney.busd).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.usdt).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.bitp).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.cake).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.usd).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {(
                  Number(item.earnMoney.busd) +
                  Number(item.earnMoney.usdt) +
                  Number(item.earnMoney.usd) +
                  Number(item.earnMoney.bitp) +
                  Number(Math.round(Number(item.earnMoney.cake) * cakePrice))
                ).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {(Number(item.earnMoney.busd) +
                  Number(item.earnMoney.usdt) +
                  Number(item.earnMoney.usd) +
                  Number(item.earnMoney.bitp) +
                  Number(Math.round(Number(item.earnMoney.cake) * cakePrice))) *
                  0.05}
              </span>
            </div>
          ))}
        </div>
        <div className="max-w-[400px] m-auto responsive-page">
          <ResponsivePagination
            total={Math.ceil(totalData.length / 10)}
            current={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyBitp;
