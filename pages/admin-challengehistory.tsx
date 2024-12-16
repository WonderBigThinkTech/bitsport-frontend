import { useDispatch } from "react-redux";
import Table from "@/components/ChallengeHistory";
import Modal from "@/components/ChallengeModal";
import { challengeActions } from "@/store/challenge";
import AdminRoute from "../components/AdminRoute/adminRoute";
import { AdminConfirm } from "@/components/AdminConfirm";
import { useState } from "react";

const Challenge: React.FC = () => {
  const dispatch = useDispatch();
  const [adminConfirm, setAdminConfirm] = useState(false);

  const handleClick = () => {
    dispatch(challengeActions.setModalFlag({ flag: true, model: {} }));
  };

  return adminConfirm ? (
    <AdminRoute>
      <div className="container mx-auto mt-24 px-4 lg:px-0">
        <div className="flex flex-col justify-center items-center relative">
          <div className="rounded-md border p-10">
            <div className="flex flex-row justify-between items-center w-[64rem] border-b p-3 mb-5">
              <h2 className="text-white text-3xl">Admin Challenge History</h2>
            </div>
            <Table />
          </div>
        </div>
      </div>
      <Modal />
    </AdminRoute>
  ) : (
    <div className="container text-white w-[500px] m-auto py-10">
      <AdminConfirm onConfirm={setAdminConfirm} />
    </div>
  );
};

export default Challenge;
