import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import PostCreateForm from '../../components/PostCreateForm';
import { getters } from '../../config/firebaseApp';
import { emailToNickname, timeDifference } from '../../helper';

const { Paragraph, Text } = Typography;
const { Search } = Input;

const Subreddit = ({ state }) => {
  const { isLoggedIn, user } = state;
  const { subredditName } = useParams();
  const mounted = useRef(true);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostCreateShow, setIsPostCreateShow] = useState(false);
  const [isShouldBeRender, setIsShouldBeRender] = useState(false);

  const onPostToggle = () => setIsPostCreateShow((prev) => !prev);

  useEffect(() => {
    if (mounted.current || isShouldBeRender) {
      (async () => setPosts(await getters.getPosts(subredditName)))();
      setIsShouldBeRender(false);
    }
    return () => (mounted.current = false);
  }, [subredditName, isShouldBeRender]);

  const onSearch = (value) => setSearchQuery(value);

  const dataSource = useMemo(
    () =>
      posts.filter((post) => {
        if (!posts.length || searchQuery === '') return true;
        const searchArea = [
          post.title,
          post.description,
          emailToNickname(post.author.email),
        ].map((item) => item.toLowerCase());

        return searchArea.some((item) =>
          item.includes(searchQuery.toLowerCase())
        );
      }),
    [posts, searchQuery]
  );

  console.log(`dataSource`, dataSource);

  console.log(`posts`, posts);

  return (
    <section>
      <Row>
        <Col xs={{ span: 18, offset: 3 }}>
          <h1>{subredditName}</h1>
        </Col>
      </Row>
      {isLoggedIn && (
        <>
          <Row>
            <Col xs={{ span: 18, offset: 3 }}>
              <Button
                size="middle"
                onClick={onPostToggle}
                type="primary"
                icon={
                  isPostCreateShow ? <CaretDownOutlined /> : <CaretUpOutlined />
                }
              >
                {isPostCreateShow ? 'Hide' : 'Create'}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 18, offset: 3 }}
              style={{ paddingInline: '4vw' }}
            >
              {isPostCreateShow && (
                <PostCreateForm
                  subredditName={subredditName}
                  user={user}
                  isShouldBeRender={isShouldBeRender}
                  setIsShouldBeRender={setIsShouldBeRender}
                />
              )}
            </Col>
          </Row>
        </>
      )}
      <Row>
        {/* searchbox */}
        <Col
          style={{ marginBlock: '1rem' }}
          xs={{ span: 22, offset: 1 }}
          lg={{ span: 18, offset: 3 }}
        >
          <Search
            placeholder="Search"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </Col>

        {/* posts area */}
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 3 }}>
          <List
            dataSource={dataSource}
            renderItem={(item) => (
              <Row key={item._id} className="post-row">
                <Col
                  xs={{ span: 24, offset: 0 }}
                  lg={{ span: 18, offset: 3 }}
                  className="post-item"
                >
                  <Text type="secondary">
                    Posted byu/{emailToNickname(item?.author?.email)}{' '}
                    <span className="post-time">
                      {timeDifference(item.createdAt)}
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
                    {item.description}
                  </Paragraph>
                  {!!item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="post-image"
                    />
                  )}
                </Col>
              </Row>
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
