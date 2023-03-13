(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(r){if(r.ep)return;r.ep=!0;const c=n(r);fetch(r.href,c)}})();function p(){}function U(e){return!!e&&(typeof e=="object"||typeof e=="function")&&typeof e.then=="function"}function V(e){return e()}function R(){return Object.create(null)}function k(e){e.forEach(V)}function F(e){return typeof e=="function"}function z(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let x;function D(e,t){return x||(x=document.createElement("a")),x.href=t,e===x.href}function J(e){return Object.keys(e).length===0}function _(e,t){e.appendChild(t)}function C(e,t,n){e.insertBefore(t,n||null)}function w(e){e.parentNode&&e.parentNode.removeChild(e)}function m(e){return document.createElement(e)}function j(e){return document.createTextNode(e)}function q(){return j(" ")}function d(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function K(e){return Array.from(e.childNodes)}function W(e,t,n,o){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,o?"important":"")}let $;function h(e){$=e}function G(){if(!$)throw new Error("Function called outside component initialization");return $}const v=[],H=[],E=[],T=[],Q=Promise.resolve();let P=!1;function X(){P||(P=!0,Q.then(A))}function S(e){E.push(e)}const O=new Set;let b=0;function A(){if(b!==0)return;const e=$;do{try{for(;b<v.length;){const t=v[b];b++,h(t),Y(t.$$)}}catch(t){throw v.length=0,b=0,t}for(h(null),v.length=0,b=0;H.length;)H.pop()();for(let t=0;t<E.length;t+=1){const n=E[t];O.has(n)||(O.add(n),n())}E.length=0}while(v.length);for(;T.length;)T.pop()();P=!1,O.clear(),h(e)}function Y(e){if(e.fragment!==null){e.update(),k(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(S)}}const L=new Set;let g;function Z(){g={r:0,c:[],p:g}}function ee(){g.r||k(g.c),g=g.p}function M(e,t){e&&e.i&&(L.delete(e),e.i(t))}function te(e,t,n,o){if(e&&e.o){if(L.has(e))return;L.add(e),g.c.push(()=>{L.delete(e),o&&(n&&e.d(1),o())}),e.o(t)}else o&&o()}function ne(e,t){const n=t.token={};function o(r,c,l,f){if(t.token!==n)return;t.resolved=f;let a=t.ctx;l!==void 0&&(a=a.slice(),a[l]=f);const s=r&&(t.current=r)(a);let u=!1;t.block&&(t.blocks?t.blocks.forEach((i,y)=>{y!==c&&i&&(Z(),te(i,1,1,()=>{t.blocks[y]===i&&(t.blocks[y]=null)}),ee())}):t.block.d(1),s.c(),M(s,1),s.m(t.mount(),t.anchor),u=!0),t.block=s,t.blocks&&(t.blocks[c]=s),u&&A()}if(U(e)){const r=G();if(e.then(c=>{h(r),o(t.then,1,t.value,c),h(null)},c=>{if(h(r),o(t.catch,2,t.error,c),h(null),!t.hasCatch)throw c}),t.current!==t.pending)return o(t.pending,0),!0}else{if(t.current!==t.then)return o(t.then,1,t.value,e),!0;t.resolved=e}}function re(e,t,n){const o=t.slice(),{resolved:r}=e;e.current===e.then&&(o[e.value]=r),e.current===e.catch&&(o[e.error]=r),e.block.p(o,n)}function oe(e,t,n,o){const{fragment:r,after_update:c}=e.$$;r&&r.m(t,n),o||S(()=>{const l=e.$$.on_mount.map(V).filter(F);e.$$.on_destroy?e.$$.on_destroy.push(...l):k(l),e.$$.on_mount=[]}),c.forEach(S)}function ce(e,t){const n=e.$$;n.fragment!==null&&(k(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function se(e,t){e.$$.dirty[0]===-1&&(v.push(e),X(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function le(e,t,n,o,r,c,l,f=[-1]){const a=$;h(e);const s=e.$$={fragment:null,ctx:[],props:c,update:p,not_equal:r,bound:R(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(a?a.$$.context:[])),callbacks:R(),dirty:f,skip_bound:!1,root:t.target||a.$$.root};l&&l(s.root);let u=!1;if(s.ctx=n?n(e,t.props||{},(i,y,...N)=>{const B=N.length?N[0]:y;return s.ctx&&r(s.ctx[i],s.ctx[i]=B)&&(!s.skip_bound&&s.bound[i]&&s.bound[i](B),u&&se(e,i)),y}):[],s.update(),u=!0,k(s.before_update),s.fragment=o?o(s.ctx):!1,t.target){if(t.hydrate){const i=K(t.target);s.fragment&&s.fragment.l(i),i.forEach(w)}else s.fragment&&s.fragment.c();t.intro&&M(e.$$.fragment),oe(e,t.target,t.anchor,t.customElement),A()}h(a)}class ie{$destroy(){ce(this,1),this.$destroy=p}$on(t,n){if(!F(n))return p;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(n),()=>{const r=o.indexOf(n);r!==-1&&o.splice(r,1)}}$set(t){this.$$set&&!J(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ue="/assets/svelte-a39f39b7.svg",ae="modulepreload",fe=function(e){return"/"+e},I={},de=function(t,n,o){if(!n||n.length===0)return t();const r=document.getElementsByTagName("link");return Promise.all(n.map(c=>{if(c=fe(c),c in I)return;I[c]=!0;const l=c.endsWith(".css"),f=l?'[rel="stylesheet"]':"";if(!!o)for(let u=r.length-1;u>=0;u--){const i=r[u];if(i.href===c&&(!l||i.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${f}`))return;const s=document.createElement("link");if(s.rel=l?"stylesheet":ae,l||(s.as="script",s.crossOrigin=""),s.href=c,document.head.appendChild(s),l)return new Promise((u,i)=>{s.addEventListener("load",u),s.addEventListener("error",()=>i(new Error(`Unable to preload CSS for ${c}`)))})})).then(()=>t())},he=await de(()=>import("/jitar/client.js"),[]),_e=await he.getClient(),me=await _e.import("./shared/sayHello.js"),pe=me.sayHello;function ge(e){let t,n=e[3].message+"",o;return{c(){t=m("p"),o=j(n),W(t,"color","red")},m(r,c){C(r,t,c),_(t,o)},p,d(r){r&&w(t)}}}function ye(e){let t,n=e[2]+"",o;return{c(){t=m("h1"),o=j(n)},m(r,c){C(r,t,c),_(t,o)},p,d(r){r&&w(t)}}}function be(e){let t;return{c(){t=m("p"),t.textContent="...waiting"},m(n,o){C(n,t,o)},p,d(n){n&&w(t)}}}function ve(e){let t,n,o,r,c,l,f,a,s={ctx:e,current:null,token:null,hasCatch:!0,pending:be,then:ye,catch:ge,value:2,error:3};return ne(e[0],s),{c(){t=m("main"),n=m("div"),o=m("a"),o.innerHTML='<img src="/vite.svg" class="logo svelte-bl7fmt" alt="Vite Logo"/>',r=q(),c=m("a"),l=m("img"),a=q(),s.block.c(),d(o,"href","https://vitejs.dev"),d(o,"target","_blank"),d(o,"rel","noreferrer"),D(l.src,f=ue)||d(l,"src",f),d(l,"class","logo svelte svelte-bl7fmt"),d(l,"alt","Svelte Logo"),d(c,"href","https://svelte.dev"),d(c,"target","_blank"),d(c,"rel","noreferrer")},m(u,i){C(u,t,i),_(t,n),_(n,o),_(n,r),_(n,c),_(c,l),_(t,a),s.block.m(t,s.anchor=null),s.mount=()=>t,s.anchor=null},p(u,[i]){e=u,re(s,e,i)},i:p,o:p,d(u){u&&w(t),s.block.d(),s.token=null,s=null}}}function $e(e){async function t(){return await pe("Vite + Svelte + Jitar")}return[t()]}class ke extends ie{constructor(t){super(),le(this,t,$e,ve,z,{})}}new ke({target:document.getElementById("app")});
