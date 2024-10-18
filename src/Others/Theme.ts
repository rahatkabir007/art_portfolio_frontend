import { createTheme } from "@mui/material/styles";
import { AppColors } from "./AppColors";

// Create a theme instance.
export const theme = createTheme({
  zIndex: {
    appBar: 1,
    drawer: 0,
  },
  palette: {
    primary: {
      main: AppColors.PRIMARY_MAIN,
      dark: AppColors.PRIMARY_DARK,
      light: AppColors.PRIMARY_LIGHT,
    },
    secondary: {
      main: AppColors.ACCENT_MAIN,
      dark: AppColors.ACCENT_DARK,
      light: AppColors.ACCENT_LIGHT,
    },

    // error: {
    //   main: red.A400,
    // },
    // background: {
    //   default: "#fff",
    // },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
});
