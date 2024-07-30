import React from 'react';
import ReactDOM from 'react-dom';

const DropdownMenuPortal = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById('portal-root'),
  );
};

export default DropdownMenuPortal;
