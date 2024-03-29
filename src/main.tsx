import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>,
);
