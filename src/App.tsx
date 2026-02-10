import { ThemeProvider } from "@/components/theme-provider";
import Home from "./app/page";

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

export default App;