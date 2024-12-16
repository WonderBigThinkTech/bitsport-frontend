import { Header } from "@/components";
import Footer from "@/components/Footer";
import { Badge, Button, Popconfirm, Switch, notification } from "antd";
import ResponsivePagination from "react-responsive-pagination";
import React, { useEffect, useState } from "react";
import { AddTaskModal, TaskProps } from "@/components/TaskModal";
import { ViewModal } from "@/components/TaskModal/ViewModal";
import axios from "axios";
import { SERVER_URI } from "@/config";
import { AdminConfirm } from "@/components/AdminConfirm";

export default function AdminTask() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  const [adminConfirm, setAdminConfirm] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(allData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  useEffect(() => {
    axios.post(`${SERVER_URI}/task/getAll`).then((res) => {
      setAllData(res.data.models);
    });
  }, []);

  useEffect(() => {
    setTableData(
      allData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [allData, currentPage]);

  const handleRemove = (taskId: string) => {
    axios.post(`${SERVER_URI}/task/remove`, { taskId }).then((res) => {
      setAllData((prev: any) => prev.filter((f: any) => f._id !== taskId));
      notification.success({
        message: "Success",
        description: "A new task has removed successfully.",
      });
    });
  };

  const handleSave = (data: TaskProps) => {
    const newData: any = {
      title: data.title,
      description: data.desc,
      reward: data.reward,
      unit: data.unit,
      status: data.status,
      shared: data.share,
    };
    const apiURL = editItem
      ? `${SERVER_URI}/task/edit`
      : `${SERVER_URI}/task/new`;

    if (editItem) {
      newData.taskId = editItem._id;
    }

    axios.post(apiURL, { ...newData }).then((resp) => {
      if (editItem) {
        setAllData((prev: any) => {
          return prev.map((item: any) => {
            if (item._id === editItem._id) {
              return newData;
            }
            return item;
          });
        });
      } else {
        setAllData((prev: any) => [...prev, resp.data.model]);
      }

      notification.success({
        message: "Success",
        description:
          `${editItem ? "A task has changed" : "A new task has added"}` +
          " successfully.",
      });
      setAddModal(false);
    });
  };

  return (
    <div>
      <AddTaskModal
        open={addModal}
        editItem={editItem}
        onClose={() => {
          setEditItem(null);
          setAddModal(false);
        }}
        onSave={handleSave}
      />
      <ViewModal
        open={viewItem}
        onClose={() => setViewItem(null)}
        item={viewItem}
      />
      <Header />
      {adminConfirm ? (
        <div className="container text-white w-[95%] m-auto py-10">
          <div className="flex justify-between items-center mb-5">
            <p className="text-3xl font-bold">Task Section</p>
            <div>
              <Button className="text-white" onClick={() => setAddModal(true)}>
                Add
              </Button>
            </div>
          </div>
          <div className="admin-task-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th style={{ width: "20%" }}>Title</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th>Status</th>
                  <th>Reward</th>
                  <th>Share</th>
                  <th>Actions</th>
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
                        <Badge
                          count={item.status ? "Opened" : "Closed"}
                          color={item.status ? "green" : "grey"}
                        />
                      </td>
                      <td>
                        {item.reward}{" "}
                        <span className="uppercase">{item.unit}</span>
                      </td>
                      <td>
                        <Badge
                          count={item.shared ? "Shared" : "Unshared"}
                          color={item.shared ? "green" : "grey"}
                        />
                      </td>
                      <td>
                        <div className="flex w-full justify-center">
                          <span
                            className="cursor-pointer underline text-green-300"
                            onClick={() => setViewItem(item)}
                          >
                            View
                          </span>
                          &nbsp;|&nbsp;
                          <span
                            onClick={() => {
                              setEditItem(item);
                              setAddModal(true);
                            }}
                            className="cursor-pointer underline text-blue-300"
                          >
                            Edit
                          </span>
                          &nbsp;|&nbsp;
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
          <div className="max-w-[400px] m-auto responsive-page mt-10">
            <ResponsivePagination
              total={Math.ceil(allData.length / 10)}
              current={currentPage}
              onPageChange={(page) => handlePageChange(page)}
            />
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
}
