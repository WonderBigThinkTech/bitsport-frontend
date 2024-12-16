import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IState } from "@/store";
import USDT from "@/public/usdt.png";
import CAKE from "@/public/cake.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import { Check } from "@/public/icons";
import Select from "../Select/challengeSelect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { SERVER_URI } from "@/config";
import * as yup from "yup";
import Input2 from "../Input2";
import Button, { butonTypes, variantTypes } from "../Button";
import { notification } from "antd";
import { poolchallengeActions } from "../../store/poolchallenge";

const ProfileNameModal = (props: { close: (value: string) => void }) => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(currentUser?.firstname || "");
  const [lastName, setLastName] = useState(currentUser?.lastname || "");
  const [userName, setUserName] = useState(currentUser?.username || "");

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstname || "");
      setLastName(currentUser.lastname || "");
      setUserName(currentUser.username || "");
    }
  }, [currentUser]);

  // const getPoolChallengeData = () => {
  //   axios.get(`${SERVER_URI}/pool-game/index`).then((res) => {
  //     dispatch(poolchallengeActions.setModalData(res.data.models));
  //   });
  // };

  // useEffect(() => {
  //   getPoolChallengeData();
  // }, []);

  const onSubmitButtonClicked = () => {
    if (userName === "") {
      notification.warning({
        message: "Warning!",
        description: "Please input your username",
      });
      return;
    }

    const userData = {
      userID: currentUser.id,
      firstName,
      lastName,
      userName,
    };

    axios.post(`${SERVER_URI}/profile/names`, userData).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: res.data.message,
        });
        
        // Close the modal after a successful post request
        props.close(userName);
      } else {
        notification.warning({
          message: "Warning!",
          description: res.data.message,
        });
      }
    });
    // next();
  };

  return (
    <div className="mt-1 w-full">
      <div className="lg:text-2xl text-xl font-bold text-primary-900 mb-5">PROFILE</div>
      <div className="grid grid-cols-2 gap-2 lg:flex-row justify-between w-full">
        <input
          type="string"
          placeholder="First Name"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          value={firstName}
          onChange={(e) => setFirstName(String(e.target.value))}
        />
        <input
          type="string"
          placeholder="Last Name"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          value={lastName}
          onChange={(e) => setLastName(String(e.target.value))}
        />
        <input
          type="string"
          placeholder="User Name"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          value={userName}
          onChange={(e) => setUserName(String(e.target.value))}
        />
      </div>
      <div
        className="lg:mt-10 mt-10 w-full"
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <button
          onClick={() => onSubmitButtonClicked()}
          className="mt-14 bg-secondary-300 text-white w-full rounded font-bold text-xl h-14"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileNameModal;
