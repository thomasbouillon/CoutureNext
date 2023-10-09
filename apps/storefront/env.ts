import { envsafe, json, url } from 'envsafe';

export default envsafe({
  DIRECTUS_BASE_URL: url({
    devDefault: 'http://localhost:8055/items',
    input: process.env.NEXT_PUBLIC_DIRECTUS_URL,
  }),
  DIRECTUS_ASSETS_URL: url({
    devDefault: 'http://localhost:8055/assets',
    input: process.env.NEXT_PUBLIC_DIRECTUS_ASSETS_URL,
  }),
});
