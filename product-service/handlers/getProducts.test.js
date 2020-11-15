import { getProducts } from './getProducts';
import { RESPONSE } from '../../utils/response';
import { ProductsService } from '../service/products-service';

jest.mock('../service/products-service');
jest.mock('../utils/response');

describe('getProducts', () => {
  test('should return all products with status code 200', async () => {
    const mockProducts = [{ id: 1 }];
    const spy = jest.spyOn(ProductsService, 'getAll');
    spy.mockImplementation(() => Promise.resolve(mockProducts));
    await getProducts();

    await expect(RESPONSE._200).toHaveBeenCalledWith(mockProducts);
  });

  xtest('should return status code 500 in case of error', async () => {
    const spy = jest.spyOn(ProductsService, 'getAll');
      await getProducts();
      await expect(RESPONSE._500).toHaveBeenCalled();
  });
});
