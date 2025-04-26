import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name/logo text that appears in the top left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactText',
      title: 'Contact Text',
      type: 'string',
      description: 'Text that links to the contact page in the top right',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'taglineIcon',
      title: 'Tagline Icon',
      type: 'image',
      description: 'SVG icon that appears next to the tagline',
      options: {
        accept: 'image/svg+xml',
      },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'First line of text in the bottom left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subTagline',
      title: 'Sub Tagline',
      type: 'string',
      description: 'Second line of text in the bottom left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectsLinkText',
      title: 'Projects Link Text',
      type: 'string',
      description: 'Text for the link to projects section in the bottom right',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
