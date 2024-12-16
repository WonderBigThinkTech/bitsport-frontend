import React, { useEffect, useState } from "react";
import { Button, Header } from "@/components";
import Footer from "@/components/Footer";
import { variantTypes, volumeTypes } from "@/components/Button";
import { SwapArrow, SwapIcon } from "@/public/icons";
import Image from "next/image";
import QIC from "@/public/qc.png";
import USDT from "@/public/usdt.png";
import Paypal from "@/public/paypal.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import CAKE from "@/public/cake.png";
import { getCake } from "@/service/helper";
import { notification } from "antd";
import { useSelector } from "react-redux";
import { IState } from "@/store";
import Axios from "axios";
import { SERVER_URI } from "@/config";
import { useRouter } from "next/router";

const itemsFrom = [
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
  {
    icon: CAKE,
    name: "CAKE",
    ratio: 2,
  },
  {
    icon: Paypal,
    name: "USD",
    ratio: 1,
  },
  {
    icon: QIC,
    name: "Quest",
    ratio: 3,
  },
];

const SwapPage: React.FC = () => {
  const [fromTokenAmount, setFromTokenAmount] = useState<number>();
  const [toTokenAmount, setToTokenAmount] = useState<number>();
  const [fromItem, setFromItem] = useState<any>(itemsFrom[0]);
  const [toItem, setToItem] = useState<any>(itemsFrom[1]);
  const [fromList, setFromList] = useState(false);
  const [toList, setToList] = useState(false);
  const [cakePrice, setCakePrice] = useState(1);
  const { currentUser } = useSelector((state: IState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    getCakePrice();
  }, []);

  useEffect(() => {
    itemsFrom[2].ratio = cakePrice;
  }, [cakePrice]);

  const getCakePrice = async () => {
    getCake().then((price) => {
      setCakePrice(price);
    });
  };

  const handleExchange = () => {
    setToTokenAmount(fromTokenAmount);
    setFromTokenAmount(toTokenAmount);
    setToItem(fromItem);
    setFromItem(toItem);
  };

  const handleSwap = () => {
    if (fromTokenAmount == 0 || !fromTokenAmount) {
      notification.warning({
        message: "Warning!",
        description: "Please input token amount",
      });
      return;
    } else if (fromTokenAmount < 0) {
      notification.warning({
        message: "Warning!",
        description: "Invalid token amount",
      });
      return;
    }
    const swapinfo = {
      user: currentUser.id,
      coinFrom: fromItem.name,
      fromTokenAmount,
      coinTo: toItem.name === "Quest" ? "Quest Credit" : toItem.name,
      toTokenAmount,
    };

    Axios.post(`${SERVER_URI}/swap`, swapinfo).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: res.data.message,
        });
        router.back();
      } else {
        notification.warning({
          message: "Warning!",
          description: res.data.message,
        });
      }
    });
  };

  const handleFromChange = (e: any) => {
    setFromTokenAmount(parseFloat(e.target.value));
    let ratioFrom = itemsFrom.filter((item) => item.name == fromItem.name)[0]
      .ratio;
    let ratioTo = itemsFrom.filter((item) => item.name == toItem.name)[0].ratio;
    let toTokenVal = (Number(e.target.value) * ratioFrom) / ratioTo;
    setToTokenAmount(toTokenVal === 0 ? undefined : toTokenVal);
  };

  const handleToChange = (e: any) => {
    setToTokenAmount(parseFloat(e.target.value));
    let ratioFrom = itemsFrom.filter((item) => item.name == fromItem.name)[0]
      .ratio;
    let ratioTo = itemsFrom.filter((item) => item.name == toItem.name)[0].ratio;
    let fromTokenVal = (Number(e.target.value) * ratioTo) / ratioFrom;
    setFromTokenAmount(fromTokenVal === 0 ? undefined : fromTokenVal);
  };

  const handleFromItemChange = (item: any) => {
    setFromItem(item);
    setFromList(false);
    if (item.name === toItem.name) {
      setToItem(fromItem);
    }
    if (fromTokenAmount) {
      let ratioFrom = itemsFrom.filter((item) => item.name == fromItem.name)[0]
        .ratio;
      let ratioTo = itemsFrom.filter((item) => item.name == toItem.name)[0]
        .ratio;
      let toTokenVal = (fromTokenAmount * ratioFrom) / ratioTo;
      setToTokenAmount(toTokenVal);
    }
  };

  const handleToItemChange = (item: any) => {
    setToItem(item);
    if (item.name === fromItem.name) {
      setFromItem(toItem);
    }
    setToList(false);
    if (toTokenAmount) {
      let ratioFrom = itemsFrom.filter((item) => item.name == fromItem.name)[0]
        .ratio;
      let ratioTo = itemsFrom.filter((item) => item.name == toItem.name)[0]
        .ratio;
      let fromTokenVal = (toTokenAmount * ratioTo) / ratioFrom;
      setFromTokenAmount(fromTokenVal);
    }
  };

  return (
    <div className="w-full">
      <Header />
      <div className="text-white max-w-[550px] m-auto my-10 bg-[#1e2126] p-6 rounded-lg">
        <h1 className="text-center text-4xl font-bold m-0 pb-5 border-b border-[#ffffff20] border-dashed">
          SWAP
        </h1>
        <div>
          <div className="py-5 border-b border-[#ffffff20] border-dashed">
            <div className="border border-[#ffffff20] rounded-2xl h-[70px] swap-input flex">
              <div className="flex flex-col justify-center items-start h-full border-r border-[#ffffff20] swap-coins w-[120px]">
                <p className="px-3 mb-0 text-[#ffffffa0]">From</p>
                <div className="w-full px-3 relative">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      setFromList((prev) => !prev);
                      setToList(false);
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
            <div className="flex justify-center items-center my-[-5px]">
              <div
                onClick={handleExchange}
                className="bg-[#1e2126] rounded-full cursor-pointer"
              >
                <SwapIcon />
              </div>
            </div>
            <div className="border border-[#ffffff20] rounded-2xl h-[70px] swap-input flex">
              <div className="flex flex-col justify-center items-start h-full border-r border-[#ffffff20] swap-coins w-[120px]">
                <p className="px-3 mb-0 text-[#ffffffa0]">To</p>
                <div className="w-full px-3 relative">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      setFromList(false);
                      setToList((prev) => !prev);
                    }}
                  >
                    <div className="flex items-center">
                      <Image
                        priority={true}
                        height={16}
                        width={16}
                        src={toItem.icon}
                        alt="icon"
                      />
                      <div className="text-white ml-2 font-medium text-sm xl:text-lg">
                        {toItem.name}
                      </div>
                    </div>
                    <div className="cursor-pointer">
                      <SwapArrow />
                    </div>
                  </div>
                  {toList && (
                    <div className="absolute z-10 top-10 w-full left-0 bg-[#101114] border border-[#ffffff20] rounded-lg py-1">
                      {itemsFrom.map((item, key) => (
                        <div
                          key={key}
                          className="flex items-center py-1 hover:bg-[#ffffff40]  px-2"
                          onClick={() => handleToItemChange(item)}
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
                  value={toTokenAmount}
                  onChange={handleToChange}
                />
                <p className="mb-0 text-[#ffffff70]">
                  = $
                  {Number(
                    (toTokenAmount ? toTokenAmount : 0) * toItem.ratio
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant={variantTypes.secondary}
            textVol={volumeTypes.sm}
            onClick={handleSwap}
            px="w-full mt-5"
            text="SWAP"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SwapPage;
