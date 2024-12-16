import React, { useState } from "react";
import Button, { variantTypes, volumeTypes } from "../Button";
import { notification } from "antd";

export const AdminConfirm: React.FC<{
  onConfirm: (confirmed: boolean) => void;
}> = ({ onConfirm }) => {
  const [password, setPassword] = useState("");
  const handleConfirm = () => {
    if (password === "TapTap123@#") {
      onConfirm(true);
    } else {
      notification.error({ message: "Error", description: "Wrong Password" });
    }
  };

  return (
    <div className="bg-primary-850 p-10">
      <div className="text-center text-2xl font-bold mb-4">
        Enter the Password
      </div>
      <div>
        <input
          type="password"
          className="bg-transparent border  border-[#ffffff30] outline-none text-left p-2 text-md w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        variant={variantTypes.secondary}
        textVol={volumeTypes.sm}
        onClick={handleConfirm}
        px="w-full mt-5"
        text="CONFIRM"
      />
    </div>
  );
};
