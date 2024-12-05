import React, { useEffect, useState } from 'react';
import { components } from 'react-select';
import ReactDOM from 'react-dom';
import { formatIdTransaction } from '../../../utils/utils';
import {
  setUserSavedAddresses,
  removeAddressFromCookies,
} from '../../../helpers/cookies_helper';
import { Button, Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { removeAddressName } from '../../../slices/addressName/reducer';
import { useParams } from 'react-router-dom';

const CustomOptions = (props) => {
  const dispatch = useDispatch();
  const { address } = useParams();
  const addresses = useSelector((state) => state.addressName.addresses);
  const addressesCookies = useSelector((state) => state.addressName.addresses);

  const { userPortfolioSummary } = useSelector((state) => state.userWallets);

  // Window size states
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1221);
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth >= 768 && window.innerWidth <= 850,
  );
  const [isMoreSmallScreen, setIsMoreSmallScreen] = useState(
    window.innerWidth < 768,
  );
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(
    window.innerWidth < 485,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1221);
      setIsMediumScreen(window.innerWidth >= 768 && window.innerWidth <= 850);
      setIsMoreSmallScreen(window.innerWidth < 768);
      setIsVerySmallScreen(window.innerWidth < 485);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addressWithNames = userPortfolioSummary.addresses?.find(
    (addr) => addr.address === props.data.value,
  );
  const addressCustomName = addressWithNames?.name || props.data.label;

  const resolveDisplayLabel = () => {
    const { value } = props.data;
    let formattedLabel = addressCustomName || value;

    if (addressCustomName) {
      return addressCustomName;
    }

    if (isVerySmallScreen) {
      formattedLabel = addressCustomName || formatIdTransaction(value, 8, 6);
    } else if (isMediumScreen) {
      formattedLabel = addressCustomName || formatIdTransaction(value, 8, 12);
    } else if (isSmallScreen) {
      formattedLabel = addressCustomName || formatIdTransaction(value, 8, 15);
    } else {
      formattedLabel = addressCustomName || formatIdTransaction(value, 12, 20);
    }

    return formattedLabel;
  };

  const displayLabel = resolveDisplayLabel();



  const handleDelete = (e, option) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the address to delete from cookies
    const addressToDeleteFromCookies = addressesCookies.find(
      (addr) => addr.value === option.value,
    );

    if (addressToDeleteFromCookies) {
      // Remove address from Redux state
      dispatch(removeAddressName(addressToDeleteFromCookies));

      // Remove address from cookies
      const updatedOptions = removeAddressFromCookies(
        addressToDeleteFromCookies.value,
      );
      setUserSavedAddresses(updatedOptions);
      // Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
    }

    // Swal.fire({
    //   title: `Are you sure you want to remove ${option.label}?`,
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Delete',
    //   cancelButtonText: 'Close',
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       // Find the address to delete from cookies
    //       const addressToDeleteFromCookies = addressesCookies.find(
    //         (addr) => addr.value === option.value,
    //       );

    //       if (addressToDeleteFromCookies) {
    //         // Remove address from Redux state
    //         dispatch(removeAddressName(addressToDeleteFromCookies));

    //         // Remove address from cookies
    //         const updatedOptions = removeAddressFromCookies(
    //           addressToDeleteFromCookies.value,
    //         );
    //         setUserSavedAddresses(updatedOptions);
    //         Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
    //       } else {
    //         Swal.fire('Error!', 'Address not found in cookies.', 'error');
    //       }
    //     } catch (err) {
    //       console.error('Failed to delete address:', err);
    //       Swal.fire('Error!', 'Failed to delete address.', 'error');
    //     }
    //   }
    // });
  };
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderDeleteAddress = () => {
    return (
      <Button
        onClick={(e) =>
          handleDelete(e, {
            label: displayLabel,
            value: props.data.value,
          })
        }
        style={{
          height: 12,
          width: 12,
        }}
        color="transparent"
        className="p-0 m-0"
      >
        <i className="ri-close-fill text-dark me-2 text-light"></i>
      </Button>
    );
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <components.Option {...props}>
        <div>
          <Row className="d-flex justify-content-between align-items-center">
            <Col className="col-10">
              <div className="d-flex justify-content-start align-items-center">
                {props.data.logo && (
                  <img
                    className="img-fluid rounded-circle me-2"
                    src={props.data.logo}
                    alt={props.data.label}
                    style={{ width: 30, height: 30 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const textNode = document.createElement('div');
                      textNode.textContent = props.data.label
                        ?.substring(0, 3)
                        .toUpperCase();
                      textNode.className =
                        'img-assets-placeholder avatar-xs me-2';
                      const container = e.target.parentNode;
                      container.insertBefore(textNode, container.firstChild);
                    }}
                  />
                )}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <span className="text-custom-menu-suggestions">
                      {displayLabel}
                    </span>
                    {address === props.data.value && (
                      <i className="ri-checkbox-blank-circle-fill fs-10 text-success ms-2"></i>
                    )}{' '}
                  </div>
                  {addressCustomName && (
                    <span className="text-muted">
                      {formatIdTransaction(props.data.value, 6, 8)}
                    </span>
                  )}
                </div>
              </div>
            </Col>
            <Col className="col-2 d-flex justify-content-center pb-2 align-items-center">
              {isHovered &&
                addresses.some((addr) => addr.value === props.data.value) && (
                  <>{renderDeleteAddress()}</>
                )}
            </Col>
          </Row>
        </div>
      </components.Option>
    </div>
  );
};

export default CustomOptions;
