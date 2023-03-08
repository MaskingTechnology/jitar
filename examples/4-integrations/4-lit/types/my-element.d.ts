import { LitElement } from 'lit';
export declare class MyElement extends LitElement {
    message: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}
