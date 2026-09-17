export default {
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Ibadan, Nigeria',
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            { name: 'platform', title: 'Platform Label', type: 'string', validation: (rule) => rule.required() },
            { name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required() },
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    },
    {
      name: 'privacyNote',
      title: 'Privacy Note',
      type: 'text',
      rows: 3,
      description: 'The short note shown near the contact form',
    },
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'location',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Contact Info',
        subtitle: subtitle || undefined,
      };
    },
  },
};
