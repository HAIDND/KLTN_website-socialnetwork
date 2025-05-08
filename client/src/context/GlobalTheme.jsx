import { GlobalStyles, ThemeProvider } from "@mui/material";

function GlobalTheme({ children, theme }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { overflowY: "scroll" } }} />
      {children}
    </ThemeProvider>
  );
}

export default GlobalTheme;
