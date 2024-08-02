import { expect, test } from 'vitest';
import { Slug } from './Slug';

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question title');

  expect(slug.getValue()).toBe('example-question-title');
});
