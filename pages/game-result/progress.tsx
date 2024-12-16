import { Header } from "@/components";
import { SERVER_URI } from "@/config";
import { getCake } from "@/service/helper";
import { IState } from "@/store";
import { notification } from "antd";
import Axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const GameWinPage: React.FC = (props: any) => {
  const router = useRouter();
  const [cakePrice, setCakePrice] = useState(0);
  const [sum, setSum] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [mainStreak, setMainStreak] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
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
      Axios.post(`${SERVER_URI}/getEarnedMoney`, {
        userId: currentUser.id,
      }).then((res: any) => {
        setTotalEarnMoney(res.data.totalEarnedMoney);
        setMainStreak(res.data.totalStreak);
        setCurStreak(res.data.curStreak);
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

  const continueGame = () => {
    const uid: any = currentUser.index;
    const cid: any = localStorage.getItem("cid");
    Axios.post(`${SERVER_URI}/game/start`, {
      cid,
      uid,
      scratch: false,
    }).then((res) => {
      if (res.data.success) {
        router.push("/aigame");
      } else {
        notification.warning({
          message: "Warning!",
          description: res.data.message,
        });
      }
    });
  };

  return (
    <>
      <Header />
      <div className="fixed game-result-page w-screen h-screen top-0 left-0 flex justify-center items-center">
        <div className="relative w-full z-10 mb-4 flex flex-col items-center">
          <div className="">
            <img src="/game-result-mark.png" alt="" />
          </div>
          <h1 className="game-result-text-progress mb-10 ">
            Won {curStreak} / {mainStreak}
          </h1>
          <h2 className="game-result-score mb-8">
            {[...new Array(curStreak)].map((item, key) => (
              // eslint-disable-next-line react/jsx-key
              <AiFillStar color="#e0b012" key={key} />
            ))}
            {[...new Array(mainStreak - curStreak)].map((item, key) => (
              // eslint-disable-next-line react/jsx-key
              <AiOutlineStar color="#e0b012" key={key} />
            ))}
          </h2>
          <div
            className={`game-score relative border border-[#FFD] rounded-2xl after::rounded-2xl max-w-[406px] w-full py-10 px-6 ${
              loading && "loading"
            }`}
          >
            <img src="/fx-star.png" alt="" className="absolute -top-8 z-10" />
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
            <div
              className="absolute -bottom-5 right-10 cursor-pointer z-10 flex items-center"
              onClick={() => continueGame()}
            >
              <h4 className="text-3xl leading-none mb-0 font-bold text-[#e0b012] mr-4">
                Click here to proceed
              </h4>
              <img src="/but_next.png" className="w-[45px] h-[49px]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameWinPage;
