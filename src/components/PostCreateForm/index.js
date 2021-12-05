import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { actions } from '../../config/firebaseApp';

const PostCreateForm = ({ subredditName, user, setIsShouldBeRender }) => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { title, description, image } = values;
    await actions.firebaseAddPost('posts', {
      _id: subredditName + uuidv4(),
      title,
      description: description || '',
      image: image || '',
      subredditName,
      votes: {
        up: [],
        down: [],
      },
      author: {
        name: user.displayName,
        id: user.uid,
        avatar: user.photoURL,
        email: user.email,
      },
    });
    setIsShouldBeRender(true);
    onReset();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      wrapperCol={{
        span: 18,
      }}
      labelCol={{
        span: 4,
      }}
      style={{ marginTop: '2rem' }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please input your title!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: false,
            message: 'Please input your description!',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Image"
        name="image"
        rules={[
          {
            required: false,
            message: 'Please input your image!',
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

PostCreateForm.propTypes = {
  subredditName: PropTypes.string.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  setIsShouldBeRender: PropTypes.func.isRequired,
};

export default PostCreateForm;
