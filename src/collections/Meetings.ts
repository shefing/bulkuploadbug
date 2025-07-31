import type { Field } from 'payload'
import { type CollectionConfig } from 'payload'


const votingRecommendation = [
  {
    type: 'row',
    fields: [
      {
        name: 'votingRecommendation',
        label: 'Voting Recommendation',
        type: 'select',
        admin: {
          width: '10%',
        },
        options: [
          { label: '----', value: '----' },
          { label: 'בעד', value: 'בעד' },
          { label: 'נגד', value: 'נגד' },
          { label: 'נמנע', value: 'נמנע' },
          { label: 'דיון', value: 'דיון' },
        ],
      },
      {
        name: 'reasonRef',
        label: 'System Reason',
        type: 'text',
        defaultValue: null,
        hasEmptyOption: true,

      },
      {
        name: 'reasonText',
        label: 'Free Reason',
        type: 'text',

      },
    ],
  },
]
const votingRecommendationExceptional = JSON.parse(JSON.stringify(votingRecommendation))
votingRecommendationExceptional.forEach((row: Field) => {
  row.admin = { condition: (_, siblingData) => siblingData?.showExceptional === true }
})

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  labels: {
    plural: 'Meetings',
    singular: 'Meeting',
  },
  custom: {
    filterList: [
      [
        { name: 'meetingDate' },
        { name: 'holdingsLimit' },
        { name: 'proxyVotingDate' },
        { name: 'state', width: '200px' },
        { name: 'type', width: '200px' },
      ],
      [
        { name: 'resultsConfirmationStatus' },
        { name: 'electronicVotingEnabled' },
        { name: 'votesStatus' },
        { name: 'votesReportStatus' },
        { name: '_status' },
      ],
    ],
  },
  enableQueryPresets: true,
  defaultSort: 'meetingDate',
  admin: {
    useAsTitle: 'fullName',
    group: 'Activity',

    listSearchableFields: ['fullName', 'magnaId', 'invitationLink', 'meetingId'],
    defaultColumns: [
      'fullName',
      'type',
      'meetingDate',
      'holdingsLimit',
      'proxyVotingDate',
      'votesCount',
      'reportVotesCount',
      'votesStatus',
      'votesReportStatus',
      'electronicVotingEnabled',
      'invitationLink',
    ],
    pagination: {
      defaultLimit: 100,
      limits: [10, 20, 50, 100, 200, 500],
    },
  },
  versions: {
    drafts: true,
    maxPerDoc: 5,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'stock',
                  label: 'Stock',
                  type: 'relationship',
                  relationTo: 'stocks',
                  index: true,
                  required: true,
                  admin: {
                    width: '330px',
                  },
                },
                {
                  type: 'text',
                  virtual: 'stock.origin',
                  name :'origin'
                },
                {
                  name: 'type',
                  label: 'Type',
                  index: true,
                  type: 'select',
                  interfaceName: 'MeetingType',
                  options: [],
                  admin: {
                    width: '150px',
                  },
                },
                {
                  name: 'meetingId',
                  label: 'Meeting Number',
                  type: 'text',
                  unique: true,
                  index: true,
                  admin: { width: '100px' },
                },
                {
                  name: 'magnaId',
                  label: 'Reference',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '150px',
                  },
                },
                {
                  name: 'invitationLink',
                  label: 'Invitation',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '200px',


                  },
                },
                {
                  name: 'invitationDocument',
                  label: 'Invitation Document',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    className: 'invitationDocument',
                    width: '220px',
                  },
                },
                {
                  name: 'fullName',
                  label: 'Name',
                  type: 'text', // Stored in the database
                  admin: {
                    hidden: true, // Hide in admin UI to prevent manual edits
                  },
                  index: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'state',
                  label: 'Status',
                  type: 'select',
                  hooks: {
                    beforeChange: [
                      ({ siblingData, value }) => {
                        if (value === 'on-hold') {
                          siblingData.meetingDate = null
                        }
                        return value
                      },
                    ],
                  },
                  interfaceName: 'MeetingState',
                  options: [],
                  admin: {
                    width: '150px',
                  },
                },
                {
                  name: 'holdingsLimit',
                  label: 'Record Date',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '200px',
                    date: {
                      displayFormat: 'dd/MM/yyyy',
                      pickerAppearance: 'default',
                    },
                  },
                },
                {
                  name: 'proxyVotingDate',
                  label: 'Proxy Voting Deadline',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '220px',

                    date: {
                      displayFormat: 'HH:mm dd/MM/yyyy',
                      pickerAppearance: 'dayAndTime',
                    },
                  },

                },
                {
                  name: 'meetingDate',
                  label: 'Meeting Date',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '220px',
                    date: {
                      displayFormat: 'HH:mm dd/MM/yyyy',
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dualMeeting',
                  type: 'relationship',
                  relationTo: 'meetings',
                  hasMany: false,
                  label: 'Dual Meeting',
                  admin: {
                    readOnly: true,
                    width: '50%',
                    condition: (data) => Boolean(data?.dualMeeting),
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  label: 'Address',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'comments',
                  label: 'Comments',
                  type: 'textarea',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'resultsConfirmationStatus',
                  label: 'Results Confirmation',
                  type: 'checkbox',
                  admin: {
                    width: 'auto',
                    condition: (siblingData) => siblingData.state === 'completed',
                  },
                },
                {
                  name: 'electronicVotingEnabled',
                  label: 'Is in Electronic System?',
                  type: 'checkbox',
                  admin: { width: 'auto', disableListFilter: true },
                },
              ],
            },
          ],
        },
        {
          label: 'Agenda',
          fields: [
            {
              name: 'agenda',
              label: 'Topics',
              type: 'array',
              interfaceName: 'MeetingAgenda',
              labels: {
                singular: 'Topic',
                plural: 'Topics',
              },
              admin: {
                initCollapsed: true,
                className: 'agenda-style-wrapper',
              },
              fields: [
                {
                  name: 'text',
                  label: 'Topic Content',
                  type: 'textarea',
                  required: true,
                  admin: {
                    className: 'agendaText',
                    style: { minHeight: '37px' },
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'isRemovedFromAgenda',
                      label: 'Removed from Agenda',
                      type: 'checkbox',
                      admin: { width: '200px', disableListFilter: true },
                    },
                    {
                      name: 'topicType',
                      label: 'Topic Type',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'For Reporting Only', value: 'reporting' },
                        { label: 'For Decision', value: 'decision' },
                      ],
                      admin: {
                        width: '200px',
                      },
                    },
                    {
                      name: 'majorityType',
                      label: 'Required Majority Type',
                      type: 'select',
                      options: [
                        { label: 'Regular Majority', value: 'regular' },
                        { label: 'Special Majority', value: 'privileged' },
                      ],
                      admin: {
                        width: '200px',

                        condition: (_, siblingData) => {
                          return siblingData.topicType === 'decision'
                        },
                      },
                    },
                  ],
                },

                {
                  name: 'recommendation',
                  type: 'group',
                  fields: votingRecommendation as Field[],
                },
                {
                  type: 'group',
                  name: 'exceptionalRecommendation',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'showExceptional',
                          label: 'Exceptional Recommendation',
                          type: 'checkbox',
                          admin: {
                            width: '155px',
                          },
                        },
                      ],
                    },
                    ...(votingRecommendationExceptional as Field[]),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'result',
                      label: 'Decision',
                      type: 'select',
                      admin: {
                        width: '30%',

                        condition: (value, siblingData) =>
                          siblingData.topicType === 'decision' && value?.state === 'completed',
                      },
                      options: [
                        { label: '---', value: '0' },
                        { label: 'Approved', value: '1' },
                        { label: 'Not Approved', value: '2' },
                        { label: 'Discussion', value: '3' },
                      ],
                    },
                    {
                      name: 'vPercentSpecial',
                      label: 'Result in Percentage',
                      type: 'number',
                      admin: {
                        width: '15%',

                        step: 0.01,
                        condition: (_, siblingData) =>
                          siblingData.topicType === 'decision' &&
                          siblingData.majorityType === 'privileged' &&
                          siblingData.result,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Research Documents',
          admin: {
            condition: (data) => data?.companies?.length > 0,
          },
          fields: [
            {
              name: 'researchDocuments',
              label: 'Research Document',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },

      ],
    },
  ],

}
