const { randomUUID } = require('crypto');
const contentType = require('content-type');

class EmptyFragmentError extends Error {
  constructor() {
    super("Fragment is empty");
  }
}

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  `text/plain`,
  /*
   Currently, only text/plain is supported. Others will be added later.

  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
  */
];

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

  // Get all fragments (id or full) for the given user
  static async byUser(ownerId, expand = false) {
    try{
      return await listFragments(ownerId, expand);
    } catch(error) {
      throw new Error(error + 'Error getting the list of fragment data')
    }
  }

  // Gets a fragment for the user by the given id.
  static async byId(ownerId, id) {
    const data = await readFragment(ownerId, id);
    if(data) return new Fragment(data);
    else throw new EmptyFragmentError();
  }

  // Delete the user's fragment data and metadata for the given id
  static delete(ownerId, id) {
    try {
      return deleteFragment(ownerId, id);
    } catch(error) {
      throw new Error(error + 'Error deleting the fragment data');
    }
  }

  // Saves the current fragment to the database
  save() {
    this.updated = new Date();
    try {
      return writeFragment(this);
    } catch(error) {
      throw new Error(error + 'Error saving the fragment data to the database');
    }
  }

  // Gets the fragment data from the database
  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch(error) {
      throw new Error(error + 'Error getting the fragment data from the database');
    }
  }

  // Set the fragment  data in the database
  async setData(data) {
    if(!Buffer.isBuffer(data)) throw Error('Given data is not a Buffer')
    else {
      this.updated = new Date();
      this.size = Buffer.byteLength(data);
      await this.save();
      try {
        return writeFragmentData(this.ownerId, this.id, data);
      } catch(error) {
        throw new Error(error + 'Error setting the fragment data in the database');
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
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];
      case 'text/html':
        return ['text/html', 'text/plain'];
      case 'application/json':
        return ['application/json', 'text/plain'];
      default:
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    }
  }
  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value
   * (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // check if value includes each element in validTypes
    // if at least one element passes the test -> return true
    return validTypes.some(element => value.includes(element));
  }

  async typeConversion(extension) {
    let convertedType;
    if(extension==='txt') {
      convertedType = 'text/plain';
    } else if(extension==='md') {
      convertedType = 'text/markdown';
    } else if(extension==='html') {
      convertedType = 'text/html';
    } else if(extension==='json') {
      convertedType = 'application/json';
    } else if(extension==='png') {
      convertedType = 'image/png';
    } else if(extension==='jpeg') {
      convertedType = 'image/jpeg';
    } else if(extension==='webp') {
      convertedType = 'image/webp';
    } else if(extension==='gif') {
      convertedType = 'image/gif';
    }
    return convertedType;
  }
}

module.exports.Fragment = Fragment;
module.exports.EmptyFragmentError = EmptyFragmentError;