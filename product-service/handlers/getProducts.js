import { ProductsService } from '../service/products-service';
import { RESPONSE } from '../utils/response';

export const getProducts = async (event) => {
  try {
    const products = await ProductsService.getAll();

    return RESPONSE._200(products);
  } catch (e) {
    return RESPONSE._500();
  }
};
