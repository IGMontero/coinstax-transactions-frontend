import React from 'react';
import GraphBtnsSkeleton from '../Skeletons/GraphBtnsSkeleton';

const FilterButtonsChart = ({
  label,
  days,
  id,
  loading,
  activeFilter,
  handleFilterForDays,
}) => (
  <>
    <button
      disabled={loading || activeFilter === id}
      onClick={() => handleFilterForDays(days, id)}
      type="button"
      className={`btn btn-soft-primary rounded-pill timeline-btn btn-sm ${activeFilter === id ? 'active' : ''}`}
      id={id}
    >
      {label}
    </button>
  </>
);
export default FilterButtonsChart;
