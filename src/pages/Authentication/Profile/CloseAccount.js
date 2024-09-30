import React, { useState } from 'react';
import { Input, TabPane, Button, Spinner } from 'reactstrap';
import { closeAccount } from '../../../slices/auth2/thunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useLogOut } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CloseAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const logout = useLogOut();

  const handleLogout = () => {
    try {
      logout();

      navigate('/wallets');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'YES' || !isChecked) {
      await Swal.fire(
        'Error',
        'You must type "YES" and check the confirmation box to proceed.',
        'error',
      );
      return;
    }

    const responseSwal = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (responseSwal.isConfirmed) {
      setLoading(true);

      try {
        const result = await dispatch(closeAccount()).unwrap();
        setLoading(false);

        if (result.message === 'User account closed') {
          await Swal.fire(
            'Success!',
            'Your account has been successfully deleted.',
            'success',
          );
          handleLogout();
        } else {
          await Swal.fire(
            'Error',
            'There was an issue deleting your account. Please try again.',
            'error',
          );
        }
      } catch (error) {
        setLoading(false);
        await Swal.fire(
          'Error',
          'An unexpected error occurred. Please try again later.',
          'error',
        );
      }
    }
  };

  return (
    <TabPane tabId="5">
      <div>
        <h5 className="card-title mb-3">{'Close This Account'}:</h5>
        <p className="text-muted">
          Closing your account will irreversibly remove all your trade data,
          capital gains results and closing positions.
        </p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="confirmCheckbox"
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="confirmCheckbox" className="form-check-label">
            I understand by closing my account, I will lose access to all my
            information.
          </label>
        </div>
        <div>
          <p>
            To close your account, please type the word YES into the following
            field and click the button below
          </p>
          <Input
            type="text"
            className="form-control"
            placeholder="Enter the word YES"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            style={{ maxWidth: '265px' }}
          />
        </div>
        <div className="hstack gap-2 mt-3">
          <Button
            onClick={handleDeleteAccount}
            className="btn btn-danger"
            disabled={loading || !isChecked}
          >
            {loading ? <Spinner size="sm" color="dark" /> : 'Close Account'}
          </Button>
        </div>
      </div>
    </TabPane>
  );
};

export default CloseAccount;
