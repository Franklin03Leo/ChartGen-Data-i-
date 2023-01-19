export const themeConfig = {
    components: {
        MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "green",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"
          },
          focused: {
            backgroundColor: "yellow"
          }
        }
      }
    }
  };