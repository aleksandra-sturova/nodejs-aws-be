import { PRODUCTS } from '../data/products';

const findById = (id) => PRODUCTS.find((product) => product.id === id);

const getAll = () => PRODUCTS;

export const ProductsService = {
  findById,
  getAll,
};
