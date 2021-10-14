import axios, { AxiosError } from 'axios';

import { apiUrl, parseList } from './config';
import {
  Order,
  Hero,
  AccountRepresentative,
  ShippingStatus,
} from '../interfaces';

const getHeroAsync = async function(email: string) {
  try {
    const response = await axios.get(`${apiUrl}/heroes?email=${email}`);
    const data = parseList<Hero>(response);
    const hero = data[0];
    return hero;
  } catch (error) {
    handleAxiosErrors(error, 'Hero')
  }
};

const getOrdersAsync = async function(heroId: number) {
  try {
    const response = await axios.get(`${apiUrl}/orders/${heroId}`);
    const data = parseList<Order>(response);
    return data;
  } catch (error) {
    handleAxiosErrors(error, 'Order')
  }
};

const getAccountRepAsync = async function(heroId: number) {
  try {
    const response = await axios.get(`${apiUrl}/accountreps/${heroId}`);
    const data = parseList<AccountRepresentative>(response);
    return data[0];
  } catch (error) {
    handleAxiosErrors(error, 'Account Reps')
  }
};

const getShippingStatusAsync = async function(orderNumber: number) {
  try {
    const response = await axios.get(`${apiUrl}/shippingstatuses/${orderNumber}`);
    const data = parseList<ShippingStatus>(response);
    return data[0];
  } catch (error) {
    handleAxiosErrors(error, 'Shipping Status')
  }
};

const getHeroTreeAsync = async function(email: string) {
  const hero = await getHeroAsync(email);
  if (!hero) return;

  const [orders, accountRep] = await Promise.all([
    getOrdersAsync(hero.id),
    getAccountRepAsync(hero.id)
  ]);

  hero.orders = orders;
  hero.accountRep = accountRep;

  const getAllStatusesAsync = orders.map(async(o: Order) => await getShippingStatusAsync(o.num));

  // const shippingStatuses = await Promise.all(getAllStatusesAsync);

  // for (const ss of shippingStatuses) {
  //   const order = hero.orders.find((o: Order) => o.num === ss.orderNum);
  //   order.shippingStatus = ss;
  // }

  for await (let ss of getAllStatusesAsync) {
    const order = hero.orders.find((o: Order) => o.num === ss.orderNum);
    order.shippingStatus = ss;
  }

  return hero;
};

function handleAxiosErrors(error: AxiosError, model: string) {
  console.error(`Developer Error: Async Data Error: ${error.message}`);
  throw new Error(`Oh no! We're unable to fetch the ${model}`);
}

export { getHeroTreeAsync };
