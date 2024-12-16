import { Header } from "@/components";
import { AdminConfirm } from "@/components/AdminConfirm";
import Footer from "@/components/Footer";
import { SERVER_URI } from "@/config";
import { Badge, Button, Input, Popconfirm, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { TextArea } = Input;

const AdminBugPage: React.FC = () => {
  const [allData, setAllData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<any>([]);
  const [viewItem, setViewItem] = useState<any>(null);
  const [note, setNote] = useState("");
  const [adminConfirm, setAdminConfirm] = useState(false);

  useEffect(() => {
    axios.post(`${SERVER_URI}/bug-report/getAll`).then((res) => {
      setAllData(res.data.models);
    });
  }, []);

  useEffect(() => {
    setTableData(
      allData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [allData, currentPage]);

  const handleRemove = (bugId: string) => {
    axios
      .post(`${SERVER_URI}/bug-report/removeBugReport`, { bugId })
      .then((res) => {
        setAllData((prev: any) => prev.filter((f: any) => f._id !== bugId));
        notification.success({
          message: "Success",
          description: "A Bug has removed successfully.",
        });
      });
  };

  const handleChangeStatus = (bugId: string, status: number) => {
    if (note) {
      axios
        .post(`${SERVER_URI}/bug-report/updateBugStatus`, {
          bugId,
          status,
          reportReply: note,
        })
        .then((res) => {
          setAllData((prev: any) =>
            prev.map((item: any) => {
              if (item._id === bugId) {
                return {
                  ...item,
                  status: status,
                  ReportReply: note,
                };
              } else {
                return item;
              }
            })
          );
          setNote("");
          notification.success({
            message: "Success",
            description: "A bug has updated successfully.",
          });
        });
    } else {
      notification.error({
        message: "Error",
        description: "You have to enter the reason.",
      });
    }
  };

  return (
    <div>
      <Header />
      {adminConfirm ? (
        <div className="container text-white w-[95%] m-auto py-10">
          <div className="flex justify-between items-center mb-5">
            <p className="text-3xl font-bold">Bug Section</p>
          </div>
          <div className="admin-task-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th style={{ width: "15%" }}>Title</th>
                  <th style={{ width: "25%" }}>Description</th>
                  <th>Bug Link</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((item: any, key: number) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item.ReporterId}</td>
                      <td>{item.BugTitle}</td>
                      <td>{item.BugDescription}</td>
                      <td>{item.BugReportLink}</td>
                      <td>
                        {item.status === 0 && (
                          <Badge count={"Pending"} color="yellow" />
                        )}
                        {item.status === 1 && (
                          <Badge count={"Accepted"} color="green" />
                        )}
                        {item.status === 2 && (
                          <Badge count={"Denied"} color="red" />
                        )}
                        {item.status === 3 && (
                          <Badge count={"Fixed"} color="blue" />
                        )}
                      </td>
                      <td>{item?.ReportReply}</td>
                      <td>
                        <div className="flex w-full justify-center">
                          {item.status === 1 && (
                            <>
                              <Popconfirm
                                title="Fixed this report"
                                description={
                                  <TextArea
                                    defaultValue={"I fixed this bug."}
                                    placeholder="Write the reason..."
                                    value={note}
                                    allowClear
                                    onChange={(e) => setNote(e.target.value)}
                                    className=""
                                  />
                                }
                                onConfirm={() =>
                                  handleChangeStatus(item._id, 3)
                                }
                                onCancel={() => setNote("")}
                                okText="Yes"
                                okType="danger"
                                cancelText="No"
                              >
                                <span className="text-blue-600 mr-2 cursor-pointer underline">
                                  Fixed
                                </span>
                              </Popconfirm>
                              <span>|</span>
                            </>
                          )}

                          {item.status === 0 && (
                            <>
                              <Popconfirm
                                title="Accept this report"
                                description={
                                  <TextArea
                                    defaultValue={"I accept this report."}
                                    placeholder="Write the reason..."
                                    value={note}
                                    allowClear
                                    onChange={(e) => setNote(e.target.value)}
                                    className=""
                                  />
                                }
                                onConfirm={() =>
                                  handleChangeStatus(item._id, 1)
                                }
                                okText="Yes"
                                okType="danger"
                                cancelText="No"
                              >
                                <span className="text-green-600 ml-2 mr-2 cursor-pointer underline">
                                  Accept
                                </span>
                              </Popconfirm>
                              <span>|</span>
                              <Popconfirm
                                title="Deny this report"
                                description={
                                  <TextArea
                                    defaultValue={"I deny this report."}
                                    placeholder="Write the reason..."
                                    value={note}
                                    allowClear
                                    onChange={(e) => setNote(e.target.value)}
                                    className=""
                                  />
                                }
                                onConfirm={() =>
                                  handleChangeStatus(item._id, 2)
                                }
                                onCancel={() => setNote("")}
                                okText="Yes"
                                okType="danger"
                                cancelText="No"
                              >
                                <span className="ml-2 text-red-600 mr-2 cursor-pointer underline">
                                  Deny
                                </span>
                              </Popconfirm>
                              <span>|</span>
                            </>
                          )}
                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => handleRemove(item._id)}
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                          >
                            <span className="cursor-pointer ml-2 underline text-red-300">
                              Delete
                            </span>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container text-white w-[500px] m-auto py-10">
          <AdminConfirm onConfirm={setAdminConfirm} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminBugPage;
