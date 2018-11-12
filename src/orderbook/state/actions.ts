import { action } from 'typesafe-actions';

import {PutOrderPayload} from '../model';
import {PUT_ORDER, REMOVE_ORDER} from './constants';


export const putOrder = (order: PutOrderPayload) => action(PUT_ORDER, order);
export const removeOrder = (orderId: number) => action(REMOVE_ORDER, orderId);