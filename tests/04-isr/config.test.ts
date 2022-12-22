import path from 'path';
import { expect, it } from 'vitest';
import { vercelOutputConfigSchema } from '../../../../packages/vercel/src/schemas/config/config';
import { prepareTestJsonFileContent, testSchema } from '../common/helpers';

prepareTestJsonFileContent(
  path.basename(__dirname),
  'config.json',
  (context) => {
    testSchema(context, vercelOutputConfigSchema);

    it('should have defaults routes only', function () {
      expect(context.file).toHaveProperty('routes', [
        {
          headers: { Location: '/$1' },
          src: '^/(?:(.+)/)?index(?:\\.html)?/?$',
          status: 308,
        },
        {
          headers: { Location: '/$1' },
          src: '^/(.*)\\.html/?$',
          status: 308,
        },
        { handle: 'filesystem' },
        {
          src: '^/edge(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?$',
          dest: '/edge/$1',
          check: true,
        },
        {
          check: true,
          src: '^/api/page$',
          dest: '/api/page',
        },
        {
          check: true,
          src: '^/api/post$',
          dest: '/api/post',
        },
        { check: true, dest: 'page1/?__original_path=$1', src: '^(/page1)$' },
      ]);
      expect(context.file).toHaveProperty('overrides', {
        'test.html': {
          path: 'test',
        },
        'tests/common/index.html': {
          path: 'tests/common/index',
        },
      });
      expect(Object.keys(context.file as any).sort()).toEqual(
        ['version', 'overrides', 'routes'].sort(),
      );
    });
  },
);
