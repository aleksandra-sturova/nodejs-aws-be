import { v4 } from 'uuid';
import { getClient } from '../db/db';
import { RESPONSE } from '../utils/response';

const QUERY_PRODUCTS = 'INSERT INTO products(id, title, description, price) VALUES($1,$2,$3,$4) RETURNING *';
const QUERY_STOCKS = 'INSERT INTO stocks(product_id, count) VALUES($1,$2) RETURNING *';

export const createProduct = async (event) => {
  const data = JSON.parse(event.body);
  const client = getClient();

  try {
    if (!data) {
      RESPONSE._404('Invalid product data');
    }

    await client.connect();

    const id = v4();
    const { title = null, description = '', price = 0, count } = data;
    const resultProduct = await client.query(QUERY_PRODUCTS, [id, title, description, price]);
    const resultCount = await client.query(QUERY_STOCKS, [id, count]);

    return RESPONSE._200({ ...resultProduct.rows[0], ...resultCount.rows[0] });
  } catch (e) {
    return RESPONSE._500();
  } finally {
    await client.end();
  }
};
