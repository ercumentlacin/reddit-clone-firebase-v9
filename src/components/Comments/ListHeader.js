import './comments.less';

import { Select, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const { Option } = Select;
const ListHeader = ({ setKey }) => {
  const [open, setOpen] = useState(false);
  const [isShouldBeRender, setIsShouldBeRender] = useState(false);
  const contentRef = useRef(null);
  const selectRef = useRef(null);

  const handleChange = (value) => setKey(value);

  const handleClick = (event) => {
    if (contentRef.current?.contains(event.target)) {
      setOpen(true);
      setIsShouldBeRender(true);
    } else {
      setOpen(false);
      setIsShouldBeRender(true);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [open]);

  useEffect(() => {
    if (isShouldBeRender) {
      setIsShouldBeRender(false);
    }
  }, [isShouldBeRender]);

  console.log(`open`, open);

  return (
    <div ref={contentRef} className="list-header">
      <Typography.Link>Sort By</Typography.Link>

      <Select
        bordered={false}
        defaultValue="old"
        title="Sort by"
        style={{ width: 120 }}
        onChange={handleChange}
        ref={selectRef}
        open={open}
        dropdownClassName="list-header__dropdown"
      >
        <Option value="top">Top</Option>
        <Option value="old">Old</Option>
      </Select>
    </div>
  );
};

export default ListHeader;

ListHeader.propTypes = {
  setKey: PropTypes.func.isRequired,
};
