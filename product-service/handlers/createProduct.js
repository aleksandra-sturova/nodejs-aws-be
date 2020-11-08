import { v4 as uuid } from 'uuid';
import { getClient } from '../db/db';
import { RESPONSE } from '../utils/response';

const QUERY_PRODUCTS = 'INSERT INTO products(id, title, description, price) VALUES($1,$2,$3,$4) RETURNING *';
const QUERY_STOCKS = 'INSERT INTO stocks(product_id, count) VALUES($1,$2) RETURNING *';
export const createProduct = async (event) => {
  const { title = '', description = '', price, count } = JSON.parse(event.body);
  const client = getClient();

  try {
    if (!data) {
      RESPONSE._404('Invalid product data');
    }

    await client.connect();

    const id = uuid();
    const resultProduct = await client.query(QUERY_PRODUCTS, [id, title, description, price]);
    const resultCount = await client.query(QUERY_STOCKS, [id, count]);

    return RESPONSE._200({ ...resultProduct.rows, ...resultCount.rows });
  } catch (e) {
    return RESPONSE._500();
  } finally {
    await client.end();
  }
};
