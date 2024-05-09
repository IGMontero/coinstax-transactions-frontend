import React from 'react';
import { capitalizeFirstLetter } from '../../../utils/utils';

const About = ({ description, name }) => {
  return (
    <div className=" mb-3 border-bottom pb-4">
      <div className="my-3">
        {' '}
        <h3>About {capitalizeFirstLetter(name)}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default About;
