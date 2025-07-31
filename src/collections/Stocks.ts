import type { CollectionConfig } from 'payload'
export const stockOriginOptions: { label: string; value: string }[] = [
  { label: 'בורסה', value: 'TASE' },
  { label: 'חו״ל', value: 'Foreign' },
  { label: 'פרטי', value: 'Private' },
]
export const Stocks: CollectionConfig = {
  slug: 'stocks',
  labels: {
    plural: 'ניירות ערך',
    singular: 'נייר ערך',
  },
  custom: {
    filterList: [
      [{ name: 'type' }, { name: 'origin' }, { name: 'tradable' }, { name: 'active' }],
      [{ name: 'fromMagna' }, { name: 'isFinancial' }, { name: 'isDual' }],
    ],
  },
  enableQueryPresets: true,
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['stockId', 'type', 'longName', 'origin', 'tradable', 'active'],
    listSearchableFields: ['symbol', 'stockId', 'name', 'longName', 'comments'],
    pagination: {
      defaultLimit: 500,
      limits: [10, 20, 50, 100, 200, 500],
    },
    group: 'פעילות',
  },
  versions: {
    drafts: false,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'כללי',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'stockId',
                  type: 'text',
                  label: 'מספר נייר',
                  unique: true,
                  required: true,
                  index: true,
                  access: { update: () => false },

                },
                {
                  name: 'fullName',
                  label: 'שם מלא',
                  type: 'text', // Stored in the database
                  admin: {
                    hidden: true, // Hide in admin UI to prevent manual edits
                  },
                  index: true,
                  hooks: {
                    beforeChange: [
                      async ({ data }) => {
                        return `${data?.name}(${data?.stockId})`
                      },
                    ],
                  },
                },
                {
                  name: 'type',
                  label: 'סוג',
                  type: 'select',
                  interfaceName: 'StockType',
                  required: true,
                  options: [{value:'a',label:'aaa'}],
                  index: true,
                  admin: {
                    condition: (siblingData) => siblingData.tradable,
                    width: '200px',
                  },
                },
                {
                  name: 'fromMagna',
                  label: 'ממגנא',
                  type: 'checkbox',
                  admin: {
                    hidden: true,
                  },
                  defaultValue: false,
                },
                {
                  name: 'origin',
                  label: 'מקור',
                  type: 'select',
                  interfaceName: 'StockOrigin',
                  options: stockOriginOptions,
                  index: true,
                  required: true,
                  defaultValue: 'TASE',
                  admin: {
                    width: '150px',
                  },
                },
                {
                  name: 'tradable',
                  label: 'האם נסחר',
                  type: 'checkbox',
                  admin: {
                    width: '150px',
                  },
                  access: {
                    update: ({ doc }) => !doc?.fromMagna,
                  },
                },
                {
                  name: 'relatedStock',
                  label: 'נייר ערך ראשי',
                  type: 'relationship',
                  relationTo: 'stocks',
                  index: true,
                  admin: {
                    width: '450px',
                    condition: (siblingData) => !siblingData.tradable,
                  },
                  filterOptions: ({ req }: any) => {
                    if (req.context?.from == 'migration' || req.context?.from == 'process') {
                      return true
                    }
                    return {
                      tradable: { equals: true },
                    }
                  },
                },
                {
                  name: 'active',
                  label: 'נייר ערך פעיל',
                  type: 'checkbox',
                  index: true,
                  defaultValue: true,
                  access: {
                    update: ({ doc }) => !doc?.relatedStock,
                  },
                  admin: {
                    width: '150px',
                  },

                },
                {
                  name: 'isFinancial',
                  label: 'פיננסי',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '100px',
                    condition: (siblingData) => siblingData.type == 'מניות',
                  },
                },

                {
                  name: 'isDual',
                  label: 'דואלית',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '100px',
                    condition: (siblingData) =>
                      siblingData.tradable && siblingData.origin == 'TASE',
                  },
                },
                {
                  name: 'dualStock',
                  label: 'נייר ערך דואלי',
                  type: 'relationship',
                  relationTo: 'stocks',
                  admin: {
                    condition: (siblingData) => siblingData.isDual,
                    width: '400px',
                  },
                  filterOptions: ({ req }: any) => {
                    if (req.context?.from == 'migration' || req.context?.from == 'process') {
                      return true
                    }
                    return {
                      origin: { equals: 'Foreign' },
                    }
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'symbol',
                  label: 'סימול',
                  type: 'text',
                  index: true,
                  admin: { condition: (siblingData) => siblingData.tradable },
                },
                {
                  name: 'name',
                  label: 'שם נייר ערך',
                  type: 'text',
                  index: true,
                  admin: { condition: (siblingData) => siblingData.tradable },
                },
                {
                  name: 'longName',
                  label: 'שם חברה',
                  type: 'text',
                  admin: {
                    condition: (siblingData) =>
                      siblingData.tradable || siblingData.origin == 'Private',
                  },
                },
              ],
            },
            {
              name: 'comments',
              label: 'הערות',
              index: true,
              type: 'textarea',
            },
          ],
        },
        {
          label: 'ניירות ערך עוקבים',
          admin: { condition: (siblingData) => siblingData.tradable },
          fields: [
            {
              name: 'relations',
              label: 'ניירות ערך עוקבים',
              type: 'join',
              collection: 'stocks',
              on: 'relatedStock',
              //              _sanitized: true,
              admin: {
                defaultColumns: ['stockId', 'type', 'symbol', 'name', 'longName'],
              },
            },
          ],
        },
        {
          label: 'אסיפות',
          admin: {
            condition: (siblingData) => siblingData.tradable || siblingData.origin == 'Private',
          },
          fields: [
            {
              name: 'meetings',
              label: 'אסיפות',
              type: 'join',
              collection: 'meetings',
              on: 'stock',
              _sanitized: true,
              admin: {
                defaultColumns: ['meetingId', 'meetingDate', 'meetingType'],
              },
            },
          ],
        },
      ],
    },
  ],

}
