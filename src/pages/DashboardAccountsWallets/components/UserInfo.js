import React from 'react';
const UserInfo = ({ user }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          {/* <h4>{capitalizeFirstLetter(user?.role)}</h4> */}
          <p className="text-muted">{user?.email}</p>
        </div>
        {/* <p className="text-muted">
          Last viewed: {formatDateToLocale(user.LastViewedDate)}
        </p> */}
      </div>

      {/* <hr /> */}
    </>
  );
};

export default UserInfo;
