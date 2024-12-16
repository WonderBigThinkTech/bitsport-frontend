import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowDown, Quest } from "@/public/icons";
import Button, { variantTypes, volumeTypes } from "../Button";
import Modal from "../Modal";
import Login from "../Login";
import Signup from "../Signup";
import ForgotPassword from "../ForgotPassword";
import { IState } from "@/store";
import axios from "axios";
import { SERVER_URI, SERVER_HOST } from "@/config";
import { notification } from "antd";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { authActions } from "@/store/auth";
import copy from "copy-to-clipboard";

const PoolChallenge = (prop: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);
  const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);

  const origin = window.location.origin;

  const toggleLogin = () => {
    setIsOpenSignup(false);
    setIsOpenLogin(!isOpenLogin);
  };

  const toggleSignup = () => {
    setIsOpenLogin(false);
    setIsOpenSignup(!isOpenSignup);
  };

  const toggleForgotPassword = () => {
    setIsOpenLogin(false);
    setIsOpenForgotPassword(!isOpenForgotPassword);
  };

  const clickLoginRoute = () => {
    toggleSignup();
    toggleLogin();
  };

  const clickForgotPasswordRoute = () => {
    toggleLogin();
    toggleForgotPassword();
  };

  const clickForgotPasswordRoute2 = () => {
    toggleForgotPassword();
    toggleSignup();
  };

  const clickSignupRoute = () => {
    toggleLogin();
    toggleSignup();
  };

  const shareGame = async (challengeId: any) => {
    const shareGameURL = `${origin}/game?cid=${challengeId}`;
    return new Promise<void>((resolve, reject) => {
      try {
        copy(shareGameURL);
        resolve();
      } catch (error) {
        reject(error);
      }
    })
      .then(() => {
        notification.success({
          message: "Success",
          description: "Copied the game ID!",
        });
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Failed to copy the game ID.",
        });
      });
  };

  const startGame = (challengeId: any) => {
    if (!currentUser || Object.keys(currentUser).length === 0) {
      notification.warning({
        message: "Warning!",
        description: "Please login!",
      });
      setTimeout(() => {
        setIsOpenSignup(false);
        setIsOpenLogin(!isOpenLogin);
      }, 2000);
      return;
    }

    localStorage.setItem("cid", challengeId.toString());
    const uid: any = currentUser.id;
    let opponentEmail;

    axios
      .post(`${SERVER_URI}/pool-game/start`, {
        cid: challengeId,
        uid,
      })
      .then((res) => {
        if (res.data.success) {
          notification.success({
            message: "Success",
            description: res.data.message,
          });
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          router.push(`/game?cid=${challengeId}`);
        } else {
          notification.warning({
            message: "Warning!",
            description: res.data.message,
          });
        }
      });
    axios.get(`${SERVER_URI}/pool-game/index`).then((res) => {
      opponentEmail = res.data.models[0].opponent_userid.email;
      axios
        .post(`${SERVER_URI}/email`, {
          useremail: opponentEmail,
        })
        .then((res) => {
          // console.log("res.data.msg");
        });
    });
  };

  return (
    <>
      <div className="bg-primary-400 rounded-md">
        <div
          className="px-5 items-center lg:h-20 h-14 flex justify-between cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
          key={prop.index}
        >
          <div className="w-20 flex items-center">
            {prop.quest.coin_type === 1 ? (
              <img
                src="/bitp.png"
                alt=""
                className="h-11 w-11 object-contain"
              />
            ) : prop.quest.coin_type === 2 ? (
              <img
                src="/busd.png"
                alt=""
                className="h-11 w-11 object-contain"
              />
            ) : prop.quest.coin_type === 3 ? (
              <img
                src="/usdt.png"
                alt=""
                className="h-11 w-11 object-contain"
              />
            ) : (
              <img
                src="/cake.png"
                alt=""
                className="h-11 w-11 object-contain"
              />
            )}
            {prop.quest?.create_userid?.avatar ? (
              <img
                src={
                  SERVER_HOST + "/uploads/" + prop.quest?.create_userid?.avatar
                }
                alt=""
                className="h-11 w-11 object-cover rounded-full"
                style={{ marginLeft: "-10px" }}
              />
            ) : (
              <img
                src="/profile.png"
                alt=""
                className="h-11 w-11 object-cover rounded-full"
                style={{ marginLeft: "-10px" }}
              />
            )}
          </div>
          <div className={`flex flex-col items-center`}>
            <div className="text-primary-450 text-sm font-bold">AMOUNT</div>
            <div className=" text-white text-base font-semibold">
              {prop.quest.amount}{" "}
              {prop.quest.coin_type === 1
                ? "BITP"
                : prop.quest.coin_type === 2
                ? "BUSD"
                : prop.quest.coin_type === 3
                ? "USDT"
                : "CAKE"}
            </div>
          </div>
          <div className={`flex flex-col items-center`}>
            <div className="text-primary-450 text-sm font-bold">Creater</div>
            <div className=" text-white text-base font-semibold">
              {"@"}
              {prop.quest?.create_userid?.username}
            </div>
          </div>
          <div className={`flex flex-col items-center hide`}>
            <div className="text-primary-450 text-sm font-bold">Opponent</div>
            <div className=" text-white text-base font-semibold">
              {prop.quest.gametype
                ? "@" + prop.quest.opponent_userid.username
                : "NO USER"}
            </div>
          </div>
          <div className={`flex flex-col items-center hide`}>
            <div className="text-primary-450 text-sm font-bold">Status</div>
            <div className=" text-white text-base font-semibold">
              {prop.quest.status_num <= 1
                ? "WAITING"
                : prop.quest.status_num == 2
                ? "PLAYING"
                : "ENDED"}
            </div>
          </div>
        </div>
        <div
          className={`px-5 flex items-center `}
          style={{
            height: open ? "80px" : "0px",
            transition: "all 0.3s",
            opacity: open ? "1" : "0",
            visibility: open ? "visible" : "hidden",
          }}
        >
          {prop.quest.status_num <= 1 ? (
            <>
              {prop.quest.gametype ? (
                <>
                  {!prop.tabflag ? (
                    <Button
                      variant={variantTypes.secondary}
                      textVol={volumeTypes.sm}
                      onClick={() => startGame(prop.quest._id)}
                      px="xl:px-20 px-5 w-full"
                      text="JOIN GAME"
                    />
                  ) : (
                    <div className="flex w-full">
                      <Button
                        variant={variantTypes.secondary}
                        textVol={volumeTypes.sm}
                        onClick={() => startGame(prop.quest._id)}
                        px="xl:px-5 px-5 mr-2 w-full"
                        text="JOIN GAME"
                      />
                      <Button
                        variant={variantTypes.secondary}
                        textVol={volumeTypes.sm}
                        onClick={() => shareGame(prop.quest._id)}
                        px="xl:px-5 px-5 w-full"
                        text="SHARE"
                      />
                    </div>
                  )}

                  <div className="cursor-pointer xl:hidden self-center">
                    <ArrowDown />
                  </div>
                </>
              ) : (
                <>
                  {!prop.tabflag ? (
                    <Button
                      variant={variantTypes.primary}
                      textVol={volumeTypes.sm}
                      onClick={() => startGame(prop.quest._id)}
                      px="xl:px-20 px-5 w-full"
                      text="JOIN GAME"
                    />
                  ) : (
                    <div className="flex w-full">
                      <Button
                        variant={variantTypes.primary}
                        textVol={volumeTypes.sm}
                        onClick={() => startGame(prop.quest._id)}
                        px="xl:px-5 px-5 mr-2 w-full"
                        text="JOIN GAME"
                      />
                      <Button
                        variant={variantTypes.secondary}
                        textVol={volumeTypes.sm}
                        onClick={() => shareGame(prop.quest._id)}
                        px="xl:px-5 px-5 w-full"
                        text="SHARE"
                      />
                    </div>
                  )}

                  <div className="cursor-pointer xl:hidden self-center">
                    <ArrowDown />
                  </div>
                </>
              )}
            </>
          ) : prop.quest.status_num == 2 ? (
            <>
              <Button
                variant={variantTypes.secondary}
                textVol={volumeTypes.sm}
                px="xl:px-20 px-5"
                text="PLAYING"
                disabled
              />
              <div className="cursor-pointer xl:hidden self-center">
                <ArrowDown />
              </div>
            </>
          ) : (
            <>
              <Button
                variant={variantTypes.secondary}
                textVol={volumeTypes.sm}
                px="xl:px-20 px-5"
                text="ENDED"
                disabled
              />
              <div className="cursor-pointer xl:hidden self-center">
                <ArrowDown />
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        key={0}
        Body={
          <Login
            switch={clickSignupRoute}
            switch2={clickForgotPasswordRoute}
            close={toggleLogin}
          />
        }
        isOpen={isOpenLogin}
        close={toggleLogin}
        isVoid={1}
      />
      <Modal
        key={1}
        Body={<Signup switch={clickLoginRoute} close={toggleSignup} />}
        isOpen={isOpenSignup}
        close={toggleSignup}
        isVoid={2}
      />
      <Modal
        key={2}
        Body={
          <ForgotPassword
            switch={clickForgotPasswordRoute2}
            close={toggleForgotPassword}
          />
        }
        isOpen={isOpenForgotPassword}
        close={toggleForgotPassword}
        isVoid={3}
      />
    </>
  );
};

export default PoolChallenge;
