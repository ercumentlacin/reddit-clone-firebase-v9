import './comments.less';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Spin, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ListHeader from '@/components/Comments/ListHeader';
import NewCommentForm from '@/components/NewCommentForm';

import { getters } from '../../config/firebaseApp';
import { emailToNickname, timeDifference } from '../../helper';

const { Title, Text, Paragraph } = Typography;

const Comments = ({ state: AppState }) => {
  const { docId } = useParams();
  const [postState, setPostState] = useState({
    error: null,
    data: {},
    loading: true,
  });
  const { isLoggedIn, user } = AppState;
  const [isShouldBeRender, setIsShouldBeRender] = useState(false);
  const [key, setKey] = useState('old');
  const mounted = useRef(true);
  const history = useHistory();

  useEffect(() => {
    if (mounted.current || isShouldBeRender) {
      (async () => setPostState(await getters.getPost(docId)))();
      setIsShouldBeRender(false);
    }

    return () => (mounted.current = false);
  }, [docId, isShouldBeRender]);

  const memoSortByTime = useCallback(
    (a, b, _key = key) => {
      const choices = {
        old: () => a?.createdAt?.seconds - b?.createdAt?.seconds,
        top: () => b?.createdAt?.seconds - a?.createdAt?.seconds,
      };

      return choices[_key](a, b);
    },
    [key]
  );

  if (
    postState.error !== null &&
    Object.prototype.hasOwnProperty.call(postState.data, 'title')
  ) {
    return (
      <div className="center">
        <Spin />
      </div>
    );
  }

  return (
    <section className="comments-view">
      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }}>
          <div className="title-section">
            <Title level={3}>{postState.data.title}</Title>
            <Button onClick={history.goBack} icon={<CloseOutlined />}>
              Close
            </Button>
          </div>
        </Col>

        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }}>
          <p>{postState.data?.description}</p>
          {postState.data?.image && (
            <img src={postState.data.image} alt={postState.data.title} />
          )}
        </Col>

        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }}>
          {isLoggedIn && (
            <NewCommentForm
              user={user}
              isShouldBeRender={isShouldBeRender}
              setIsShouldBeRender={setIsShouldBeRender}
              data={postState.data}
              id={docId}
            />
          )}
        </Col>

        <Col
          className="comments-wrapper"
          xs={{ span: 22, offset: 1 }}
          md={{ span: 18, offset: 3 }}
        >
          <List
            dataSource={postState.data.comments?.sort((a, b, _key = key) =>
              memoSortByTime(a, b, _key)
            )}
            header={<ListHeader setKey={setKey} />}
            renderItem={(item) => (
              <Row key={item.id} className="comment-row">
                <Col xs={{ span: 22, offset: 1 }} className="comment-item">
                  <div className="comment-item__right">
                    <Text type="secondary">
                      Posted byu/{emailToNickname(item.email)}{' '}
                      <span className="comment-time">
                        {!!item.createdAt && timeDifference(item.createdAt)}
                      </span>
                    </Text>
                    <br />
                    <Text strong>{item.title}</Text>
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                      }}
                    >
                      {item.comment}
                    </Paragraph>
                    {!!item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="comment-image"
                      />
                    )}
                  </div>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </section>
  );
};

Comments.propTypes = {
  state: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string,
      uid: PropTypes.string,
    }),
  }).isRequired,
};

export default Comments;
