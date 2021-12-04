import './navigation.less';

import { ExportOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Menu, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { actions as firebaseAction } from '../../config/firebaseApp';

const { firebaseLogout, firebaseSigin } = firebaseAction;

const Navigation = ({ state, setState }) => {
  const history = useHistory();
  const { current_menu, isLoggedIn, user } = state;
  const mounted = useRef(true);

  const handleClick = (e) => {
    setState((prevState) => ({ ...prevState, current_menu: e.key }));
    history.push(e.key);
  };

  const handleLogin = async () => {
    const result = await firebaseSigin();
    setState((prevState) => ({ ...prevState, ...result }));
  };

  const handleLogout = () => {
    firebaseLogout();
    setState((prevState) => ({ ...prevState, isLoggedIn: false, user: null }));
    localStorage.removeItem('user');
  };

  useEffect(() => {
    if (mounted.current) {
      const isUserLoggedIn = localStorage.getItem('user');

      if (isUserLoggedIn) {
        const user = JSON.parse(isUserLoggedIn);
        setState((prevState) => ({ ...prevState, ...user }));
      }
    }

    return () => {
      mounted.current = false;
    };
  }, [setState]);

  return (
    <Row
      align="middle"
      style={{ backgroundColor: '#001529', overflowX: 'auto' }}
    >
      <Col
        className="top-menu"
        xs={{ span: 22, offset: 1 }}
        lg={{ span: 18, offset: 3 }}
      >
        <Menu
          onClick={handleClick}
          selectedKeys={[current_menu]}
          mode="horizontal"
          theme="dark"
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            Subreddits
          </Menu.Item>
        </Menu>
        <div className="right">
          {user && (
            <div className="user">
              <Avatar src={user.photoURL} />
              <span style={{ color: '#fff' }}>{user.displayName}</span>
            </div>
          )}
          <Button
            type="primary"
            onClick={isLoggedIn ? handleLogout : handleLogin}
          >
            <ExportOutlined /> <span> {isLoggedIn ? 'Logout' : 'Login'} </span>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

Navigation.propTypes = {
  state: PropTypes.shape({
    current_menu: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string,
      uid: PropTypes.string,
      token: PropTypes.string,
    }).isRequired,
  }).isRequired,
  setState: PropTypes.func.isRequired,
};

export default Navigation;
