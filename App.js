import { ThemeProvider, createTheme, darkColors, lightColors } from "@rneui/themed";
import { Platform } from "react-native";
import { store } from "./src/Redux/store";
import { Provider } from "react-redux";
import EscPosPrinter from "react-native-esc-pos-printer";

import Entry from "./src/Screens/Entry";

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  // darkColors: {
  //   ...Platform.select({
  //     default: darkColors.platform.android,
  //     ios: darkColors.platform.ios,
  //   }),
  // }
});




export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Entry/>
      </ThemeProvider>
    </Provider>
  );
}
