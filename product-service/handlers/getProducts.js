import { ProductsService } from '../service/products-service';
import { RESPONSE } from '../utils/reponse';

const getProducts = async (event) => {
  try {
    const products = await ProductsService.getAll();

    return RESPONSE._200(products);
  } catch (e) {
    return RESPONSE._500();
  }
};

export const handler = async (event) => await getProducts(event);
