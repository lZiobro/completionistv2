import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Statistics from "./Statistics";
import UserContextWrapper from "./UserContextWrapper";
import HowToUse from "./pages/others/HowToUse";

const router = createBrowserRouter([
  {
    path: "/completionistv2",
    element: (
      <UserContextWrapper>
        <App />
      </UserContextWrapper>
    ),
  },
  {
    path: "/howtouse",
    element: (
      <UserContextWrapper>
        <HowToUse />
      </UserContextWrapper>
    ),
  },
  {
    path: "/statistics",
    element: (
      <UserContextWrapper>
        <Statistics />
      </UserContextWrapper>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
