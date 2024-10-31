import React, { useState } from 'react';
import { Input, TabPane, Button, Spinner } from 'reactstrap';
import { closeAccount } from '../../../slices/auth2/thunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useLogOut } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CloseAccount = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const logout = useLogOut();

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'YES' || !isChecked) {
      return;
    }

    setErrorMsg('');

    const responseSwal = await Swal.fire({
      title: 'Close Account',
      text: 'Closing an account cannot be undone and all data will be removed. Are you sure you want to close your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Close Account',
      cancelButtonText: 'Cancel',
    });

    if (responseSwal.isConfirmed) {
      setLoading(true);

      try {
        const result = await dispatch(closeAccount()).unwrap();
        setLoading(false);

        if (result.error) {
          setErrorMsg(result.error.message);
          return;
        }

        logout();
      } catch (error) {
        setLoading(false);
        setErrorMsg('An error occured: ' + error.message);
      }
    }
  };

  return (
    <TabPane tabId="5">
      <div>
        <h5 className="card-title mb-3">{'Close This Account'}:</h5>
        <p className="text-muted">
          Closing your account will remove all your data and cannot be undone.
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
            data.
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
            onChange={(e) => setConfirmationText(e.target.value.toLocaleUpperCase())}
            style={{ maxWidth: '265px' }}
          />
        </div>

        {errorMsg && errorMsg ? (
          <div className="alert alert-danger">{errorMsg} </div>
        ) : null}

        <div className="hstack gap-2 mt-3">
          <Button
            onClick={handleDeleteAccount}
            className="btn btn-danger"
            disabled={loading || !isChecked || confirmationText!=='YES'}
          >
            {loading ? <Spinner size="sm" color="dark" /> : 'Close Account'}
          </Button>
        </div>
      </div>
    </TabPane>
  );
};

export default CloseAccount;
