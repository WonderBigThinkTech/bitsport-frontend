import Link from "next/link";
import Image from "next/image";
import * as yup from "yup";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { butonTypes, variantTypes } from "../Button";
import { Check } from "@/public/icons";
import Logo from "@/public/logo2.svg";
import Input from "../Input";
import { SERVER_URI } from "@/config";
import { authActions } from "@/store/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup.string().email("Email is Invalid").required("Email is required"),
  password: yup.string().required("Password is required"),
  username: yup
    .string()
    .test(
      "test-welcom",
      "Please remove space character",
      (value: any) => value === value.split(" ").join("")
    )
    .required("User name is required"),
});

const Signup = (props: { close: () => void; switch: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({ resolver: yupResolver(schema) });

  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    await fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((dat) => {
        data.ipAddress = dat.ip;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await axios.post(`${SERVER_URI}/signup`, data).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: "You're registered successfully!",
        });
        localStorage.setItem("token", res.data.token);
        dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        props.close();

        const redirectedFromGameLink = window.localStorage.getItem(
          "redirectedFromGameLink"
        );
        if (redirectedFromGameLink === "true") {
          // Show the alert on the homepage
          setTimeout(() => {
            notification.info({
              message: "Notification",
              description: "Please deposit to accept challenge",
            });
          }, 2000);

          // Clear the flag from localStorage after showing the alert
          window.localStorage.removeItem("redirectedFromGameLink");
        }
        reset();
        if (router.query.signin) {
          if (localStorage.getItem("trypage") == "buy_bitp")
            router.push("/buy-bitp");
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
        Sign Up to your BitPool Account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="mt-10"
      >
        <Input
          name="username"
          label="USERNAME"
          register={register("username")}
          error={errors.username?.message}
          placeholder="Enter your username"
        />
        <Input
          name="signup_email"
          label="EMAIL"
          register={register("email")}
          error={errors.email?.message}
          placeholder="Enter your email"
        />
        <Input
          name="signup_password"
          label="PASSWORD"
          register={register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
          type="password"
        />

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
            text="SIGN UP"
          />
        </div>
      </form>

      <div className="lg:mt-24 mt-14 flex flex-col justify-center items-center lg:gap-10 gap-16">
        <div
          onClick={props.switch}
          className="font-medium text-lg text-white cursor-pointer"
        >
          Already have an account ?{" "}
          <span className="text-secondary-100">Sign In</span>
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

export default Signup;
