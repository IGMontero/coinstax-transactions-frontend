import { JsonApiClient } from '@servicestack/client';
import config from '../config';

const ssClient = JsonApiClient.create(config.api.API_URL);

// Configure client to not add /api at the end of the URL
ssClient.basePath = 'api';

export const parseSsErrorResponse = (response) => {
  return {
    errorCode: response?.responseStatus?.errorCode || '500',
    message:
      response?.responseStatus?.message ||
      'There was a problem. Please try again later.',
    stackTrace: response?.responseStatus?.stackTrace || null,
    error: true,
  };
};

export const isSsSuccessResponse = (response) => {
  return !response.responseStatus;
};

export default ssClient;
