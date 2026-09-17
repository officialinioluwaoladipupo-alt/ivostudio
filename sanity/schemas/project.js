export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Short summary for project cards and previews',
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Used in listings, separate from the full case-study description',
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'projectType',
      title: 'Project Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Residential', value: 'Residential' },
          { title: 'Urban Research', value: 'Urban Research' },
          { title: 'Installation', value: 'Installation' },
          { title: 'Public Space', value: 'Public Space' },
          { title: 'Academic', value: 'Academic' },
          { title: 'Conceptual', value: 'Conceptual' },
        ],
      },
      description: 'Select one or more project types',
    },
    {
      name: 'scale',
      title: 'Scale',
      type: 'string',
      description: 'e.g. area or size descriptor',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'processImages',
      title: 'Process Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Sketches and process work, separate from final gallery',
    },
    {
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Video Type',
          type: 'string',
          options: {
            list: [
              { title: 'External URL (YouTube/Vimeo)', value: 'url' },
              { title: 'Hosted Video File', value: 'file' },
            ],
            layout: 'radio',
          },
          initialValue: 'url',
        },
        {
          name: 'url',
          title: 'Video URL',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'url',
        },
        {
          name: 'file',
          title: 'Video File',
          type: 'file',
          hidden: ({ parent }) => parent?.type !== 'file',
        },
      ],
    },
    {
      name: 'model3d',
      title: '3D Model',
      type: 'file',
      options: {
        accept: '.glb,.gltf',
      },
      description: 'Accepts .glb/.gltf',
    },
    {
      name: 'caseStudy',
      title: 'Case Study',
      type: 'object',
      fields: [
        { name: 'brief', title: 'Brief', type: 'text', rows: 4 },
        { name: 'concept', title: 'Concept', type: 'text', rows: 4 },
        { name: 'process', title: 'Process', type: 'text', rows: 4 },
        { name: 'outcome', title: 'Outcome', type: 'text', rows: 4 },
      ],
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls manual display order in gallery',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'coverImage',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || 'Untitled Project',
        subtitle: `${subtitle ? `${subtitle} • ` : ''}${status || 'draft'}`,
        media,
      };
    },
  },
};
