import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { actions } from '../../config/firebaseApp';

const NewCommentForm = ({ user, setIsShouldBeRender, id, data }) => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { comment } = values;

    const comments = !data.comments ? [] : data.comments;

    await actions.addComment(
      {
        ...data,
        comments: [
          ...comments,
          {
            comment,
            id: uuidv4(),
            name: user.displayName,
            user_id: user.uid,
            avatar: user.photoURL,
            email: user.email,
            docId: id,
            updatedAt: Date.now(),
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
          },
        ],
      },
      id
    );
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
        label="Comment"
        name="comment"
        rules={[
          {
            required: true,
            message: 'Please input your comment!',
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

NewCommentForm.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  setIsShouldBeRender: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        user_id: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
        email: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default NewCommentForm;
