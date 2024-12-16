import { Header } from "@/components";
import Footer from "@/components/Footer";
import { ReportModal, ReportProps } from "@/components/TaskModal/ReportModal";
import { Badge, Button } from "antd";
import ResponsivePagination from "react-responsive-pagination";
import React, { useEffect, useState } from "react";
import { SERVER_URI } from "@/config";
import axios from "axios";
import { useSelector } from "react-redux";
import { IState } from "@/store";
import { useRouter } from "next/router";

const Tasks = () => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [reportModal, setReportModal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {
    if (currentUser.id) {
      axios.post(`${SERVER_URI}/task/getAll`).then((resT) => {
        axios
          .post(`${SERVER_URI}/tasksuccess/userGetTaskData`, {
            userId: currentUser.username,
          })
          .then((resR) => {
            console.log(resR.data);
            setAllData(
              resT.data.models
                .filter((f: any) => f.status && f.shared)
                .map((item: any) => {
                  const reportData = resR.data.models.filter(
                    (f: any) => f.taskId === item._id
                  );
                  return {
                    ...item,
                    reportStatus: reportData[0] ? reportData[0].taskStatus : -1,
                    statusNote: reportData[0]?.statusNote,
                  };
                })
            );
          });
      });
    }
  }, [currentUser.id]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/?signin=true");
    }
  }, []);

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

  const handleReport = (data: ReportProps) => {
    const newData = {
      taskId: reportModal,
      userId: data.userId,
      reportDate: data.date,
      reportDesc: data.message,
      reportLink: data.link,
    };
    axios
      .post(`${SERVER_URI}/tasksuccess/userReportTask`, { ...newData })
      .then((res) => {
        setReportModal("");
        setAllData((prev: any) =>
          prev.map((item: any) => {
            if (item._id === reportModal) {
              return { ...item, reportStatus: 0 };
            } else {
              return item;
            }
          })
        );
      });
  };

  return (
    <div>
      <ReportModal
        onReport={handleReport}
        open={reportModal !== ""}
        taskId={reportModal}
        onClose={() => setReportModal("")}
      />
      <Header />
      <div className="container text-white w-[95%] m-auto py-10">
        <h1 className="text-center my-7 text-5xl">BITPOOL TASK LIST</h1>
        <div className="admin-task-table w-">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th style={{ width: "20%" }}>Title</th>
                <th style={{ width: "45%" }}>Description</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item: any, key: number) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.reward}{" "}
                      <span className="uppercase">{item.unit}</span>
                    </td>
                    <td>
                      {item.reportStatus === -1 && (
                        // <Badge count={"Not Reported"} color="#ffffff80" />
                        <Button
                          className="text-white bg-blue-500"
                          type="primary"
                          onClick={() => setReportModal(item._id)}
                        >
                          Report
                        </Button>
                      )}
                      {item.reportStatus === 0 && (
                        <Badge count={"Pending"} color="yellow" />
                      )}
                      {item.reportStatus === 1 && (
                        <Badge count={"Accepted"} color="green" />
                      )}
                      {item.reportStatus === 2 && (
                        <Badge count={"Denied"} color="red" />
                      )}
                    </td>
                    <td>
                      {item?.statusNote}
                      {/* <Button
                        className="text-white bg-blue-500"
                        type="primary"
                        onClick={() => setReportModal(item._id)}
                      >
                        Report
                      </Button> */}
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

export default Tasks;
