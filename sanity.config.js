import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

export default defineConfig({
  name: 'ivo-studio',
  title: 'IVO Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'u1vwbcb0',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
