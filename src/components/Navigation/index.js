import { ExportOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Col, Menu, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { actions as firebaseAction } from '../../config/firebaseApp';

const { firebaseLogout, firebaseSigin } = firebaseAction;

const Navigation = ({ state, setState }) => {
  const history = useHistory();
  const { current_menu, isLoggedIn } = state;
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
      <Col xs={{ span: 18, offset: 0 }} lg={{ span: 18, offset: 3 }}>
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
      </Col>
      <Col span={3}>
        <Button
          type="primary"
          onClick={isLoggedIn ? handleLogout : handleLogin}
        >
          <ExportOutlined /> <span> {isLoggedIn ? 'Logout' : 'Login'} </span>
        </Button>
      </Col>
    </Row>
  );
};

Navigation.propTypes = {
  state: PropTypes.shape({
    current_menu: PropTypes.string,
    isLoggedIn: PropTypes.bool,
  }).isRequired,
  setState: PropTypes.func.isRequired,
};

export default Navigation;
