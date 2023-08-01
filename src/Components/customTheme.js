import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@mui/material/styles';
import MUIDataTable from 'mui-datatables';

const customTheme = createMuiTheme({
    overrides: {
      MuiCheckbox: {
        root: {
          '&$checked': {
            opacity: 0.6, // Change this to your desired opacity value when the checkbox is checked
          },
        },
        checked: {},
      },
    },
  });

  export default customTheme;