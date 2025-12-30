import * as migration_20251228_182218_add_instrument_type_and_year from './20251228_182218_add_instrument_type_and_year';
import * as migration_20251228_222955_add_orders_collection from './20251228_222955_add_orders_collection';
import * as migration_20251230_160250_add_model_and_string_vibration from './20251230_160250_add_model_and_string_vibration';
import * as migration_20251230_161607_add_stock_field from './20251230_161607_add_stock_field';

export const migrations = [
  {
    up: migration_20251228_182218_add_instrument_type_and_year.up,
    down: migration_20251228_182218_add_instrument_type_and_year.down,
    name: '20251228_182218_add_instrument_type_and_year',
  },
  {
    up: migration_20251228_222955_add_orders_collection.up,
    down: migration_20251228_222955_add_orders_collection.down,
    name: '20251228_222955_add_orders_collection',
  },
  {
    up: migration_20251230_160250_add_model_and_string_vibration.up,
    down: migration_20251230_160250_add_model_and_string_vibration.down,
    name: '20251230_160250_add_model_and_string_vibration',
  },
  {
    up: migration_20251230_161607_add_stock_field.up,
    down: migration_20251230_161607_add_stock_field.down,
    name: '20251230_161607_add_stock_field'
  },
];
