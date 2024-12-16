import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import * as yup from "yup";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { notification } from "antd";

import Input from "../Input";
import Button, { butonTypes, variantTypes } from "../Button";

import { authActions } from "../../store/auth";
import { SERVER_URI } from "../../config";

import { Check } from "@/public/icons";
import Logo from "@/public/logo2.svg";

const schema = yup.object().shape({
  email: yup.string().email("Email is Invalid").required("Email is required"),
});

const ForgotPassword = (props: { close: () => void; switch: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    axios.post(`${SERVER_URI}/forgot-password`, data).then((res) => {
      if (res.data.success) {
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
  };
  return (
    <div className="w-full">
      <p className="text-white text-2xl lg:text-3xl font-bold text-center">
        Forgot Password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        <Input
          name="email"
          label="EMAIL"
          register={register("email")}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        <div className="lg:mt-12 mt-10 w-full">
          <Button
            variant={variantTypes.full}
            isFull
            type={butonTypes.submit}
            px="px-4"
            text="Submit"
          />
        </div>
      </form>

      <div className="lg:mt-24 mt-14 flex flex-col justify-center items-center lg:gap-10 gap-16">
        <div
          onClick={props.switch}
          className="font-medium text-lg text-white cursor-pointer"
        >
          New to BitPool ?{" "}
          <span className="text-secondary-100">Create a BitPool Account</span>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <div className="lg:text-xl text-base text-white font-light">
            POWERED BY
          </div>
          <Image
            priority={true}
            height={30}
            width={130}
            src={Logo}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
