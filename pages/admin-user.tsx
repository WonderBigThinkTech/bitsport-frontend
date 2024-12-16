import { Header } from "@/components";
import { AdminConfirm } from "@/components/AdminConfirm";
import Footer from "@/components/Footer";
import { SERVER_URI } from "@/config";
import { Badge, Popconfirm, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";

const AdminUser: React.FC = () => {
  const [tableData, setTableData] = useState<any>([]);

  const [allData, setAllData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [adminConfirm, setAdminConfirm] = useState(false);

  const [filterData, setFilterData] = useState<any>([]);
  const [filterTxt, setFilterTxt] = useState<string>("");

  useEffect(() => {
    if (allData && allData.length != 0) {
      if (filterTxt != "") {
        const newData = allData.filter((item: any) => {
          if (
            item.username
              .toString()
              .toUpperCase()
              .indexOf(filterTxt.toUpperCase()) > -1
          ) {
            return true;
          }
        });
        setFilterData(newData);
      } else {
        setFilterData(allData);
      }
    }
  }, [filterTxt, allData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(filterData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  useEffect(() => {
    axios.post(`${SERVER_URI}/getAllUser`).then((res) => {
      setAllData(res.data.models);
    });
  }, []);

  useEffect(() => {
    setTableData(
      filterData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [filterData, currentPage]);

  const handleRemove = (userId: string) => {
    axios.post(`${SERVER_URI}/removeUser`, { userId }).then((res) => {
      setAllData((prev: any) => prev.filter((f: any) => f._id !== userId));
      notification.success({
        message: "Success",
        description: "User has removed successfully.",
      });
    });
  };

  return (
    <div>
      <Header />
      {adminConfirm ? (
        <div className="flex flex-col w-full">
          <div className="container text-white w-[95%] m-auto py-10">
            <div className="flex justify-center my-5">
              <input
                type="text"
                className="px-2 py-3 w-1/2 rounded-lg text-white bg-transparent border-[1px] border-[gray]"
                value={filterTxt}
                onChange={(e) => {
                  setFilterTxt(e.target.value);
                }}
                placeholder="Search by username!"
              />
            </div>
            <div className="admin-task-table user-table">
              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th rowSpan={2}>Username</th>
                    <th rowSpan={2} style={{ width: 200 }}>
                      Email
                    </th>
                    <th rowSpan={2}>IP Address</th>
                    <th colSpan={6}>Money</th>
                    <th colSpan={5}>Earned Money</th>
                    <th colSpan={4}>Deposit Count</th>
                    <th rowSpan={2}>Invited By</th>
                    <th rowSpan={2}>Invite Count</th>
                    <th rowSpan={2}>Actions</th>
                  </tr>
                  <tr>
                    <th>BITP</th>
                    <th>BUSD</th>
                    <th>CAKE</th>
                    <th>QUEST</th>
                    <th>USD</th>
                    <th>USDT</th>
                    <th>BITP</th>
                    <th>BUSD</th>
                    <th>CAKE</th>
                    <th>USD</th>
                    <th>USDT</th>
                    <th>BUSD</th>
                    <th>CAKE</th>
                    <th>USD</th>
                    <th>USDT</th>
                    {/* <th>Edit</th> */}
                    {/* <th>Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item: any, key: number) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{item?.username}</td>
                        <td className="whitespace-break-spaces">
                          {item?.email}
                        </td>
                        <td>
                          {item?.ipAddress}
                          {/* <Badge
                        count={item.status ? "Opened" : "Closed"}
                        color={item.status ? "green" : "grey"}
                      /> */}
                        </td>
                        <td>{item.money?.bitp}</td>
                        <td>{item.money?.busd}</td>
                        <td>{item.money?.cake}</td>
                        <td>{item.money?.quest}</td>
                        <td>{item.money?.usd}</td>
                        <td>{item.money?.usdt}</td>
                        <td>{item.earnMoney?.bitp}</td>
                        <td>{item.earnMoney?.busd}</td>
                        <td>{item.earnMoney?.cake}</td>
                        <td>{item.earnMoney?.usd}</td>
                        <td>{item.earnMoney?.usdt}</td>
                        <td>{item.txcount?.busd}</td>
                        <td>{item.txcount?.cake}</td>
                        <td>{item.txcount?.usd}</td>
                        <td>{item.txcount?.usdt}</td>
                        <td>
                          {item.referralId === "" ||
                          item.referralId === 0 ||
                          item.referralId == "0"
                            ? "No Refer"
                            : filterData.filter(
                                (f: any) =>
                                  f.twitter.twitterScreenName ===
                                  item.referralId
                              )[0]?.username}
                        </td>
                        <td>{item?.referralCnt}</td>
                        {/* <td>
                      <span
                        onClick={() => {
                          //   setEditItem(item);
                          //   setAddModal(true);
                        }}
                        className="cursor-pointer underline text-blue-300"
                      >
                        Edit
                      </span>
                    </td> */}
                        <td>
                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this user?"
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
                total={Math.ceil(filterData.length / 10)}
                current={currentPage}
                onPageChange={(page) => handlePageChange(page)}
              />
            </div>
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

export default AdminUser;
