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
      name: 'heroLogo',
      title: 'Hero Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Upload the CIAO logo for the hero section'
    },
    {
      name: 'firstImage',
      title: 'First Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'secondImage',
      title: 'Second Image',
      type: 'image',
      options: {
        hotspot: true
      }
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
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bottomSecondImage',
      title: 'Bottom Second Image (Flipped)',
      type: 'image',
      options: {
        hotspot: true
      }
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
