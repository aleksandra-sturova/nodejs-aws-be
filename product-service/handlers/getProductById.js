import { ProductsService } from '../service/products-service';
import { RESPONSE } from '../utils/reponse';

const getProductById = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return RESPONSE._400('Product id is not valid');
    }

    const product = await ProductsService.findById(+id);

    if (!product) {
      return RESPONSE._404(`Product with id ${id} not found`);
    }

    return RESPONSE._200(product);
  } catch (e) {
    return RESPONSE._500();
  }
};

export const handler = async (event) => await getProductById(event);
