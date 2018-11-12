import React from 'react';
import {replace} from './array';

it('correctly replaces existing object', () => {
  const a = { name: 'a', count: 5 };
  const b = { name: 'b', count: 6 };
  const c = { name: 'c', count: 7 };
  const b2 = { ...b, count: 0 };

  const result = replace(b, b2, [a, b, c]);

  expect(result).toEqual([a, b2, c]);
});