const { writeFragment, readFragment, writeFragmentData, readFragmentData, listFragments } = require('../../src/model/data/memory');

describe('fragment database', () => {
  test('readFragment() returns what we writeFragment(data) into the db', async() => {
    const data = {
      ownerId: 'def',
      id: 'abc'
    };
    await writeFragment(data); // call put()
    const getResult = await readFragment(data.ownerId, data.id);
    expect(getResult).toEqual(data);
  });

  test('readFragment() with incorrect secondaryKey returns nothing', async() => {
    const data = {
      ownerId: 'def',
      id: 'abc'
    };
    await writeFragment(data);
    const result = await readFragment('def', 'aaa');
    expect(result).toEqual(undefined);
  });

  test('readFragmentData() returns what we writeFragmentData(data) into the db', async() => {
    await writeFragmentData('abc', 'def', 123);
    const getResult = await readFragmentData('abc', 'def');
    expect(getResult).toEqual(123);
  });

  test('readFragmentData() with incorrect secondaryKey returns nothing', async() => {
    await writeFragmentData('abc', 'def', 123);
    const getResult = await readFragmentData('abc', 'ddd');
    expect(getResult).toEqual(undefined);
  });

  test('listFragment() returns all secondaryKey values', async() => {
    const data1 = {
      ownerId: 'abc',
      id: 'aaa'
    };
    const data2 = {
      ownerId: 'abc',
      id: 'bbb'
    };
    const data3 = {
      ownerId: 'abc',
      id: 'ccc'
    };
    await writeFragment(data1);
    await writeFragment(data2);
    await writeFragment(data3);

    const results = await listFragments('abc', false);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual(['aaa','bbb','ccc']);
  });

  // test('deleteFragment()', async() => {
  //   const data = {
  //     ownerId: 'def',
  //     id: 'abc'
  //   };
  //   await writeFragment(data);
  //   expect(await readFragment(data.ownerId, data.id)).toEqual(data);
  //   await deleteFragment(data.ownerId, data.id);
  //   expect(await readFragment(data.ownerId, data.id)).toBe(undefined);
  // });
})