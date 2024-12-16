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
import Input from "../Input";
import Button, { butonTypes, variantTypes } from "../Button";
import { notification } from "antd";
import { poolchallengeActions } from "../../store/poolchallenge";

const openchallenge = (props: { close: () => void }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useSelector((state: IState) => state.auth);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [remember, setRemember] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [coin, setCoin] = useState("BITP");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [diff, setDiff] = useState("Hard");
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
        opponent_username: "",
        coin_type:
          coin === "BITP" ? 1 : coin === "BUSD" ? 2 : coin === "USDT" ? 3 : 4,
        create_userid: currentUser.id,
      };

      axios
        .post(`${SERVER_URI}/pool-game/opensave`, paramData)
        .then((res) => {
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
        })
        .catch((err) => {
          notification.warning({
            message: "Error!",
            description: err,
          });
        });
      props.close();
    }
  };

  const diffitems = [
    {
      name: "Hard",
    },
    {
      name: "Medium",
    },
    {
      name: "Easy",
    },
  ];

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
        <Select
          key={0}
          name={coin === "USD" ? "USD" : coin}
          icon={icon.current}
          handleChange={(value) => setCoin(value)}
          items={items}
          label="Currency"
        />
        <Select
          key={1}
          name={diff}
          icon=""
          handleChange={(value) => setDiff(value)}
          items={diffitems}
          label="Difficulty"
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

export default openchallenge;
