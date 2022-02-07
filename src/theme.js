import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;

/**
 *
const dom = [
  {
    id: '1',
    type: ComponentType.BOX,
    props: { sx: { my: 4 } },
    children: [
      {
        id: '2',
        type: ComponentType.BOX,
        props: { sx: { my: 4 } },
        children: [
          {
            id: '3',
            type: ComponentType.BOX,
            props: { sx: { padding: 10, backgroundColor: 'green', height: 500 } },
          },
        ],
      },
    ],
  },
];

const componentsMap = {
  [ComponentType.BOX]: Box,
};

function render(components) {
  return components.map((component) => {
    const Component = componentsMap[component.type];

    return (
      <Component {...component.props} key={component.id}>
        {render(component.children || [])}
      </Component>
    );
  });
}
*/
