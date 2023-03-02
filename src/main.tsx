import * as React from "react";
import { createRoot } from "react-dom/client";
import "./greet.scss";
import { Show as ShowPlatforms } from "./views/platforms";

function render(id: string, children: React.ReactNode) {
  const container = document.getElementById(id);
  createRoot(container!).render(children);
}

render("id-platforms", <ShowPlatforms />);
