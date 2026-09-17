export default {
  name: 'alsoBuildingEntry',
  title: 'Also Building Entry',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "The Thinking Architect (TTA)"',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'link',
      title: 'Link',
      type: 'url',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'link',
      order: 'order',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: title || 'Untitled Entry',
        subtitle: `${order !== undefined ? `#${order} • ` : ''}${subtitle || 'No link'}`,
      };
    },
  },
};
