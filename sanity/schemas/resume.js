export default {
  name: 'resume',
  title: 'Resume / CV',
  type: 'document',
  fields: [
    {
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'experienceItem',
          title: 'Experience Item',
          fields: [
            { name: 'role', title: 'Role', type: 'string', validation: (rule) => rule.required() },
            { name: 'organization', title: 'Organization', type: 'string', validation: (rule) => rule.required() },
            { name: 'dates', title: 'Dates', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'organization',
              description: 'dates',
            },
          },
        },
      ],
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'educationItem',
          title: 'Education Item',
          fields: [
            { name: 'institution', title: 'Institution', type: 'string', validation: (rule) => rule.required() },
            { name: 'program', title: 'Program / Degree', type: 'string' },
            { name: 'dates', title: 'Dates', type: 'string' },
            { name: 'notes', title: 'Notes', type: 'text', rows: 2 },
          ],
          preview: {
            select: {
              title: 'institution',
              subtitle: 'program',
              description: 'dates',
            },
          },
        },
      ],
    },
    {
      name: 'skillsAndTools',
      title: 'Skills & Tools',
      type: 'array',
      description: 'Grouped skill categories (e.g. Software, Methods) or individual skill names',
      of: [
        {
          type: 'object',
          name: 'skillCategory',
          title: 'Skill Category',
          fields: [
            { name: 'category', title: 'Category', type: 'string', validation: (rule) => rule.required() },
            { name: 'skills', title: 'Skills', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: {
            select: {
              title: 'category',
              skills: 'skills',
            },
            prepare({ title, skills }) {
              return {
                title: title || 'Category',
                subtitle: Array.isArray(skills) ? skills.join(', ') : '',
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Resume / CV',
      };
    },
  },
};
