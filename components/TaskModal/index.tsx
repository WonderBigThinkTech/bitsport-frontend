import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Input, InputNumber, Select, Switch, notification } from "antd";
// import TextArea from "antd/es/input/TextArea";
// import { Input } from "antd";
import React, { useEffect, useState } from "react";
const { TextArea } = Input;
export type TaskProps = {
  title: string;
  desc?: string;
  status: boolean;
  reward: number;
  unit: string;
  share: boolean;
};

export const AddTaskModal: React.FC<{
  open: boolean;
  editItem: any;
  onClose: () => void;
  onSave: (data: TaskProps) => void;
}> = ({ open, onClose, editItem, onSave }) => {
  const [formData, setFormData] = useState<TaskProps>({
    reward: 0,
    share: false,
    status: false,
    title: "",
    unit: "busd",
    desc: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        reward: editItem.reward,
        share: editItem.shared,
        status: editItem.status,
        title: editItem.title,
        unit: editItem.unit,
        desc: editItem.description,
      });
    }
  }, [editItem]);

  useEffect(() => {
    if (!open) {
      setFormData({
        reward: 0,
        share: false,
        status: false,
        title: "",
        unit: "busd",
        desc: "",
      });
    }
  }, [open]);

  const handleSave = () => {
    if (!formData.title) {
      notification.warning({
        message: "Error!",
        description: "Please complete all inputs",
      });
    } else {
      const tempData = {
        ...formData,
      };
      onSave(tempData);
    }
  };
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
          <h3 className="text-center text-3xl">
            {editItem ? "Edit a Task" : "Add a New Task"}
          </h3>
          <div className="grid gap-6">
            <div>
              <p className="mb-1">Title</p>
              <Input
                className="bg-transparent text-white rounded-md hover:border-[#ffffff] focus:border-[#ffffff] border-[#ffffff70] placeholder:text-[#ffffff40]"
                value={formData.title}
                size="large"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter new Task Title"
              />
            </div>
            <div>
              <p className="mb-1">Description</p>
              <TextArea
                placeholder="Write the task description..."
                value={formData.desc}
                allowClear
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desc: e.target.value }))
                }
                className="bg-transparent textarea-task text-white rounded-md border-[#ffffff70] placeholder:text-[#ffffff40]"
              />
            </div>
            <div>
              <p className="mb-1">Reward</p>
              <div className="flex">
                <InputNumber
                  className="bg-transparent input-number-task rounded-md border-[#ffffff70] flex-1"
                  min={0}
                  value={formData.reward}
                  max={100000000000}
                  size="large"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reward: Number(e) }))
                  }
                />
                <Select
                  value={formData.unit}
                  style={{ width: 100 }}
                  className="task-select-box"
                  size="large"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e }))
                  }
                  options={[
                    { value: "busd", label: "BUSD" },
                    { value: "usdt", label: "USDT" },
                    { value: "bitp", label: "BITP" },
                    { value: "cake", label: "CAKE" },
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <p className="mb-0 mr-4">Status</p>{" "}
                <Switch
                  checkedChildren="Opened"
                  unCheckedChildren="Closed"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e }))
                  }
                  checked={formData.status}
                />
              </div>
              <div className="flex items-center">
                <p className="mb-0 mr-4">Share</p>{" "}
                <Switch
                  checkedChildren="Shared"
                  unCheckedChildren="Unshared"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, share: e }))
                  }
                  checked={formData.share}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-7">
              <Button
                className="text-white bg-green-700"
                type="primary"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="text-white bg-green-700"
                danger
                type="primary"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
