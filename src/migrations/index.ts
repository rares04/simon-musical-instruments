import * as migration_20251228_182218_add_instrument_type_and_year from './20251228_182218_add_instrument_type_and_year';
import * as migration_20251228_222955_add_orders_collection from './20251228_222955_add_orders_collection';

export const migrations = [
  {
    up: migration_20251228_182218_add_instrument_type_and_year.up,
    down: migration_20251228_182218_add_instrument_type_and_year.down,
    name: '20251228_182218_add_instrument_type_and_year',
  },
  {
    up: migration_20251228_222955_add_orders_collection.up,
    down: migration_20251228_222955_add_orders_collection.down,
    name: '20251228_222955_add_orders_collection'
  },
];
