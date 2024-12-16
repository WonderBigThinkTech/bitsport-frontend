import { Header } from "@/components";
import { SERVER_URI } from "@/config";
import { getCake } from "@/service/helper";
import { IState } from "@/store";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GameLostPage: React.FC = (props: any) => {
  const [cakePrice, setCakePrice] = useState(0);
  const [sum, setSum] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [earnedMoneyAmount, setEarnedMoneyAmount] = useState(0);
  const [earnedMoneyUnit, setEarnedMoneyUnit] = useState("");
  const [totalEarnMoney, setTotalEarnMoney] = useState(Object);

  const getCakePrice = async () => {
    await getCake().then((price) => {
      setCakePrice(price);
    });
  };

  useEffect(() => {
    getCakePrice();
  }, []);

  useEffect(() => {
    // setLoading(true);
    if (currentUser.id && cakePrice) {
      axios
        .post(`${SERVER_URI}/getEarnedMoney`, { userId: currentUser.id })
        .then((res: any) => {
          setEarnedMoneyAmount(res.data.latestEarnedAmount);
          setEarnedMoneyUnit(res.data.latestEarnedUnit);
          setTotalEarnMoney(res.data.totalEarnedMoney);
          let rewardSum = 0;
          rewardSum +=
            Number(res.data.totalEarnedMoney.busd) +
            Number(res.data.totalEarnedMoney.usdt) +
            Number(res.data.totalEarnedMoney.bitp) * 0.06 +
            Number(
              Math.round(Number(res.data.totalEarnedMoney.cake) * cakePrice)
            );
          setSum(rewardSum);
        });

      setLoading(false);
    }
  }, [currentUser, cakePrice]);

  return (
    <>
      <Header />
      <div className="fixed game-result-page w-screen h-screen top-0 left-0 flex justify-center items-center">
        <div className="relative w-full z-10 mb-4 flex flex-col items-center">
          <div>
            <img src="/game-result-mark.png" alt="" />
          </div>
          <h1 className="game-result-text mb-10 ">You Lost</h1>
          <div
            className={`game-score relative border border-[#FFD] rounded-2xl after::rounded-2xl max-w-[406px] w-full py-10 px-6 ${
              loading && "loading"
            }`}
          >
            <div className="border-b h-11 flex justify-between items-center">
              <p>Coin</p>
              <p>PRICE</p>
            </div>
            <div className="border-b h-11 flex justify-between items-center">
              <p>busd</p>
              <p>{totalEarnMoney?.busd?.toFixed(2)}</p>
            </div>
            <div className="border-b h-11 flex justify-between items-center">
              <p>cake</p>
              <p>{totalEarnMoney?.cake?.toFixed(2)}</p>
            </div>
            <div className="border-b h-11 flex justify-between items-center">
              <p>usdt</p>
              <p>{totalEarnMoney?.usdt?.toFixed(2)}</p>
            </div>
            <div className="border-b h-11 flex justify-between items-center">
              <p>bitp</p>
              <p>{totalEarnMoney?.bitp?.toFixed(2)}</p>
            </div>
            <div className="border-b h-11 flex justify-between items-center">
              <p className="total-usdg">USD</p>
              <p className="total-usdg">{sum.toFixed(2)}</p>
            </div>
            <Link href="/">
              <img
                src="/game-result-home.png"
                className="absolute -bottom-5 right-10 cursor-pointer z-10"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameLostPage;
