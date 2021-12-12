import { Button, Col, Divider, List, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getters } from '../../config/firebaseApp';

const Subredits = () => {
  const [subreditsModel, setSubreditsModel] = useState([]);
  const mounted = useRef(true);
  const history = useHistory();

  useEffect(() => {
    if (mounted.current) {
      (async () => {
        const data = await getters.getSubreddits();
        setSubreditsModel(data);
      })();
    }
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <>
      <Divider orientation="left">Subredits</Divider>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 22, offset: 1 }}>
          <List
            bordered
            loading={subreditsModel.length === 0}
            dataSource={subreditsModel}
            rowKey={(record) => record._id}
            renderItem={(item) => (
              <List.Item>
                <Button
                  type="link"
                  block
                  onClick={() => history.push(`/r${item.slug}`)}
                  style={{ textAlign: 'left' }}
                >
                  {item.name}
                </Button>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default Subredits;
