import { DefaultTheme } from "@react-navigation/native";

export const NAV_CONTAINER_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#73d588',
    primary: '#ffffff',
  },
  fonts: {
    default: {
      regular: {
        fontFamily: "RobotoRegular",
        fontWeight: "normal" 
      }
    }
  }
};