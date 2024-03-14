import Swal from 'sweetalert2'; /**
 * Función para manejar el resultado de acciones asincrónicas de Redux Toolkit.
 * Function to handle the result of Redux Toolkit asynchronous actions.
 * Show error message if the action fails.
 *
 * @param {Function} actionCreator The action creator function.
 * @param {Object} actionResult The result of the action.
 * @param {String} errorMessageEdit Error message to show if the action fails.
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
