import { useEffect, useState } from "react";
import { Ball, Cancel } from "@/public/icons";
import { motion } from "framer-motion";

interface IModal {
  Body: any;
  isOpen: boolean;
  close: () => void;
  isVoid: number;
}

const Modal = ({ Body, isOpen = false, close, isVoid }: IModal) => {
  const [open, setOpen] = useState(isOpen);

  const handleCancel = (bypass?: boolean) => {
    if (bypass) {
      setOpen(!open);
      setTimeout(() => {
        close();
      }, 500);
    }
    if (!isVoid) {
      setOpen(!open);
      setTimeout(() => {
        close();
      }, 500);
    }
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      <motion.div
        animate={{ opacity: open ? 1 : 0 }}
        exit={{ opacity: open ? 0 : 1 }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        initial={false}
        onClick={() => handleCancel()}
        className={`${
          isOpen ? "block" : "hidden"
        } fixed modal-container z-50 top-0 right-0 min-h-screen w-full flex flex-col justify-center items-center`}
      >
        <div
          className={`${
            isVoid === 4
              ? "hidden"
              : "relative top-7 hidden z-50 lg:inline-block"
          }`}
        >
          <Ball fill="#ffffff" width="57" height="57" />
        </div>

        <div
          className={`lg:w-modal top-12 lg:top-0 z-40 px-5 flex flex-col items-center relative lg:rounded-sm w-full min-h-90vh lg:min-h-30vh max-h-90vh lg:max-h-modal overflow-auto ${
            isVoid < 4
              ? "modal py-10 lg:py-14"
              : "bg-primary-850 pt-4 pb-10 lg:pb-14"
          }`}
        >
          <div className="h-10 flex justify-end w-full">
            <div
              onClick={() => handleCancel(true)}
              className={`h-5 w-5 self-end ${
                isVoid < 4 ? "mb-16" : "mb-7"
              } cursor-pointer rounded-full bg-white flex justify-center items-center`}
            >
              <Cancel />
            </div>
          </div>
          {Body}
        </div>
      </motion.div>
    </>
  );
};

export default Modal;
