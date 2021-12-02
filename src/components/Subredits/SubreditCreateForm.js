import { Button, Form, Input } from 'antd';

import { actions } from '../../config/firebaseApp';

const SubreditCreateForm = () => {
  const onFinish = async (values) => {
    actions.firebaseAddSubreddit('subredits', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      wrapperCol={{
        span: 14,
      }}
      labelCol={{
        offset: 1,
        span: 2,
      }}
      style={{ marginTop: '2rem' }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubreditCreateForm;
