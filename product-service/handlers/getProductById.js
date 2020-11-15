import { validate } from 'uuid';
import { getClient } from '../db/db';
import { RESPONSE } from '../../utils/response';

const QUERY =
  'SELECT id, title, description, price, count FROM products LEFT JOIN stocks ON id = product_id WHERE id = $1';

export const getProductById = async (event) => {
  console.log('Entered get product lambda function, event: ', event);
  const client = getClient();

  try {
    const { id } = event.pathParameters || {};

    if (!validate(id)) {
      return RESPONSE._400(`Product id ${id} is not valid`);
    }

    await client.connect();

    const result = await client.query(QUERY, [id]);

    if (!result) {
      return RESPONSE._404(`Product with id ${id} not found`);
    }

    return RESPONSE._200(result.rows[0]);
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  } finally {
    await client.end();
  }
};
