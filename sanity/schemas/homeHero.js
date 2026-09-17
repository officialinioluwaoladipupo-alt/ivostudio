export default {
  name: 'homeHero',
  title: 'Home Hero',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The main hero statement',
      validation: (rule) => rule.required(),
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
      description: 'Supporting line under the headline',
    },
    {
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      description: 'e.g. "See the Work"',
    },
    {
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      description: 'Internal page path or external URL',
    },
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subtext',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Home Hero',
        subtitle: subtitle || undefined,
      };
    },
  },
};
