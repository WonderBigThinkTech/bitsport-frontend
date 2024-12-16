import { Header } from "@/components";
import Footer from "@/components/Footer";
import { ReportModal, ReportProps } from "@/components/TaskModal/ReportModal";
import { SERVER_URI } from "@/config";
import { IState } from "@/store";
import { Badge, Button, Popconfirm, notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ResponsivePagination from "react-responsive-pagination";

const BugPage: React.FC = () => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [reportModal, setReportModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser.username) {
      axios
        .post(`${SERVER_URI}/bug-report/getByUserId`, {
          userId: currentUser.username,
        })
        .then((res) => {
          console.log(res.data);
          setAllData(res.data.model);
        });
    }
  }, [currentUser.username]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/?signin=true");
    }
  }, []);
  useEffect(() => {}, []);

  useEffect(() => {
    setTableData(
      allData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [allData]);

  const handleReport = (data: ReportProps) => {
    const newData = {
      userId: data.userId,
      BugTitle: data.title,
      BugDescription: data.message,
      BugReportLink: data.link,
    };
    axios
      .post(`${SERVER_URI}/bug-report/create`, { ...newData })
      .then((res) => {
        console.log(res.data);
        setReportModal(false);
        setAllData(
          (prev: any) => [...prev, res.data.model]
          //   prev.map((item: any) => {
          //     if (item._id === reportModal) {
          //       return { ...item, status: 0 };
          //     } else {
          //       return item;
          //     }
          //   })
        );
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(allData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  const handleRemove = (bugId: string) => {
    axios
      .post(`${SERVER_URI}/bug-report/removeBugReport`, { bugId })
      .then((res) => {
        setAllData((prev: any) => prev.filter((f: any) => f._id !== bugId));
        notification.success({
          message: "Success",
          description: "A new task has removed successfully.",
        });
      });
  };

  return (
    <div className="">
      <ReportModal
        onReport={handleReport}
        open={reportModal}
        isBug={true}
        // taskId={reportModal}
        onClose={() => setReportModal(false)}
      />
      <Header />
      <div className="container text-white w-[95%] m-auto py-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-3xl font-bold">Report a Bug</p>
          <div>
            <Button className="text-white" onClick={() => setReportModal(true)}>
              Report
            </Button>
          </div>
        </div>
        <div className="admin-task-table w-">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th style={{ width: "20%" }}>Title</th>
                <th style={{ width: "35%" }}>Description</th>
                <th>Link</th>
                <th>Status</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item: any, key: number) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
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
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleRemove(item._id)}
                        okText="Yes"
                        okType="danger"
                        cancelText="No"
                      >
                        <span className="cursor-pointer underline text-red-300">
                          Delete
                        </span>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan={5}>
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="max-w-[400px] m-auto responsive-page mt-10">
          <ResponsivePagination
            total={Math.ceil(allData.length / 10)}
            current={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BugPage;
