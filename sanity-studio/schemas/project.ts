import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'projectDate',
      title: 'Project Date',
      type: 'date',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [],
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [],
    }),
    defineField({
      name: 'tertiaryImage',
      title: 'Tertiary image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [],
    }),
    defineField({
      name: 'iconSvg',
      title: 'Icon SVG',
      type: 'image',
      description: 'SVG icon to display next to the project title',
      options: {
        accept: 'image/svg+xml',
        hotspot: true,
      },
      fields: [],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'text',
            title: 'Button Text',
            type: 'string',
          },
          {
            name: 'url',
            title: 'Button URL',
            type: 'url',
          }
        ]
      }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          fields: [
            {
              type: 'text',
              name: 'alt',
              title: 'Alternative text',
              description: 'Description of the image for accessibility.',
            },
          ],
        },
      ],
    }),
  ],
})
