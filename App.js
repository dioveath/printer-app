import { ThemeProvider, createTheme, lightColors } from "@rneui/themed";
import { Platform } from "react-native";
import { store } from "./src/Redux/store";
import { Provider } from "react-redux";

import MainApp from "./src/Screens/MainApp";

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MainApp/>
      </ThemeProvider>
    </Provider>
  );
}
