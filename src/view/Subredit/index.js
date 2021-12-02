import { Card, Col, List, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import PostCreateForm from '../../components/PostCreateForm';
import { getters } from '../../config/firebaseApp';

const Subreddit = ({ state }) => {
  const { isLoggedIn, user } = state;
  const { subredditName } = useParams();
  const mounted = useRef(true);
  const [posts, setPosts] = useState([]);
  const [isPostCreateShow, setIsPostCreateShow] = useState(false);

  const onPostToggle = () => setIsPostCreateShow((prev) => !prev);

  useEffect(() => {
    if (mounted.current) {
      (async () => setPosts(await getters.getPosts(subredditName)))();
    }
    return () => (mounted.current = false);
  }, [subredditName]);

  console.log(`posts`, posts);

  return (
    <section>
      <Row>
        <Col span={18} offset={3}>
          <h1>{subredditName}</h1>
        </Col>
      </Row>
      {isLoggedIn && (
        <>
          <Row>
            <Col span={18} offset={3}>
              <button type="button" onClick={onPostToggle}>
                {isPostCreateShow ? 'Hide' : 'Create'}
              </button>
            </Col>
          </Row>
          <Row>
            <Col span={18} offset={3}>
              {isPostCreateShow && (
                <PostCreateForm subredditName={subredditName} user={user} />
              )}
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col span={18} offset={3}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 3,
              xxl: 3,
            }}
            dataSource={posts}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    item.image ? <img alt="example" src={item.image} /> : null
                  }
                >
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </section>
  );
};

Subreddit.propTypes = {
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

export default Subreddit;
