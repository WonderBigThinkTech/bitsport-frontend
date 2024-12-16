import React, { useState, useRef, useEffect } from "react";
import USDT from "@/public/usdt.png";
import CAKE from "@/public/cake.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import { Check } from "@/public/icons";
import Select from "../Select/challengeSelect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input";
import { notification } from "antd";
import Button, { butonTypes, variantTypes } from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store";
import { SERVER_URI } from "@/config";
import { poolchallengeActions } from "../../store/poolchallenge";

import axios from "axios";

const userchallenge = (props: { close: () => void }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useSelector((state: IState) => state.auth);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [remember, setRemember] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [coin, setCoin] = useState("USDT");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const icon = useRef<object>({});

  const getPoolChallengeData = () => {
    axios.get(`${SERVER_URI}/pool-game/index`).then((res) => {
      dispatch(poolchallengeActions.setModalData(res.data.models));
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getPoolChallengeData();
  }, []);

  const schema = yup.object().shape({
    username: yup.string().required("User name is required"),
    amount: yup.string().required("Amount is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm<any>({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    if (!currentUser) {
      notification.warning({
        message: "Warning!",
        description: "Please login!",
      });
      return;
    } else {
      reset();
      const paramData = {
        amount: data.amount,
        opponent_username: data.username,
        coin_type:
          coin === "BITP" ? 1 : coin === "BUSD" ? 2 : coin === "USDT" ? 3 : 4,
        create_userid: currentUser.id,
      };

      axios.post(`${SERVER_URI}/pool-game/save`, paramData).then((res) => {
        if (res.data.success) {
          getPoolChallengeData();
          notification.success({
            message: "Success!",
            description: res.data.message,
          });
        } else {
          notification.warning({
            message: "Error!",
            description: res.data.message,
          });
        }
      });
      props.close();
    }
  };

  const items = [
    {
      icon: BITP,
      name: "BITP",
    },
    {
      icon: BUSD,
      name: "BUSD",
    },
    {
      icon: USDT,
      name: "USDT",
    },
    {
      icon: CAKE,
      name: "CAKE",
    },
  ];

  if (coin !== "") {
    items.forEach((p) => {
      if (coin === "USD") {
        icon.current = p.icon;
      } else if (coin === p.name) {
        icon.current = p.icon;
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="mt-1 w-full"
    >
      <div className="flex flex-col lg:flex-row justify-between w-full gap-2">
        <Input
          name="username"
          label="Enter Opponent Username"
          register={register("username")}
          error={errors.username?.message}
          placeholder="@bitsport"
        />
        <Select
          key={0}
          name={coin === "USD" ? "USD" : coin}
          icon={icon.current}
          handleChange={(value) => setCoin(value)}
          items={items}
          label="WALLET BALANCE"
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between w-full gap-2">
        <Input
          name="amount"
          label="Amount"
          register={register("amount")}
          error={errors.amount?.message}
          placeholder="Amount"
        />
      </div>
      <div className="mt-5 flex items-center align-center gap-4">
        <div
          onClick={() => setRemember(!remember)}
          className={`h-4 w-4 rounded transition-all duration-300 flex justify-center cursor-pointer items-center ${
            !remember
              ? "border border-primary-750 bg-transparent"
              : "bg-secondary-100 border border-secondary-100"
          }`}
        >
          {remember && <Check />}
        </div>
        <p className="text-based text-white font-medium mb-0">
          Accept terms & conditions
        </p>
      </div>
      <div
        className="lg:mt-10 mt-10 w-full"
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Button
          variant={variantTypes.challenge}
          isW80
          type={butonTypes.submit}
          px="px-4"
          text="SUBMIT"
        />
      </div>
    </form>
  );
};

export default userchallenge;
