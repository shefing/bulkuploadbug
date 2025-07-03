import { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

export const beforeValidaCompaniesFromFilename: CollectionBeforeValidateHook =
  async ({  data,  req})=>{
  const filename = data?.file?.filename || data?.filename
  if (!filename) return data
    return data
}

export const ResearchDocument: CollectionConfig = {
  slug: 'research-documents',
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
  upload: {
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
    ],
  },
  fields: [
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      index: true,
      hasMany: true,
      admin: {
        allowCreate: false,
      },
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
  ],
  hooks: {
    beforeValidate: [beforeValidaCompaniesFromFilename],
  },
}


