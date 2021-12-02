import { Card, Col, List, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import PostCreateForm from '../../components/PostCreateForm';
import { getters } from '../../config/firebaseApp';

const Subreddit = () => {
  const { subredditName } = useParams();
  const mounted = useRef(true);
  const [posts, setPosts] = useState([]);
  const [isPostCreateShow, setIsPostCreateShow] = useState(false);

  const onPostToggle = () => setIsPostCreateShow((prev) => !prev);

  useEffect(() => {
    if (mounted.current) {
      (async () => {
        const data = await getters.getPosts(subredditName);
        setPosts(data);
      })();
    }
    return () => {
      mounted.current = false;
    };
  }, [subredditName]);

  console.log(`posts`, posts);

  return (
    <section>
      <Row>
        <Col span={18} offset={3}>
          <h1>{subredditName}</h1>
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <button type="button" onClick={onPostToggle}>
            {isPostCreateShow ? 'Hide' : 'Create'}
          </button>
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          {isPostCreateShow && <PostCreateForm subredditName={subredditName} />}
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
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

export default Subreddit;
