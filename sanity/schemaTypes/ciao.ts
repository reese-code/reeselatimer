export default {
  name: 'ciao',
  title: 'CIAO Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'CIAO'
    },
    {
      name: 'heroLogoUrl',
      title: 'Hero Logo URL',
      type: 'url',
      description: 'URL for the CIAO logo displayed in the hero section'
    },
    {
      name: 'firstImage',
      title: 'First Image',
      type: 'object',
      fields: [
        {
          name: 'imageUrl',
          title: 'Image URL',
          type: 'url'
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'secondImage',
      title: 'Second Image',
      type: 'object',
      fields: [
        {
          name: 'imageUrl',
          title: 'Image URL',
          type: 'url'
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'problemCard',
      title: 'Problem Card',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{type: 'block'}]
        }
      ]
    },
    {
      name: 'solutionCard',
      title: 'Solution Card',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{type: 'block'}]
        }
      ]
    },
    {
      name: 'bottomFirstImage',
      title: 'Bottom First Image (Flipped)',
      type: 'object',
      fields: [
        {
          name: 'imageUrl',
          title: 'Image URL',
          type: 'url'
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'bottomSecondImage',
      title: 'Bottom Second Image (Flipped)',
      type: 'object',
      fields: [
        {
          name: 'imageUrl',
          title: 'Image URL',
          type: 'url'
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'extraContent',
      title: 'Extra Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Additional content that can be added below the problem-solution cards'
    }
  ]
}
