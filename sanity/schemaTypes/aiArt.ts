import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aiArt',
  title: 'AI Art',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'groups',
      title: 'Image Groups',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'group',
          title: 'Group',
          fields: [
            {
              name: 'name',
              title: 'Group Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'color',
              title: 'Tag Color',
              type: 'string',
              description: 'Hex color for the group tag (e.g., #FF5733)',
              initialValue: '#AAA8A8',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'AI Art Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'artImage',
          title: 'Art Image',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'prompt',
              title: 'AI Prompt',
              type: 'text',
              rows: 3,
              description: 'The prompt used to generate this AI art',
            },
            {
              name: 'groupName',
              title: 'Group',
              type: 'string',
              description: 'Enter the exact name of the group this image belongs to',
            },
            {
              name: 'createdAt',
              title: 'Created At',
              type: 'datetime',
              initialValue: () => new Date().toISOString(),
            },
          ],
        },
      ],
    }),
  ],
})
