import { expect } from 'chai';
import slugify from './index.js';
import { fixtures } from '../../index.js';

describe('utils/slugify', function () {
  it('should pass through a valid slug', function () {
    const thing = fixtures.slug();
    expect(slugify({ name: thing })).to.equal(thing);
  });

  it('should replace spaces with "-"', function () {
    expect(slugify({ name: 'some name' })).to.equal('some-name');
  });

  it('should replace multiple spaces with "-"', function () {
    expect(slugify({ name: 'three word slug' })).to.equal('three-word-slug');
  });

  it('should remove special characters', function () {
    expect(slugify({ name: 'someone+something' })).to.equal('someonesomething');
  });

  it('should replace multiple ---s with one', function () {
    expect(slugify({ name: 'not-----a--------valid----slug' })).to.equal('not-a-valid-slug');
  });

  it('should add the prefix to the slug', function () {
    expect(slugify({ name: 'some name', prefix: 'the-prefix' })).to.equal('the-prefix-some-name');
  });

  it('should not use a prefix of ""', function () {
    expect(slugify({ name: 'some name', prefix: '' })).to.equal('some-name');
  });

  it('should NOT fix the prefix', function () {
    expect(slugify({ name: 'some name', prefix: 'prefix----not----valid---slug-' })).to.equal('prefix----not----valid---slug--some-name');
  });

  it('should NOT add trailing dashs', function () {
    expect(slugify({ name: 'trailing space ', prefix: '' })).to.equal('trailing-space');
  });

  it('should NOT add leading dashs', function () {
    expect(slugify({ name: ' leading space', prefix: '' })).to.equal('leading-space');
  });

  it('should work with an emoji in the the name', function () {
    expect(slugify({ name: 'some name 👌' })).to.equal('some-name');
  });

  it('should work with multiple emojis at the end', function () {
    expect(slugify({ name: 'some name 👌 👌' })).to.equal('some-name');
  });

  it('should work with multiple emojis at the front of the name', function () {
    expect(slugify({ name: '👌 👌 some name' })).to.equal('some-name');
  });
});
