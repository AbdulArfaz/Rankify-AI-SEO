import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ThemeProvider>
            <AppProvider>
                      <App />
            </AppProvider>
        </ThemeProvider>
    </BrowserRouter>
);
