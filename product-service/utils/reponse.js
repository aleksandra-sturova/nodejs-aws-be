import { HEADERS } from '../constants';

const responseCreator = (statusCode, data = {}) => ({
  headers: HEADERS,
  statusCode,
  body: JSON.stringify(data),
});

export const RESPONSE = {
  _200: (data) => responseCreator(200, data),
  _400: (data) => responseCreator(400, data),
  _404: (data) => responseCreator(404, data),
  _500: () => responseCreator(500, 'Oops! Server Error'),
};
