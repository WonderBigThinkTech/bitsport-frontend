import { useDispatch } from "react-redux";
import Table from "@/components/FarmChallengeTable";
import Modal from "@/components/FarmChallengeModal";
import { challengeActions } from "@/store/challenge";
import AdminRoute from "../components/AdminRoute/adminRoute";
import { useState } from "react";
import { AdminConfirm } from "@/components/AdminConfirm";

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
            <div className="flex flex-row justify-between items-center w-[64rem] border-b p-3">
              <h2 className="text-white text-3xl">Admin FarmQuest Challenge</h2>
              <button
                onClick={handleClick}
                className="text-white rounded-md px-4 py-3 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring-violet-300"
              >
                Admin Farm Quest Challenges
              </button>
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
