import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IState } from "@/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { SERVER_URI } from "@/config";
import Button, { butonTypes, variantTypes } from "../Button";
import { notification } from "antd";

const ProfilePwdModal = (props: { close: (value: string) => void }) => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    currentPwd: yup.string().required('Please enter your old password'),
    newPwd: yup
      .string()
      .required('Please enter a new password')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPwd: yup
      .string()
      .oneOf([yup.ref('newPwd')], 'Passwords must match')
      .required('Please confirm your new password'),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitButtonClicked = (data: any) => {
    const { currentPwd, newPwd, confirmPwd } = data;
    
    const userData = {
      userID: currentUser.id,
      currentPwd: data.currentPwd,
      newPwd: data.newPwd,
      confirmPwd: data.confirmPwd,
    };
    
    axios.post(`${SERVER_URI}/profile/pwd`, userData).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: res.data.message,
        });
        
        // Close the modal after a successful post request
        props.close(currentPwd);
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
      <div className="lg:text-2xl text-xl font-bold text-primary-900 mb-5">PASSWORD</div>
      <div className="grid grid-cols-1 gap-2 lg:flex-row justify-between w-full">
        <input
          type="password"
          placeholder="Old Password"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          {...register('currentPwd')}
        />
        {errors.currentPwd && <div style={{ color: "#d8253c"}}>{errors.currentPwd.message as React.ReactNode}</div>}
        <input
          type="password"
          placeholder="New Password"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          {...register('newPwd')}
        />
        {errors.newPwd && <p style={{ color: "#d8253c"}}>{errors.newPwd.message as React.ReactNode}</p>}
        <input
          type="password"
          placeholder="Confirm Password"
          className="border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded"
          {...register('confirmPwd')}
        />
        {errors.confirmPwd && <p style={{ color: "#d8253c"}}>{errors.confirmPwd.message as React.ReactNode}</p>}
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
          onClick={handleSubmit(onSubmitButtonClicked)}
          className="mt-14 bg-secondary-300 text-white w-full rounded font-bold text-xl h-14"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfilePwdModal;
