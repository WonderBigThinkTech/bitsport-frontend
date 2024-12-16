// <reference path="../../customWindow.d.ts" />
import { IState } from "@/store";
import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Input, Space, notification } from "antd";
// import TextArea from "antd/es/input/TextArea";
// import { google } from "googleapis";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export type ReportProps = {
  message: string;
  link: string;
  title?: string;
  userId?: string;
  status?: number;
  date?: string | number;
};

// export interface CustomWindow extends Window {
//   gapi: any;
// }

// declare var window: CustomWindow;

const { TextArea } = Input;

export const ReportModal: React.FC<{
  open: boolean;
  isBug?: boolean;
  taskId?: string;
  onClose: () => void;
  onReport: (data: ReportProps) => void;
}> = ({ open, onClose, onReport, isBug }) => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [fileuploadLoading, setFileuploadLoading] = useState(false);

  const [formData, setFormData] = useState<ReportProps>({
    message: "",
    title: "",
    link: "",
  });

  useEffect(() => {
    setFormData({ title: "", message: "", link: "" });
  }, [open]);

  const handleSave = () => {
    if (!formData.message || !formData.link) {
      notification.warning({
        message: "Error!",
        description: "Please complete all inputs",
      });
    } else {
      const tempData = {
        ...formData,
        userId: currentUser.username,
        // status: 1,
        date: Date.now(),
      };
      onReport(tempData);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      setFileuploadLoading(true);
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        // Create the query parameter string with the expires value
        const queryParams = `?expires=1y`;

        const response = await fetch(`https://file.io/${queryParams}`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        // return data.link;
        setFormData((prev) => ({ ...prev, link: data.link }));
        setFileuploadLoading(false);
      } catch (error) {
        setFileuploadLoading(false);
        notification.error({
          message: "Error!",
          description: "File Upload Failed!",
        });
      }
    }
  };

  // Example usage

  return (
    <div
      className={`mint-modal-wrapper  fixed top-0 left-0 bottom-0 right-0 flex z-50 bg-[#00000030] ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 bottom-0 z-10"
        onClick={onClose}
      />
      <div className="max-w-[500px] text-white w-full relative bg-[#28282D] m-auto border-[#707070] border py-[33px] max-h-full h-fit overflow-auto z-20">
        <CloseCircleFilled
          className="text-white absolute top-3 right-3 cursor-pointer text-lg"
          onClick={onClose}
        />
        <div className="px-5">
          <h3 className="text-center text-3xl">Report My Task</h3>
          <div className="grid gap-6">
            {isBug && (
              <div>
                <p className="mb-1">Title</p>
                <Input
                  className="bg-transparent text-white rounded-md hover:border-[#ffffff] focus:border-[#ffffff] border-[#ffffff70] placeholder:text-[#ffffff40]"
                  value={formData.title}
                  size="large"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter a Title"
                />
              </div>
            )}
            <div>
              <p className="mb-1">Message</p>
              <Input
                className="bg-transparent text-white rounded-md hover:border-[#ffffff] focus:border-[#ffffff] border-[#ffffff70] placeholder:text-[#ffffff40]"
                value={formData.message}
                size="large"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Enter a Message"
              />
            </div>
            <div>
              <p className="mb-1">Link</p>
              {/* <TextArea
                placeholder="Paste here your task link"
                allowClear
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                className="bg-transparent textarea-task text-white rounded-md border-[#ffffff70] placeholder:text-[#ffffff40]"
              /> */}
              <label htmlFor={fileuploadLoading ? "" : "file-upload"}>
                <Space.Compact style={{ width: "100%", height: "40px" }}>
                  <div className="bg-blue-600 rounded-s-md flex items-center px-3">
                    Upload
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                  />
                  <div className="flex items-center pl-2 bg-transparent text-white rounded-e-md hover:border-[#ffffff] focus:border-[#ffffff] border flex-1 border-[#ffffff70] placeholder:text-[#ffffff40]">
                    {fileuploadLoading ? "Uploading..." : formData.link}
                  </div>
                </Space.Compact>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-7">
              <Button
                className="text-white bg-green-700"
                type="primary"
                onClick={handleSave}
              >
                Report
              </Button>
              <Button
                className="text-white bg-green-700"
                danger
                type="primary"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
