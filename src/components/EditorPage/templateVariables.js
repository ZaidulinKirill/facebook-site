export const templateVariables = [
  {
    name: 'Meta title',
    type: 'text',
  },
  {
    name: 'Banner text',
    type: 'text',
  },
  {
    name: 'Banner text color',
    type: 'color',
  },
  {
    name: 'Banner image',
    type: 'image',
    default: 'url(https://dummyimage.com/1200x300/eee/ddd&text=%5BBanner%20image%5D)',
  },
  {
    name: 'Facebook link',
    type: 'link',
  },
  {
    name: 'Instagram link',
    type: 'link',
  },
  {
    name: 'Main form',
    type: 'form',
    tab: 'form',
    cols: {
      cols: 12,
    },
  },
  {
    name: 'Video list',
    type: 'array',
    dialogWidth: 800,
    fields: [
      { text: 'Video', value: 'video', required: true },
      { text: 'Header', value: 'header', required: true },
      { text: 'Subheader', value: 'subheader', required: true },
      { text: 'Content', value: 'content', type: 'textArea', rows: 4 },
    ],
    headers: [
      { text: 'Header', value: 'header' },
      { text: 'Video', value: 'video' },
    ],
  },
  {
    name: 'Menu items',
    type: 'array',
    dialogWidth: 800,
    fields: [
      { text: 'Text', value: 'text', required: true },
      { text: 'Link', value: 'href', required: true },
    ],
    headers: [
      { text: 'Text', value: 'text' },
      { text: 'Link', value: 'href' },
    ],
  },
  {
    name: 'Video carousel items',
    type: 'array',
    dialogWidth: 800,
    fields: [
      { text: 'Video', value: 'video', required: true },
      { text: 'Name', value: 'name', required: true },
    ],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Video', value: 'video' },
    ],
  },
  {
    name: 'Image carousel items',
    type: 'array',
    dialogWidth: 800,
    fields: [
      { text: 'Image', value: 'url', type: 'image', required: true },
    ],
    headers: [
      { text: 'Image', value: 'image' },
      // { text: 'Video', value: 'video' },
    ],
  },
  {
    name: 'Top 35 snippet',
    type: 'text',
  },
  {
    name: 'Global styles',
    type: 'text',
  },
  {
    name: '__tabs',
    tabs: [
      {
        icon: 'mdi-tune',
        name: 'main',
      },
      {
        icon: 'mdi-form-select',
        name: 'form',
      },
      {
        icon: 'mdi-palette-outline',
        name: 'theme',
      },
    ],
  },
];
