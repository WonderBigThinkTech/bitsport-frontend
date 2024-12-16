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
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup.string().email("Email is Invalid").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = (props: {
  close: () => void;
  switch: () => void;
  switch2: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({ resolver: yupResolver(schema) });

  const router = useRouter();

  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    axios.post(`${SERVER_URI}/signin`, data).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: "You're signed successfully!",
        });

        localStorage.setItem("token", res.data.token);
        const userInfo = jwtDecode(res.data.token);
        console.log("userInfo", userInfo);
        dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        props.close();
        reset();
        console.log('router', router)
        if (router.query.signin) {
          if (localStorage.getItem("trypage") == "buy_bitp")
            router.push("/farmearn");
          else if (localStorage.getItem("trypage") == "farmearn")
            router.push("/farmearn");

          window.localStorage.removeItem("trypage");
        }
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
        Sign In to your BitPool Account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        <Input
          name="email"
          label="EMAIL"
          register={register("email")}
          error={errors.email?.message}
          placeholder="Enter your email"
        />
        <Input
          name="password"
          label="PASSWORD"
          register={register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
          type="password"
        />

        <div
          onClick={props.switch2}
          className="font-medium text-lg text-white cursor-pointer"
        >
          Forgot Password ?{" "}
          <span className="text-secondary-100">Reset Password</span>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <div
            onClick={() => setRemember(!remember)}
            className={`h-8 w-8 rounded transition-all duration-300 flex justify-center cursor-pointer items-center ${
              !remember
                ? "border border-primary-750 bg-transparent"
                : "bg-secondary-100 border border-secondary-100"
            }`}
          >
            {remember && <Check />}
          </div>
          <p className="text-xl text-white font-medium my-auto">Remember me</p>
        </div>

        <div className="lg:mt-12 mt-10 w-full">
          <Button
            variant={variantTypes.full}
            isFull
            type={butonTypes.submit}
            px="px-4"
            text="SIGN IN"
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

export default Login;
