import './comments.less';

import { Select, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const { Option } = Select;
const ListHeader = ({ setKey }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((prev) => !prev);
  const handleChange = (value) => {
    setKey(value);
    handleClick();
  };

  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        handleClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={contentRef} className="list-header">
      <Typography.Link onClick={handleClick}>Sort By</Typography.Link>

      <Select
        bordered={false}
        open={open}
        defaultValue="old"
        title="Sort by"
        style={{ width: 120 }}
        onChange={handleChange}
        onClick={handleClick}
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
