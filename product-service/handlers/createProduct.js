import { getClient } from '../db/db';
import { RESPONSE } from '../utils/response';

const QUERY_PRODUCTS = 'INSERT INTO products(title, description, price) VALUES($1,$2,$3) RETURNING *';
const QUERY_STOCKS = 'INSERT INTO stocks(product_id, count) VALUES($1,$2) RETURNING *';

export const createProduct = async (event) => {
  console.log('Entered create product lambda function, event: ', event);
  const client = getClient();

  try {
    const data = JSON.parse(event.body);
    const { title = null, description = '', price = 0, count } = data;

    if (!data || !title || !price || !count) {
      RESPONSE._404('Invalid product data');
    }

    await client.connect();

    const { rows } = await client.query(QUERY_PRODUCTS, [title, description, price]);
    const id = rows[0].id;
    const resultCount = await client.query(QUERY_STOCKS, [id, count]);
    const product = { ...rows[0], ...resultCount.rows[0] };

    console.log('Created product: ', product);
    return RESPONSE._200(product);
  } catch (e) {
    return RESPONSE._500();
  } finally {
    await client.end();
  }
};
