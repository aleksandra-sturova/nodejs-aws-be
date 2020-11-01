import { handler } from './getProductById';
import { RESPONSE } from '../utils/response';
import { ProductsService } from '../service/products-service';

jest.mock('../service/products-service');
jest.mock('../utils/response');

describe('getProductById', () => {
  const mockProducts = [{ id: '1' }];
  const eventMock = { pathParameters: { id: '1' } };
  const eventMockInvalid = { pathParameters: { id: 'a' } };
  let spy;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(ProductsService, 'findById');
  });

  test('should return product by id with status code 200', async () => {
    spy.mockImplementation(() => Promise.resolve(mockProducts[0]));
    await handler(eventMock);

    await expect(RESPONSE._200).toHaveBeenCalledWith(mockProducts[0]);
    await expect(spy).toHaveBeenCalledWith(+mockProducts[0].id);
  });

  test('should return error message and status code 400 for invalid id', async () => {
    await handler(eventMockInvalid);

    await expect(RESPONSE._400).toHaveBeenCalledWith('Product id is not valid');
    await expect(spy).not.toHaveBeenCalledWith();
  });

  test('should return error message and status code 400 for not existing id', async () => {
    spy.mockImplementation(() => Promise.resolve(null));
    await handler(eventMock);

    await expect(RESPONSE._404).toHaveBeenCalledWith(`Product with id ${eventMock.pathParameters.id} not found`);
  });

  test('should return status code 500in case of error', async () => {
    spy.mockImplementation(() => Promise.reject(false));
    await handler(eventMock);

    await expect(RESPONSE._500).toHaveBeenCalled();
  });
});
