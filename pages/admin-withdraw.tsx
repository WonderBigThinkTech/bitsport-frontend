import Table from "../components/WithdrawTable";
import AdminRoute from "../components/AdminRoute/adminRoute";
import { AdminConfirm } from "@/components/AdminConfirm";
import { useState } from "react";

const Withdraw = () => {
  const [adminConfirm, setAdminConfirm] = useState(false);
  return adminConfirm ? (
    <AdminRoute>
      <div className="container mx-auto mt-24 px-4 lg:px-0">
        <div className="flex flex-col justify-center items-center relative">
          <div className="rounded-md border p-10">
            <div className="flex flex-row justify-between items-center w-[64rem] border-b p-3">
              <h2 className="text-white text-3xl">Admin-Withdraw</h2>
            </div>
            <Table />
          </div>
        </div>
      </div>
    </AdminRoute>
  ) : (
    <div className="container text-white w-[500px] m-auto py-10">
      <AdminConfirm onConfirm={setAdminConfirm} />
    </div>
  );
};

export default Withdraw;
