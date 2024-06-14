import axios, { type InternalAxiosRequestConfig } from 'axios';

import configuration from '@/configuration/index.js';
import { HEADER_KEY as CORRELATION_ID_HEADER_KEY } from '@/middleware/correlationId/index.js';
import { HEADER_KEY as NOODLE_API_KEY_HEADER_KEY } from '@/middleware/noodleApiKey/index.js';
import { getCorrelationId } from '@/utils/correlationId/index.js';

const addCorrelationIdToHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const correlationId = getCorrelationId();
  config.headers.set(CORRELATION_ID_HEADER_KEY, correlationId);
  return config;
};

const axiosClient = axios.create({
  baseURL: `${configuration.NOODLE_API_HOST}`,
  headers: {
    [NOODLE_API_KEY_HEADER_KEY]: configuration.NOODLE_API_API_KEY,
    contentType: 'application/json',
  },
});
axiosClient.interceptors.request.use(addCorrelationIdToHeader);

export default axiosClient;
