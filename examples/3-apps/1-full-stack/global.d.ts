import react from "react";
import react_dom from "react-dom/clientt";

declare global {
    type React = typeof react
    type ReactDOM = typeof react_dom
}
