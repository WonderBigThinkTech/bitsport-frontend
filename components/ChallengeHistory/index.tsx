import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/config";
import { ArrowDown } from "@/public/icons";
import Button, { variantTypes, volumeTypes } from "../Button";
import { Modal } from "antd";
import isEmpty from "@/validation/is-empty";
import { notification } from "antd";

const ChallengeHistory = () => {
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState<any>([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/pool-game/index`)
      .then((res) => {
        setChallengeHistory(res.data.models);
      })
      .catch((err) => {
        setChallengeHistory([]);
      });
  }, []);

  const viewDetail = (item: any) => {
    axios
      .post(`${SERVER_URI}/pool-game/challengehistory`, {
        challengeid: item._id,
      })
      .then((res) => {
        if (isEmpty(res.data)) {
          notification.warning({
            message: "WARN!!!",
            description: "There is no result yet.",
          });
          setVisible(false);
        } else {
          setModalData(res.data);
          console.log(res.data);
          setVisible(true);
        }
      })
      .catch((err) => {
        notification.error({
          message: "Network Error!",
          description: "API Network Error!",
        });
        setModalData([]);
      });
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      {isEmpty(challengeHistory) ? (
        <div>No Record Datas</div>
      ) : (
        challengeHistory.map((item: any, key) => {
          return (
            <div
              className="bg-primary-400 lg:h-20 h-14 px-5 items-center flex justify-between"
              key={key}
            >
              <div className={`flex flex-col items-center`}>
                <div className="text-primary-450 text-sm font-bold">
                  Game Type
                </div>
                <div className=" text-white text-base font-semibold">
                  {item.gametype
                    ? "User Challenge Mode"
                    : "Open Challenge Mode"}
                </div>
              </div>
              <div className={`flex flex-col items-center`}>
                <div className="text-primary-450 text-sm font-bold">AMOUNT</div>
                <div className=" text-white text-base font-semibold">
                  {item.amount}{" "}
                  {item.coin_type === 1
                    ? "BITP"
                    : item.coin_type === 2
                    ? "BUSD"
                    : item.coin_type === 3
                    ? "USDT"
                    : "CAKE"}
                </div>
              </div>
              <div className={`flex flex-col items-center`}>
                <div className="text-primary-450 text-sm font-bold">
                  Creater
                </div>
                <div className=" text-white text-base font-semibold">
                  {"@"}
                  {item.create_userid.username}
                </div>
              </div>
              <div className={`flex flex-col items-center hide`}>
                <div className="text-primary-450 text-sm font-bold">
                  Opponent
                </div>
                <div className=" text-white text-base font-semibold">
                  {item.gametype
                    ? "@" + item.opponent_userid.username
                    : "NO USER"}
                </div>
              </div>
              <div className={`flex flex-col items-center hide`}>
                <div className="text-primary-450 text-sm font-bold">Status</div>
                <div className=" text-white text-base font-semibold">
                  {item.status_num <= 1
                    ? "WAITING"
                    : item.status_num == 2
                    ? "ENDED"
                    : "ENDED"}
                </div>
              </div>
              <>
                <Button
                  variant={variantTypes.secondary}
                  textVol={volumeTypes.sm}
                  onClick={() => viewDetail(item)}
                  px="md:px-8 px-5"
                  text="Result"
                />
                <div className="cursor-pointer xl:hidden self-center">
                  <ArrowDown />
                </div>
              </>
            </div>
          );
        })
      )}

      <Modal
        title="Game Result"
        width={600}
        open={visible}
        closable={false}
        footer={[
          <button
            key="back"
            style={{
              backgroundColor: "#1677ff",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 20px",
            }}
            type="button"
            onClick={closeModal}
          >
            Close
          </button>,
        ]}
        onCancel={closeModal}
      >
        <div className="h-14 px-5 items-center flex justify-around">
          <div className={`flex flex-col items-center`}>
            <div className="text-primary-450 text-sm font-bold">Winner</div>
            <div className=" text-black text-base font-semibold">
              {!isEmpty(modalData)
                ? modalData.filter((modalItem: any) => {
                    return modalItem.game_result === "won";
                  })[0].game_userid.email
                : ""}
            </div>
          </div>
          <div className={`flex flex-col items-center`}>
            <div className="text-primary-450 text-sm font-bold">Loser</div>
            <div className=" text-black text-base font-semibold">
              {!isEmpty(modalData)
                ? modalData.filter((modalItem: any) => {
                    return modalItem.game_result === "lost";
                  })[0].game_userid.email
                : ""}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChallengeHistory;
