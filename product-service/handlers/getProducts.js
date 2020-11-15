import { getClient } from '../db/db';
import { RESPONSE } from '../../utils/response';

const QUERY = 'SELECT id, title, description, price, count FROM products LEFT JOIN stocks ON id = product_id';

export const getProducts = async (event) => {
  console.log('Entered get products lambda function, event: ', event);
  const client = getClient();

  try {
    await client.connect();

    const result = await client.query(QUERY);

    return RESPONSE._200(result.rows);
  } catch (e) {
    return RESPONSE._500();
  } finally {
    await client.end();
  }
};
