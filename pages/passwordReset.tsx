import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import { notification } from "antd";
import { useDispatch } from "react-redux";

import { SERVER_URI } from "../config";
import { authActions } from "../store/auth";

import Input from "../components/Input";
import Button, { butonTypes, variantTypes } from "../components/Button";

const schema = yup.object().shape({
  password: yup.string().required("New Password is required"),
});

export default function passwordReset() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [token, setToken] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [id, setId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm<any>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    data.userId = id;
    data.token = token;

    axios.post(`${SERVER_URI}/reset-password`, data).then((res) => {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Parse the current URL to get the search parameters
    const tokenValue = router.query.token as string;
    const idValue = router.query.id as string;
    setToken(tokenValue);
    setId(idValue);
  }, [router.query]);

  return (
    <div className="w-full">
      <Header />

      <div className="container mx-auto mt-2 px-4 lg:px-0">
        <div className="w-full lg:relative">
          <div className="relative" />
          <div className="flex flex-col justify-center items-center relative">
            <h2 className="text-white mb-4 mt-24 font-bold text-xl px-5 pt-5 xl:pt-0 xl:px-0 xl:text-6xl text-center font-Poppins">
              Reset Password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-80">
              <Input
                name="password"
                label="New Password"
                register={register("password")}
                error={errors.password?.message}
                placeholder="Enter your new password"
                type="password"
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
          </div>
        </div>
      </div>

    </div>
  );
}
