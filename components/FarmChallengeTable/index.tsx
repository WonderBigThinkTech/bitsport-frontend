import axios from "axios";
import moment from "moment";
import { ForwardRefExoticComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, notification } from "antd";
import Icon, { RestOutlined } from "@ant-design/icons";
import { SERVER_URI } from "@/config";
import { IState } from "@/store";

interface RecordType {
  title: string;
  difficulty: number;
  streak: number;
  amount: number;
  status: number;
  _id: string;
}

const FarmChallengeTable = () => {
  const [challenges, setChallenges] = useState([]);
  const model = useSelector((state: IState) => state.challenge.model);

  useEffect(() => {
    axios.get(`${SERVER_URI}/farmChallenge/index`).then((res) => {
      setChallenges(res.data.models);
    });
  }, [model]);

  const onRemove = (id: string) => {
    Modal.confirm({
      title: "Remove",
      content: "Are you sure to remove the challenge?",
      onOk() {
        axios.delete(`${SERVER_URI}/farmChallenge/remove/${id}`).then((res) => {
          if (res.data.success) {
            notification.success({
              message: "Success!",
              description: "The challenge was removed successfully!",
            });
            setChallenges(
              challenges.filter((p: RecordType) => p._id !== res.data.model._id)
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
      challenges?.map((p: object, i) => {
        return { ...p, index: i + 1, key: i };
      }),
    [challenges]
  );

  return (
    <>
      <Table
        dataSource={source}
        columns={[
          { title: "Id", dataIndex: "index" },
          { title: "Title", dataIndex: "title" },
          { title: "Difficulty", dataIndex: "difficulty" },
          { title: "Streak", dataIndex: "streak" },
          { title: "Amount", dataIndex: "amount" },
          {
            title: "createdAt",
            dataIndex: "createdAt",
            render: (text, record) =>
              moment(text).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "Action",
            render: (text, record) => (
              <Button type="link" onClick={() => onRemove(record._id)}>
                <Icon
                  style={{ fontSize: 18, color: "#999" }}
                  component={RestOutlined as ForwardRefExoticComponent<any>}
                />
              </Button>
            ),
          },
        ]}
      />
    </>
  );
};

export default FarmChallengeTable;
