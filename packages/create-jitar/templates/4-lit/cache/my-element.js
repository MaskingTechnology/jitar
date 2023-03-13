var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import litLogo from './assets/lit.svg';
import { sayHello } from './shared/sayHello';
var MyElement = /** @class */ (function (_super) {
    __extends(MyElement, _super);
    function MyElement() {
        var _this = _super.call(this) || this;
        _this.message = '';
        sayHello('Lit + Vite + Jitar').then(function (message) { return _this.message = message; });
        return _this;
    }
    MyElement.prototype.render = function () {
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <div>\n        <a href=\"https://vitejs.dev\" target=\"_blank\">\n          <img src=\"/vite.svg\" class=\"logo\" alt=\"Vite logo\" />\n        </a>\n        <a href=\"https://lit.dev\" target=\"_blank\">\n          <img src=", " class=\"logo lit\" alt=\"Lit logo\" />\n        </a>\n      </div>\n      <div><h1>", "</h1></div>\n    "], ["\n      <div>\n        <a href=\"https://vitejs.dev\" target=\"_blank\">\n          <img src=\"/vite.svg\" class=\"logo\" alt=\"Vite logo\" />\n        </a>\n        <a href=\"https://lit.dev\" target=\"_blank\">\n          <img src=", " class=\"logo lit\" alt=\"Lit logo\" />\n        </a>\n      </div>\n      <div><h1>", "</h1></div>\n    "])), litLogo, this.message);
    };
    MyElement.styles = css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      max-width: 1280px;\n      margin: 0 auto;\n      padding: 2rem;\n      text-align: center;\n    }\n\n    .logo {\n      height: 6em;\n      padding: 1.5em;\n      will-change: filter;\n      transition: filter 300ms;\n    }\n    .logo:hover {\n      filter: drop-shadow(0 0 2em #646cffaa);\n    }\n    .logo.lit:hover {\n      filter: drop-shadow(0 0 2em #325cffaa);\n    }\n\n    .card {\n      padding: 2em;\n    }\n\n    .read-the-docs {\n      color: #888;\n    }\n\n    h1 {\n      font-size: 3.2em;\n      line-height: 1.1;\n    }\n\n    a {\n      font-weight: 500;\n      color: #646cff;\n      text-decoration: inherit;\n    }\n    a:hover {\n      color: #535bf2;\n    }\n\n    button {\n      border-radius: 8px;\n      border: 1px solid transparent;\n      padding: 0.6em 1.2em;\n      font-size: 1em;\n      font-weight: 500;\n      font-family: inherit;\n      background-color: #1a1a1a;\n      cursor: pointer;\n      transition: border-color 0.25s;\n    }\n    button:hover {\n      border-color: #646cff;\n    }\n    button:focus,\n    button:focus-visible {\n      outline: 4px auto -webkit-focus-ring-color;\n    }\n\n    @media (prefers-color-scheme: light) {\n      a:hover {\n        color: #747bff;\n      }\n      button {\n        background-color: #f9f9f9;\n      }\n    }\n  "], ["\n    :host {\n      max-width: 1280px;\n      margin: 0 auto;\n      padding: 2rem;\n      text-align: center;\n    }\n\n    .logo {\n      height: 6em;\n      padding: 1.5em;\n      will-change: filter;\n      transition: filter 300ms;\n    }\n    .logo:hover {\n      filter: drop-shadow(0 0 2em #646cffaa);\n    }\n    .logo.lit:hover {\n      filter: drop-shadow(0 0 2em #325cffaa);\n    }\n\n    .card {\n      padding: 2em;\n    }\n\n    .read-the-docs {\n      color: #888;\n    }\n\n    h1 {\n      font-size: 3.2em;\n      line-height: 1.1;\n    }\n\n    a {\n      font-weight: 500;\n      color: #646cff;\n      text-decoration: inherit;\n    }\n    a:hover {\n      color: #535bf2;\n    }\n\n    button {\n      border-radius: 8px;\n      border: 1px solid transparent;\n      padding: 0.6em 1.2em;\n      font-size: 1em;\n      font-weight: 500;\n      font-family: inherit;\n      background-color: #1a1a1a;\n      cursor: pointer;\n      transition: border-color 0.25s;\n    }\n    button:hover {\n      border-color: #646cff;\n    }\n    button:focus,\n    button:focus-visible {\n      outline: 4px auto -webkit-focus-ring-color;\n    }\n\n    @media (prefers-color-scheme: light) {\n      a:hover {\n        color: #747bff;\n      }\n      button {\n        background-color: #f9f9f9;\n      }\n    }\n  "])));
    __decorate([
        property({ type: String })
    ], MyElement.prototype, "message");
    MyElement = __decorate([
        customElement('my-element')
    ], MyElement);
    return MyElement;
}(LitElement));
export { MyElement };
var templateObject_1, templateObject_2;
