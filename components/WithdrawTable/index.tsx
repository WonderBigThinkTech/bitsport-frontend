import axios from "axios";
import moment from "moment";
import { ForwardRefExoticComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, notification } from "antd";
import Icon, { RestOutlined, EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { SERVER_URI } from "@/config";
import { IState } from "@/store";

interface RecordType {
  name: string;
  email: number;
  coin: string;
  network: string;
  amount: number;
  address: string;
  status: number;
  _id: string;
  user: {
    _id: string,
    username: string,
    email: string
  };
}

const WithdrawTable = () => {
  const [withdraw, setWithdraw] = useState([]);
  const model = useSelector((state: IState) => state.withdraw.model);

  useEffect(() => {
    axios.get(`${SERVER_URI}/admin/withdrawHistory`).then((res) => {
      setWithdraw(res.data.models);
      console.log(res.data.models);
    });
  }, [model]);

  const onRemove = (id: string) => {
    Modal.confirm({
      title: "Remove",
      content: "Are you sure to remove the withdraw request?",
      okButtonProps: {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      },
      onOk() {
        axios.delete(`${SERVER_URI}/withdraw/remove/${id}`).then((res) => {
          if (res.data.success) {
            notification.success({
              message: "Success!",
              description: "The withdraw was removed successfully!",
            });
            setWithdraw(
              withdraw.filter((p: RecordType) => p._id !== res.data.model._id)
            );
          } else {
            notification.warning({
              message: "Error!",
              description: res.data.message,
            });
          }
        });
      },
    });
  };

  const onCheck = (id: string) => {
    Modal.confirm({
      title: "Complete",
      content: "Are you sure to complete the withdraw request?",
      okButtonProps: {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      },
      onOk() {
        axios.get(`${SERVER_URI}/withdraw/check/${id}`).then((res) => {
          if (res.data.success) {
            notification.success({
              message: "Success!",
              description: "The withdraw was completed successfully!",
            });
            setWithdraw(
              res.data.models
            );
          } else {
            notification.warning({
              message: "Error!",
              description: res.data.message,
            });
          }
        });
      },
    });
  };

  const source: any = useMemo(
    () =>
      withdraw?.map((p: object, i) => {
        return { ...p, index: i + 1, key: i };
      }),
    [withdraw]
  );

  return (
    <>
      <Table
        dataSource={source}
        columns={[
          { title: "Id", dataIndex: "index" },
          { 
            title: "Name", 
            render: (text, record: RecordType) => 
              record?.user?.username,
          },
          { 
            title: "Email",  
            render: (text, record: RecordType) => 
              record?.user?.email,
          },
          { title: "Coin", dataIndex: "coin" },
          { 
            title: "Network", 
            render: (text, record: RecordType) => 
              record.coin !== "USD" ? record.network : '',
          },
          { title: "Amount", dataIndex: "amount" },
          { title: "address", dataIndex: "address" },
          {
            title: "Status",
            render: (text, record: RecordType) =>
              record.status === 1 ? 
              <p style={{color: "green", marginBottom: "0px"}}>Completed</p> 
              :
              <p>Pending</p> 
              // "Completed" : "Pending",
          },
          {
            title: "createdAt",
            dataIndex: "createdAt",
            render: (text, record) =>
              moment(text).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "Action",
            render: (text, record) => (
              record.status === 1 ?
              <>
                <Button type="link" style={{padding: "5px"}}>
                  <Icon
                    style={{ fontSize: 18, color: "green" }}
                    component={CheckCircleOutlined as ForwardRefExoticComponent<any>}
                  />
                </Button>
                <Button type="link" onClick={() => onRemove(record._id)} style={{padding: "5px"}}>
                  <Icon
                    style={{ fontSize: 18, color: "#999" }}
                    component={RestOutlined as ForwardRefExoticComponent<any>}
                  />
                </Button>
              </>
              :
              <>
              <Button type="link" onClick={() => onCheck(record._id)} style={{padding: "5px"}}>
                <Icon
                  style={{ fontSize: 18, color: "#999" }}
                  component={EditOutlined as ForwardRefExoticComponent<any>}
                />
              </Button>
              <Button type="link" onClick={() => onRemove(record._id)} style={{padding: "5px"}}>
                <Icon
                  style={{ fontSize: 18, color: "#999" }}
                  component={RestOutlined as ForwardRefExoticComponent<any>}
                />
              </Button>
            </>
            ),
          },
        ]}
      />
    </>
  );
};

export default WithdrawTable;