const logger = require('../../../logger');
const validateKey = (key) => typeof key === 'string';

class MemoryDB {
  constructor() {
    /** @type {Record<string, any>} */
    this.db = {};
  }

// Gets a value for the given primaryKey and secondaryKey
  get(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    const db = this.db;
    const value = db[primaryKey] && db[primaryKey][secondaryKey];
    logger.info({value}, 'Got the value for GET');
    return Promise.resolve(value);
  }

// Puts a value into the given primaryKey and secondaryKey
  put(primaryKey, secondaryKey, value) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    const db = this.db;
    // Make sure the `primaryKey` exists, or create
    db[primaryKey] = db[primaryKey] || {};
    // Add the `value` to the `secondaryKey`
    db[primaryKey][secondaryKey] = value;
    return Promise.resolve();
  }

// Queries the list of values (i.e., secondaryKeys) for the given primaryKey.
// Always returns an Array, even if no items are found.
  query(primaryKey) {
    if (!validateKey(primaryKey)) {
      throw new Error(`primaryKey string is required, got primaryKey=${primaryKey}`);
    }
    const db = this.db;
    const values = db[primaryKey] ? Object.values(db[primaryKey]) : [];
    logger.info({values}, 'Got the array of value (secondaryKeys) for QUERY');
    return Promise.resolve(values);
  }

// Deletes the value with the given primaryKey and secondaryKey
  async del(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    // Throw if trying to delete a key that doesn't exist
    if (!(await this.get(primaryKey, secondaryKey))) {
      throw new Error(
        `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
      );
    }
    const db = this.db;
    delete db[primaryKey][secondaryKey];
    return Promise.resolve();
  }
}

module.exports = MemoryDB;