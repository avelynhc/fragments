const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
// const buffer = require("buffer");

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if(id) this.id = id;
    else this.id = randomUUID();

    if(ownerId) this.ownerId = ownerId;
    else throw 'ownerId is required';

    if(created) this.created = created;
    else this.created = new Date();

    if(updated) this.updated = updated;
    else this.updated = new Date();

    if(type) {
      if(!Fragment.isSupportedType(type)) throw 'invalid types throw'
      this.type = type;
    } else throw 'type is required';

    if(size) {
      if(typeof(size)!=='number') throw 'size must be a number';
      if(size<0) throw 'size cannot be negative';
      this.size = size;
    } else this.size = 0;
  }
  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try{
      return await listFragments(ownerId, expand);
    } catch(err) {
      throw new Error('Error getting the list of fragment data')
    }
  }

  // /**
  //  * Gets a fragment for the user by the given id.
  //  * @param {string} ownerId user's hashed email
  //  * @param {string} id fragment's id
  //  * @returns Promise<Fragment>
  //  */
  static async byId(ownerId, id) {
    // TODO
    try {
      const data = await readFragment(ownerId, id);
      if(data) return new Fragment(data);
      else return data;
    } catch(error) {
      throw new Error('Error reading the fragment data');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    try {
      return deleteFragment(ownerId, id);
    } catch(error) {
      throw new Error('Error deleting the fragment data');
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    try {
      return writeFragment(this);
    } catch(error) {
      throw new Error('Error saving the fragment data to database');
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch(error) {
      throw new Error('Error getting the fragment data from the database');
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if(!Buffer.isBuffer(data)) throw Error('Given data is not a buffer')
    else {
      await this.save();
      try {
        return writeFragmentData(this.ownerId, this.id, data);
      } catch(error) {
        throw new Error('Error setting the fragment data in the database');
      }
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.includes('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let answer = [];
    answer.push(this.mimeType);
    return answer;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return value === 'text/plain' || value === 'text/plain; charset=utf-8';
  }
}

module.exports.Fragment = Fragment;