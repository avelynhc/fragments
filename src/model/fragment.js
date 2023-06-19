const { randomUUID } = require('crypto');
const contentType = require('content-type');
const logger = require('../logger');
const mimeTypes = require('mime-types');
const markdownIt = require('markdown-it')({
  html: true,
});

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
  `text/markdown`,
  `text/html`,
  `application/json`,
  /*
  Others will be added later.
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
    else throw new Error('ownerId is required');

    if(created) this.created = created;
    else this.created = new Date().toISOString();

    if(updated) this.updated = updated;
    else this.updated = new Date().toISOString();

    if(type) {
      if(!Fragment.isSupportedType(type)) throw new Error('invalid types throw');
      this.type = type;
    } else throw 'type is required';

    if(size) {
      if(typeof(size)!=='number') throw new Error('size must be a number');
      if(size<0) throw new Error('size cannot be negative');
      this.size = size;
    } else this.size = 0;
  }

  // Get all fragments (id or full) for the given user
  static async byUser(ownerId, expand = false) {
      return listFragments(ownerId, expand);
  }

  // Gets a fragment for the user by the given id.
  static async byId(ownerId, id) {
    const data = await readFragment(ownerId, id);
    if(data) return new Fragment(data);
    else throw new EmptyFragmentError();
  }

  // Delete the user's fragment data and metadata for the given id
  static delete(ownerId, id) {
      return deleteFragment(ownerId, id);
  }

  // Saves the current fragment to the database
  save() {
    this.updated = new Date();
      return writeFragment(this);
  }

  // Gets the fragment data from the database
  getData() {
      return readFragmentData(this.ownerId, this.id);
  }

  // Set the fragment  data in the database
  async setData(data) {
    if(!Buffer.isBuffer(data)) throw Error('Given data is not a Buffer')
    else {
      this.updated = new Date();
      this.size = Buffer.byteLength(data);
      await this.save();
        return writeFragmentData(this.ownerId, this.id, data);
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
    const mimeType = this.mimeType;
    logger.debug({ mimeType }, 'mimeType of current user');
    if(this.mimeType==='text/plain') return ['text/plain'];
    else if(this.mimeType==='text/markdown') return ['text/markdown', 'text/html', 'text/plain'];
    else if(this.mimeType==='text/html') return ['text/html', 'text/plain'];
    else if(this.mimeType==='application/json') return ['application/json', 'text/plain'];
    return [];
    // else return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
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

  async typeConversion(rawData, extension) {
    let convertedContentType = mimeTypes.lookup(extension); // convert extension to desired content type
    logger.debug({ convertedContentType }, 'Converted content type');
    if(!Fragment.isSupportedType(convertedContentType)) throw new Error('415');
    if(!this.formats.includes(convertedContentType)) {
      logger.warn({ extension, convertedContentType }, 'Given content type cannot be converted');
      throw new Error('415');
    }
    let convertedData = rawData;
    if(this.mimeType!==convertedContentType) {
      if (convertedContentType === 'text/plain') {
        convertedData = rawData.toString();
      } else if(convertedContentType === 'text/html') {
        convertedData = markdownIt.render(Buffer.from(convertedData).toString());
      }
      logger.debug({ convertedData }, 'Converted data');
    }
    return {
      data: convertedData,
      type: convertedContentType
    }
  }
}

module.exports.Fragment = Fragment;
module.exports.EmptyFragmentError = EmptyFragmentError;