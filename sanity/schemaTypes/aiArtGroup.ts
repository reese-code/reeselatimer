import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aiArtGroup',
  title: 'AI Art Group',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Group Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'string',
      description: 'Hex color for the group tag (e.g., #FF5733)',
      initialValue: '#AAA8A8',
    }),
  ],
})
