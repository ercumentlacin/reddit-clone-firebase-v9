/* eslint-disable no-nested-ternary */
import './subredit.less';

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Row, Typography } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import PostCreateForm from '../../components/PostCreateForm';
import { actions, getters } from '../../config/firebaseApp';
import { emailToNickname, timeDifference } from '../../helper';

const { Paragraph, Text } = Typography;
const { Search } = Input;

const Subreddit = ({ state }) => {
  const { isLoggedIn, user } = state;
  const { subredditName } = useParams();
  const mounted = useRef(true);
  const history = useHistory();
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

  const voteClassNames = (item, type = 'default') =>
    classNames({
      red: type !== 'down' && item.votes.up.some((v) => v === user?.uid),
      blue: type !== 'up' && item.votes.down.some((v) => v === user?.uid),
    });

  return (
    <section className="subreddit-page-container">
      <Row>
        <Col xs={{ span: 18, offset: 3 }}>
          <h1>{subredditName}</h1>
        </Col>
      </Row>

      {/* create post button */}
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
                  onClick={() =>
                    history.push(`/r/${subredditName}/comments/${item.id}`)
                  }
                >
                  <div className="post-item__left">
                    <span
                      className={`up ${voteClassNames(item, 'up')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.handlePostVote(
                          item.id,
                          item,
                          'up',
                          setIsShouldBeRender,
                          user
                        );
                      }}
                      aria-hidden="true"
                    >
                      <CaretUpOutlined />
                    </span>
                    <span className={`vote ${voteClassNames(item)}`}>
                      {item.votes.up.length - item.votes.down.length}
                    </span>
                    <span
                      className={`down ${voteClassNames(item, 'down')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.handlePostVote(
                          item.id,
                          item,
                          'down',
                          setIsShouldBeRender,
                          user
                        );
                      }}
                      aria-hidden="true"
                    >
                      <CaretDownOutlined />
                    </span>
                  </div>
                  <div className="post-item__right">
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
