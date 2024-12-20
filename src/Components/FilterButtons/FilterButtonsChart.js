import React from 'react';
import GraphBtnsSkeleton from '../Skeletons/GraphBtnsSkeleton';

const FilterButtonsChart = ({
  label,
  days,
  id,
  loading,
  activeFilter,
  handleFilterForDays,
}) => {
  return (
    <>
      <button
        disabled={loading || activeFilter === id}
        onClick={() => handleFilterForDays(days, id)}
        type="button"
        className={`btn border-0 rounded-pill text-dark timeline-btn btn-sm`}
        id={id}
        style={{fontWeight: activeFilter === id ? 'bold' : '', opacity: activeFilter === id ? '1' : '0.7'}}
      >
        {label}
      </button>
    </>
  );
};
export default FilterButtonsChart;
