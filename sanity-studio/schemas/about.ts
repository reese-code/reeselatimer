import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'svgIcon',
      title: 'SVG Icon',
      type: 'image',
      description: 'SVG icon that appears next to the main text',
      options: {
        accept: 'image/svg+xml',
      },
    }),
    defineField({
      name: 'mainText',
      title: 'Main Text',
      type: 'text',
      description: 'The large text that appears next to the SVG icon',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstParagraph',
      title: 'First Paragraph',
      type: 'text',
      description: 'The first paragraph of body text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondParagraph',
      title: 'Second Paragraph',
      type: 'text',
      description: 'The second paragraph of body text',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mainText',
      media: 'mainImage',
    },
  },
})
