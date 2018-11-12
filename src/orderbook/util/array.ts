import {curry, update, indexOf} from 'ramda';

export const replace = curry(<T>(item: T, newItem: T, items: ReadonlyArray<T>) =>
  update(indexOf(item, items), newItem, items));