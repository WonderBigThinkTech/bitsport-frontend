import { SERVER_URI } from "@/config";
import { CloseCircleFilled, LinkOutlined } from "@ant-design/icons";
import { Badge, Button, Input, Popconfirm, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";

const { TextArea } = Input;

export const ViewModal: React.FC<{
  open: boolean;
  item: any;
  onClose: () => void;
}> = ({ onClose, open, item }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [note, setNote] = useState("I don't like this Report.");

  useEffect(() => {
    if (item) {
      axios
        .post(`${SERVER_URI}/tasksuccess/adminGetTaskData`, {
          taskId: item._id,
        })
        .then((res) => {
          setAllData(res.data.models);
        });
    }
  }, [item]);

  useEffect(() => {
    setTableData(
      allData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [allData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(allData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  const handleAccept = (id: string) => {
    axios
      .post(`${SERVER_URI}/tasksuccess/adminUpdateTaskStatus`, {
        taskSuccessId: id,
        taskStatus: 1,
        statusNote: "",
      })
      .then((res) => {
        setAllData((prev: any) =>
          prev.map((titem: any) => {
            if (titem._id === id) {
              return { ...titem, taskStatus: 1 };
            }
            return titem;
          })
        );
      });
  };

  const handleDeny = (id: string) => {
    if (note !== "") {
      axios
        .post(`${SERVER_URI}/tasksuccess/adminUpdateTaskStatus`, {
          taskSuccessId: id,
          taskStatus: 2,
          statusNote: note,
        })
        .then((res) => {
          console.log(res.data);
          setAllData((prev: any) =>
            prev.map((titem: any) => {
              if (titem._id === id) {
                return { ...titem, taskStatus: 2 };
              }
              return titem;
            })
          );
        });
    } else {
      notification.error({
        message: "Warning!",
        description: "Please give the reason why you deny this report.",
      });
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
      <div className="max-w-[768px] text-white w-full relative bg-[#28282D] m-auto border-[#707070] border py-[33px] max-h-full h-fit overflow-auto z-20">
        <CloseCircleFilled
          className="text-white absolute top-3 right-3 cursor-pointer text-lg"
          onClick={onClose}
        />
        <div className="px-5">
          <h1 className="text-center text-3xl mt-5 flex justify-between">
            <span>{item?.title}</span>
            <div>
              <Badge
                className="site-badge-count-109"
                count={item?.status ? "Opened" : "Closed"}
                color={item?.status ? "green" : "grey"}
              />{" "}
              <Badge
                className="site-badge-count-109"
                count={item?.shared ? "Shared" : "Unshared"}
                color={item?.shared ? "green" : "grey"}
              />
            </div>
          </h1>
          <p className="text-sm mb-1 text-[#ffffffa0]">Description: </p>
          <p className=" text-lg">{item?.description}</p>
          <p className="text-sm mb-1 text-[#ffffffa0]">Reward: </p>
          <p className=" text-lg">
            {item?.reward} <span className="uppercase">{item?.unit}</span>
          </p>
          <p className="text-sm mb-1 text-[#ffffffa0]">Reports: </p>
          <div className="admin-task-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th style={{ width: "30%" }}>Message</th>
                  <th>Link</th>
                  <th>Date</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length ? (
                  tableData.map((item: any, key: number) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item.userId}</td>
                      <td>{item.reportDesc}</td>
                      <td>
                        <a href={item.reportLink} target="_blank">
                          <LinkOutlined />
                        </a>
                      </td>
                      <td>{new Date(item.reportDate).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center justify-center">
                          {item.taskStatus === 0 && (
                            <div className="flex items-center justify-center">
                              <Popconfirm
                                title="Accept this report"
                                description={
                                  "Are you sure to accept this report?"
                                }
                                onConfirm={() => handleAccept(item._id)}
                                okText="Yes"
                                okType="danger"
                                cancelText="No"
                              >
                                <span className="text-green-600 mr-2 cursor-pointer underline">
                                  Accept
                                </span>
                              </Popconfirm>
                              <span>|</span>
                              <Popconfirm
                                title="Deny this report"
                                description={
                                  <TextArea
                                    placeholder="Write the reason..."
                                    value={note}
                                    allowClear
                                    onChange={(e) => setNote(e.target.value)}
                                    className=""
                                  />
                                }
                                onConfirm={() => handleDeny(item._id)}
                                onCancel={() => setNote("")}
                                okText="Yes"
                                okType="danger"
                                cancelText="No"
                              >
                                <span className="ml-2 text-red-600 cursor-pointer underline">
                                  Deny
                                </span>
                              </Popconfirm>
                            </div>
                          )}
                          {item.taskStatus === 1 && (
                            <Badge count="Accepted" color="green" />
                          )}
                          {item.taskStatus === 2 && (
                            <Badge count="Denied" color="red" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={6}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="max-w-[400px] m-auto responsive-page mt-3">
              <ResponsivePagination
                total={Math.ceil(allData.length / 10)}
                current={currentPage}
                onPageChange={(page) => handlePageChange(page)}
              />
            </div>
          </div>
          <div className="mt-10 flex">
            <Button
              className="bg-green-500 text-white w-[200px] m-auto"
              type="primary"
              onClick={onClose}
              //   danger
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
