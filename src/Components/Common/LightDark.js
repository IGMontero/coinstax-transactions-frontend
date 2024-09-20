import React from 'react';

//constants
import { layoutModeTypes } from '../../Components/constants/layout';

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {
  const mode =
    layoutMode === layoutModeTypes['DARKMODE']
      ? layoutModeTypes['LIGHTMODE']
      : layoutModeTypes['DARKMODE'];

  return (
    <div className="ms-2   d-sm-flex">
      <button
        onClick={() => onChangeLayoutMode(mode)}
        type="button"
        // style={{
        //   height: '37px',
        //   width: '37px',
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        // }}
        className="btn btn-icon 
         btn-ghost-dark me-1  rounded-circle light-dark-mode"
      >
        <i className="bx bx-moon fs-22"></i>
      </button>
    </div>
  );
};

export default LightDark;
