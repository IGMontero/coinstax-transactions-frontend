import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../../utils/utils';

const About = ({ description, name, links }) => {
  const [seeMore, setSeeMore] = useState(false);

  const handleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  const getTruncatedDescription = (desc) => {
    if (!desc) return '';
    if (desc.length > 300) {
      return `${desc.substring(0, 300)}...`;
    }
    return desc;
  };

  return (
    <div className="mb-3 border-bottom pb-4">
      <div className="my-3">
        <h3>About {capitalizeFirstLetter(name)}</h3>
      </div>
      <div
        // className="d-flex"
        style={{
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={{
          __html: seeMore ? description : getTruncatedDescription(description),
        }}
      ></div>
      {description && description.length > 255 && (
        <button onClick={handleSeeMore} className="btn btn-link mb-2 p-0">
          {seeMore ? 'See Less' : 'See More'}
        </button>
      )}
      <div>
        {links &&
          Object.keys(links).map((link, index) => {
            const linkLabel =
              link === 'blockchainSite'
                ? 'Blockchain Site'
                : capitalizeFirstLetter(link);

            return (
              <a
                key={index}
                href={links[link]}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-decoration-none me-3"
              >
                <span className="text-hover-underline fs-7 fw-semibold">
                  {linkLabel}
                </span>
                <i className="mdi mdi-open-in-new"></i>
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default About;
