export default {
  name: 'about',
  title: 'About / Bio',
  type: 'document',
  fields: [
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The main About page copy (rich text / portable text)',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'philosophy',
      title: 'Philosophy / Approach',
      type: 'text',
      rows: 4,
      description: 'The shorter "approach"/positioning statement used on the About page',
    },
  ],
  preview: {
    select: {
      media: 'photo',
    },
    prepare({ media }) {
      return {
        title: 'About / Bio',
        media,
      };
    },
  },
};
