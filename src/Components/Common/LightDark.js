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
        style={{
          height: '35px',
          width: '35px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="btn btn-icon 
         btn-ghost-dark border rounded-circle light-dark-mode"
      >
        <i className="bx bx-moon fs-22"></i>
      </button>
    </div>
  );
};

export default LightDark;
