import React from 'react';
import { capitalizeFirstLetter } from '../../../utils/utils';

const About = ({ description, name, links }) => {
  return (
    <div className=" mb-3 border-bottom pb-4">
      <div className="my-3">
        {' '}
        <h3>About {capitalizeFirstLetter(name)}</h3>
      </div>
      <p>{description}</p>
      <div>
        {links &&
          Object.keys(links).map((link, index) => {
            return (
              <a
                key={index}
                href={links[link]}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-decoration-none  me-3 "
              >
                <span className="text-hover-underline fs-7 fw-semibold">
                  {capitalizeFirstLetter(link)}{' '}
                </span>
                <i className="mdi mdi-open-in-new"></i>{' '}
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default About;
