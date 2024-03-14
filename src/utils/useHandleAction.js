import Swal from 'sweetalert2'; /**
 * Handle the result of an action.
 * @param {Function} actionCreator
 * @param {Object} actionResult
 * @param {String} errorMessageEdit
 */

export const handleActionResult = async (
  actionCreator,
  actionResult,
  errorMessageEdit = '',
  errorMessage = '',
  onSuccess = null,
) => {
  if (actionCreator.rejected.match(actionResult)) {
    const errorMessage =
      errorMessageEdit || actionResult.payload || 'Unknown error';
    await Swal.fire('Error', errorMessage, 'error');
    return false; // Error
  }
  if (actionResult.payload === null) {
    await Swal.fire('Error', errorMessage, 'error');
    return false;
  }
  if (onSuccess && typeof onSuccess === 'function') {
    onSuccess(actionResult.payload);
  }
  return true; // Success
};
