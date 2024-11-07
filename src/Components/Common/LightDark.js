import React from 'react';

//constants
import { layoutModeTypes } from '../../Components/constants/layout';
import { getCurrentThemeCookie } from '../../helpers/cookies_helper';

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {
  console.log('current theme cookie', getCurrentThemeCookie());

  // const mode =
  //   layoutMode === layoutModeTypes['DARKMODE']
  //     ? layoutModeTypes['LIGHTMODE']
  //     : layoutModeTypes['DARKMODE'];

  const mode =
    getCurrentThemeCookie() === 'dark'
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
        {/* <i className="bx bx-moon fs-22"></i> */}
        <i className="ri-contrast-2-fill fs-22"></i>
      </button>
    </div>
  );
};

export default LightDark;
