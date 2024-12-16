import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  notification,
} from "antd";
import { challengeActions } from "@/store/challenge";
import { IState } from "@/store";
import { SERVER_URI } from "@/config";

const FarmChallengeModal: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const visible = useSelector((state: IState) => state.challenge.flag);

  useEffect(() => {
    form.resetFields();
  }, []);

  const onSubmit = (data: any) => {
    Modal.confirm({
      title: "Add Challenge",
      content: "Are you sure to add new challenge?",
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        axios.post(`${SERVER_URI}/farmchallenge/save`, data).then((res) => {
          if (res.data.success) {
            notification.success({
              message: "Success!",
              description: "New challenge added successfully!",
            });
            dispatch(challengeActions.setModalFlag({ flag: false, model: {} }));
            form.resetFields();
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

  return (
    <Modal
      title="Add Farm Challenge"
      width={600}
      open={visible}
      closable={false}
      footer={null}
      onCancel={() => {
        form.resetFields();
        dispatch(challengeActions.setModalFlag({ flag: false, model: {} }));
      }}
    >
      <Form
        form={form}
        initialValues={{ difficulty: 1, cointype: 1 }}
        onFinish={onSubmit}
        style={{ marginTop: 50 }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        labelWrap
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title." }]}
          labelCol={{ style: { width: 110 } }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Streak"
          name="streak"
          rules={[{ required: true, message: "Please input streak." }]}
          labelCol={{ style: { width: 110 } }}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Difficulty"
          name="difficulty"
          rules={[{ required: true, message: "Please select difficulty." }]}
          labelCol={{ style: { width: 110 } }}
        >
          <Select>
            <Select.Option key={1} value={0}>
              Easy
            </Select.Option>
            <Select.Option key={2} value={1}>
              Medium
            </Select.Option>
            <Select.Option key={3} value={2}>
              Hard
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Point Amount"
          name="amount"
          rules={[{ required: true, message: "Please input amount." }]}
          labelCol={{ style: { width: 110 } }}
        >
          <InputNumber
            addonAfter={"(BITS)"}
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FarmChallengeModal;
