import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowDown, Quest } from "@/public/icons";
import Button, { variantTypes, volumeTypes } from "../Button";
import { IState } from "@/store";
import Axios from "axios";
import { SERVER_URI } from "@/config";
import { notification } from "antd";
import { useRouter } from "next/router";

export interface IItemProp {
  title: string;
  content: string;
  index: number;
}

export interface IProp {
  index: number;
  quest: {
    _id: string;
    amount: number;
    streak: number;
    qc: number;
    difficulty: number;
    coin_sku: number;
    index: number;
    number_of_players: number;
    played_number_count: number;
  };
  currentMatch: number;
}

const QuestComponent = (prop: IProp) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state: IState) => state.auth);

  const startGame = () => {
    if (!currentUser) {
      notification.warning({
        message: "Warning!",
        description: "Please login!",
      });
      return;
    }
    localStorage.setItem("cid", prop.quest.index.toString());
    localStorage.setItem("level", prop.quest.difficulty.toString());
    const uid: any = currentUser.index;

    Axios.post(`${SERVER_URI}/game/start`, {
      cid: prop.quest.index,
      uid,
      scratch: true,
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
      <div
        className="bg-primary-400 lg:h-20 h-14 px-5 items-center flex justify-between"
        key={prop.index}
      >
        <div
          onClick={() => setOpen(!open)}
          className="h-11 w-11 rounded-full flex justify-center items-center"
        >
          {prop.quest.coin_sku === 1 ? (
            <div className="flex justify-center items-center bg-white h-11 w-11 rounded-full">
              <Quest />
            </div>
          ) : prop.quest.coin_sku === 2 ? (
            <img src="/busd.png" alt="" className="h-11 w-11 object-contain" />
          ) : prop.quest.coin_sku === 3 ? (
            <img src="/usdt.png" alt="" className="h-11 w-11 object-contain" />
          ) : (
            <img src="/cake.png" alt="" className="h-11 w-11 object-contain" />
          )}
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`flex flex-col items-center`}
        >
          <div className="text-primary-450 text-sm font-bold">AMOUNT</div>
          <div className=" text-white text-base font-semibold">
            {prop.quest.amount}{" "}
            {prop.quest.coin_sku === 1
              ? "BITP"
              : prop.quest.coin_sku === 2
              ? "BUSD"
              : prop.quest.coin_sku === 3
              ? "USDT"
              : "CAKE"}
          </div>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`flex flex-col items-center`}
        >
          <div className="text-primary-450 text-sm font-bold">WIN STREAK</div>
          <div className=" text-white text-base font-semibold">
            {!currentUser.id
              ? prop.quest.streak
              : `${prop.currentMatch} / ${prop.quest.streak}`}
          </div>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`flex flex-col items-center hide`}
        >
          <div className="text-primary-450 text-sm font-bold">QUEST CREDIT</div>
          <div className=" text-white text-base font-semibold">
            {prop.quest.qc}
          </div>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`flex flex-col items-center hide`}
        >
          <div className="text-primary-450 text-sm font-bold">DIFFICULTY</div>
          <div className=" text-white text-base font-semibold">
            {prop.quest.difficulty == 0
              ? "EASY"
              : prop.quest.difficulty == 1
              ? "MEDIUM"
              : "HARD"}
          </div>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`flex flex-col items-center hide`}
        >
          <div className="text-primary-450 text-sm font-bold">
            MAX NUMBER OF PLAYERS
          </div>
          <div className=" text-white text-base font-semibold">
            {prop.quest.played_number_count} / {prop.quest.number_of_players}
          </div>
        </div>
        <Button
          variant={variantTypes.secondary}
          textVol={volumeTypes.sm}
          onClick={() => startGame()}
          px="xl:px-20 px-5"
          text={"ACCEPT"}
        />
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer xl:hidden self-center"
        >
          <ArrowDown />
        </div>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-5 -mt-2 px-5 xl:hidden bg-primary-1200 text-primary-450 font-bold"
        >
          <div className="text-lg">CHALLENGE INFO</div>
          <div className="mt-5 mb-3 flex items-center justify-between">
            <div className="text-sm">
              AMOUNT:{" "}
              <span className="text-white">
                {" "}
                {prop.quest.amount}{" "}
                {prop.quest.coin_sku === 1
                  ? "BITP"
                  : prop.quest.coin_sku === 2
                  ? "BUSD"
                  : prop.quest.coin_sku === 3
                  ? "USDT"
                  : "CAKE"}
              </span>
            </div>
            <div className="text-sm">
              QUEST CREDIT: <span className="text-white"> {prop.quest.qc}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              WIN STREAK:{" "}
              <span className="text-white"> {prop.quest.streak}</span>
            </div>
            <div className="text-sm">
              DIFFICULTY:{" "}
              <span className="text-white">
                {" "}
                {prop.quest.difficulty === 0
                  ? "EASY"
                  : prop.quest.difficulty === 1
                  ? "MEDIUM"
                  : "HARD"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                NUMBER OF PLAYERS:{" "}
                <span className="text-white">
                  {" "}
                  {prop.quest.played_number_count} /{" "}
                  {prop.quest.number_of_players}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default QuestComponent;
