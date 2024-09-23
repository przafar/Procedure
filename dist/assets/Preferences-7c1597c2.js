import{J as _e,d as R,f as C,a as x,c as N,h as v,w as y,b as l,t as V,u as h,F as H,e as m,K as he,L as X,M as xe,g as F,q as ye,i as P,H as O,N as be,A as we,O as Ce,r as E,o as Se,P as Q,s as se,j as T,Q as Z,R as U,S as $e,T as ze,U as Ve,W as G}from"./index-d0dba67e.js";import{m as ee,u as j,a as K,o as ae,w as Pe,i as Te,g as Ie}from"./useColors-0eee5a5f.js";import{u as Ne}from"./useForm-18fd503d.js";import{u as Re}from"./useToast-e2130e64.js";const W=_e("user",{state:()=>({userName:"Vasili Savitski",email:"vasili@gmail.com",memberSince:"8/12/2020",pfp:"https://picsum.photos/id/22/200/300",is2FAEnabled:!1}),actions:{toggle2FA(){this.is2FAEnabled=!this.is2FAEnabled},changeUserName(e){this.userName=e}}}),Ae=l("span",{class:"text-4xl"}," 😍 ",-1),Ee={class:"flex flex-col justify-center"},Me={class:"text-[28px] md:text-[32px] leading-10 font-bold"},Fe={class:"flex space-x-1 text-[13px] leading-4"},ke=l("p",null,"Member since",-1),Oe=R({__name:"PreferencesHeader",setup(e){const t=W();return(n,s)=>{const o=C("VaAvatar");return x(),N(H,null,[v(o,{size:"large",color:"warning"},{default:y(()=>[Ae]),_:1}),l("div",Ee,[l("h2",Me,V(h(t).userName),1),l("div",Fe,[ke,l("p",null,V(h(t).memberSince),1)])])],64)}}}),re={preset:{type:String,default:void 0}},Be="VaLocalConfig",Le=m(()=>[]);function Ye(){return he(Be,Le)}const Ue=(e,t)=>t.test(e),le=(e,t)=>{if(typeof t!="string"&&t.global)return[...e.matchAll(t)].map(s=>s.slice(1));const n=e.match(t)||[];return n?n.length>1?n.slice(1):n:[]},ie=/{[^}]*}/g,ce=e=>e.replace(ie,"(.*)"),He=e=>(e.match(ie)||[]).map(t=>t.replace(/{|}/g,"")),Xe=(e,t)=>le(e,ce(t)),je=(e,t)=>{const n=He(t),s=Xe(e,t);return n.reduce((o,a,i)=>({...o,[a]:s[i]}),{})},Ge=(e,t)=>(e.match(t)||[])[0]===e,De=(e,t)=>{const n=ce(t);return Ge(e,new RegExp(n))},ue=e=>typeof e.name=="string",de=e=>e.name instanceof RegExp,qe=(e,t)=>ue(t)?De(e,t.name):de(t)?Ue(e,t.name):!1,Ke=(e,t)=>{const n=je(e,t.name);return t.resolve&&t.resolve(n)},We=(e,t)=>{if(t.name.global)throw new Error(`Bad icon config with name ${t.name}. Please, don't use global regex as name.`);const n=le(e,t.name);return t.resolveFromRegex&&t.resolveFromRegex(...n)},Je=(e,t)=>{if(ue(t))return Ke(e,t);if(de(t))return We(e,t);throw Error("Unknown icon config")},Qe=(e,t,n=[])=>{const s=t.find(o=>n.includes(o.name.toString())?!1:qe(e,o));if(!s)throw new Error(`Can not find icon config from ${e}. Please provide default config.`);return s},pe=(e,t,n=[])=>{if(!e)return;const s=Qe(e,t,n),o=ee(Je(e,s),s);return n=[...n,s.name.toString()],ee(pe(o.to,t,n),o)},Ze=e=>{const t=["name","to","resolve","resolveFromRegex"],n=e;return t.forEach(s=>{delete n[s]}),n},et=(e,t)=>{const n=pe(e,t);return n===void 0?{}:Ze(n)},tt=()=>{const{globalConfig:e}=j();return{getIcon:t=>et(t,e.value.icons)}},nt=()=>typeof window>"u",ot={},S=()=>nt()?typeof globalThis>"u"?ot:globalThis:window,st={defaultSize:48,sizes:{small:32,medium:48,large:64}},at={defaultSize:1,sizes:{small:.75,medium:1,large:1.25}},rt={size:{type:[String,Number],default:"",validator:e=>typeof e=="string"||typeof e=="number"},sizesConfig:{type:Object,default:()=>st},fontSizesConfig:{type:Object,default:()=>at}},lt=/(?<fontSize>\d+)(?<extension>px|rem)/i,te=e=>e/16-.5,it=(e,t=(n=>(n=X())==null?void 0:n.type.name)())=>{const{getGlobalConfig:n}=j(),s=m(()=>{var r,c;return t?(c=(r=n().components)==null?void 0:r[t])==null?void 0:c.sizesConfig:void 0}),o=m(()=>{var r,c,u;const{defaultSize:d,sizes:g}=e.sizesConfig,p=(r=s.value)==null?void 0:r.defaultSize;if(!e.size)return`${d||p}px`;if(typeof e.size=="string"){const f=(u=(c=s.value)==null?void 0:c.sizes)==null?void 0:u[e.size],w=g[e.size];return w?`${w}px`:f?`${f}px`:e.size}return`${e.size}px`}),a=m(()=>{const{defaultSize:r,sizes:c}=e.fontSizesConfig;if(!e.size)return r;if(typeof e.size=="string"){if(e.size in c)return c[e.size];const u=e.size.match(lt);if(!u||!u.groups)throw new Error("Size prop should be either valid string or number");const{extension:d,fontSize:g}=u.groups;return d==="rem"?+g:te(+g)}return te(e.size)}),i=m(()=>`${a.value}rem`);return{sizeComputed:o,fontSizeComputed:i,fontSizeInRem:a}},ct=R({name:"VaIcon",__name:"VaIcon",props:{...rt,...re,name:{type:String,default:""},tag:{type:String},component:{type:Object},color:{type:String},rotation:{type:[String,Number]},spin:{type:[String,Boolean]},flip:{type:String,default:"off",validator:e=>["off","horizontal","vertical","both"].includes(e)}},setup(e){const t=e,{getColor:n}=K(),{sizeComputed:s}=it(t),{getIcon:o}=tt(),a=m(()=>o(t.name)),i=m(()=>t.component||t.tag||a.value.component||a.value.tag||"i"),r=xe(),c=m(()=>({...a.value.attrs,...ae(r,["class"])})),u=b=>{if(!(b===void 0||b===!1))return b==="counter-clockwise"?"va-icon--spin-reverse":"va-icon--spin"},d=m(()=>[a.value.class,u(t.spin??a.value.spin)]),g=m(()=>{const b=t.rotation?`rotate(${t.rotation}deg)`:"",$=t.flip==="vertical"||t.flip==="both"?-1:1,A=t.flip==="horizontal"||t.flip==="both"?-1:1;return`${t.flip==="off"?"":`scale(${$}, ${A})`} ${b}`.trim()}),p=m(()=>({transform:g.value,cursor:r.onClick?"pointer":null,color:t.color?n(t.color,void 0,!0):a.value.color,fontSize:s.value,height:s.value,lineHeight:s.value})),f=m(()=>r.tabindex??-1),w=m(()=>r.role!=="button"||f.value<0);return(b,$)=>(x(),F(we(i.value),be({class:["va-icon",d.value],style:p.value,"aria-hidden":w.value,notranslate:""},c.value),{default:y(()=>[ye(b.$slots,"default",{},()=>[a.value.content?(x(),N(H,{key:0},[P(V(a.value.content),1)],64)):O("",!0)])]),_:3},16,["class","style","aria-hidden"]))}}),fe=(e,t)=>{const n=e.__vccOpts||e;for(const[s,o]of t)n[s]=o;return n},ut=`:root,
:host {
  --va-icon-vertical-align: middle;
  --va-icon-user-select: none;
}
.va-icon {
  vertical-align: var(--va-icon-vertical-align);
  -webkit-user-select: var(--va-icon-user-select);
     -moz-user-select: var(--va-icon-user-select);
          user-select: var(--va-icon-user-select);
}
.va-icon[role^=button][tabindex]:not([tabindex^="-"]) {
  cursor: pointer;
}
.va-icon[role^=button][tabindex]:not([tabindex^="-"]):focus-visible {
  outline: 2px solid var(--va-focus) !important;
  border-radius: 2px;
}
.va-icon.va-icon {
  font-style: normal;
}
.va-icon--spin {
  animation: va-icon--spin-animation 1500ms linear infinite;
}
.va-icon--spin-reverse {
  animation: va-icon--spin-animation 1500ms linear infinite;
  animation-direction: reverse;
}
@keyframes va-icon--spin-animation {
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
}
.va-icon svg {
  fill: currentColor;
  height: 100%;
}`,dt=fe(ct,[["styles",[ut]]]),pt=()=>{let e;return{start:(...s)=>(e=window.setTimeout(...s),e),clear:()=>e&&window.clearTimeout(e)}},ne=(e,t)=>(t&&Object.keys(t).forEach(n=>{e=e.replace(`{${n}}`,String(t[n]))}),e),ft=()=>{const{globalConfig:e}=j(),t=m(()=>e.value.i18n);return{tp:(n,s)=>n?(n.startsWith("$t:")&&(n=t.value[n.slice(3)]||n),ne(n,s)||n):"",t(n,s){const o=t.value[n];return o?ne(o,s)||n:(Pe(`${n} not found in VuesticUI i18n config`),n)}}},mt=(e,t=!1)=>{const{props:n}=X(),{getColor:s,getTextColor:o}=K();return{textColorComputed:m(()=>{if(n.textColor)return s(n.textColor);const i=e?h(e):n.color;if(!i)return"currentColor";const r=s(i);return Te(r)?"currentColor":h(t)?r:s(o(r))})}},vt=["role","aria-live"],gt={class:"va-toast__group"},_t=["textContent"],ht={class:"va-toast__content"},xt=["innerHTML"],yt=["textContent"],bt={key:1,class:"va-toast__content"},wt=R({name:"VaToast",__name:"VaToast",props:{...re,title:{type:String,default:""},offsetY:{type:Number,default:16},offsetX:{type:Number,default:16},message:{type:[String,Function],default:""},dangerouslyUseHtmlString:{type:Boolean,default:!1},icon:{type:String,default:"close"},customClass:{type:String,default:""},duration:{type:Number,default:5e3},color:{type:String,default:""},closeable:{type:Boolean,default:!0},onClose:{type:Function},onClick:{type:Function},multiLine:{type:Boolean,default:!1},position:{type:String,default:"top-right",validator:e=>["top-right","top-left","bottom-right","bottom-left"].includes(e)},render:{type:Function},ariaCloseLabel:{type:String,default:"$t:close"},role:{type:String,default:void 0},inline:{type:Boolean,default:!1}},emits:["on-click","on-close"],setup(e,{emit:t}){const n=R({name:"VaToastRenderer",props:{render:{type:Function,required:!0}},setup:_=>()=>_.render()}),{tp:s}=ft(),o=e,a=t,i=Ce(),{getColor:r}=K(),{textColorComputed:c}=mt(m(()=>r(o.color))),u=E(!1),d=m(()=>o.position.includes("right")?"right":"left"),g=m(()=>o.position.includes("top")?"top":"bottom"),p=m(()=>[o.customClass,o.multiLine?"va-toast--multiline":"",o.inline?"va-toast--inline":""]),f=m(()=>({[g.value]:`${o.offsetY}px`,[d.value]:`${o.offsetX}px`,backgroundColor:r(o.color),color:c.value})),w=m(()=>o.role==="status"?"polite":"assertive"),b=m(()=>typeof o.message=="function"?o.message():o.message),$=()=>{var _,L;(_=i.value)==null||_.removeEventListener("transitionend",$),(L=i.value)==null||L.remove()},A=()=>{typeof o.onClick=="function"?o.onClick():a("on-click")},I=()=>{var _;u.value=!1,(_=i.value)==null||_.addEventListener("transitionend",$),typeof o.onClose=="function"?o.onClose():a("on-close")},k=pt(),z=k.clear,J=()=>{o.duration>0&&k.start(()=>u.value&&I(),o.duration)};return Se(()=>{u.value=!0,J()}),(_,L)=>(x(),F(ze,{name:"va-toast-fade"},{default:y(()=>[Q(l("div",{ref_key:"rootElement",ref:i,role:_.$props.role??_.$props.closeable?"alertdialog":"alert","aria-live":w.value,"aria-atomic":"true",class:se(["va-toast",p.value]),style:T(f.value),onMouseenter:L[0]||(L[0]=(...ge)=>h(z)&&h(z)(...ge)),onMouseleave:J,onClick:A},[l("div",gt,[_.$props.title?(x(),N("h2",{key:0,class:"va-toast__title",textContent:V(_.$props.title)},null,8,_t)):O("",!0),Q(l("div",ht,[_.$props.dangerouslyUseHtmlString?(x(),N("div",{key:0,innerHTML:b.value},null,8,xt)):(x(),N("p",{key:1,textContent:V(b.value)},null,8,yt))],512),[[Z,_.$props.message]]),_.$props.render?(x(),N("div",bt,[v(h(n),{render:_.$props.render},null,8,["render"])])):O("",!0),_.$props.closeable?(x(),F(dt,{key:2,class:"va-toast__close-icon",role:"button","aria-label":h(s)(_.$props.ariaCloseLabel),tabindex:"0",size:"1rem",name:_.$props.icon,onClick:U(I,["stop"]),onKeydown:$e(U(I,["stop"]),["enter"])},null,8,["aria-label","name","onKeydown"])):O("",!0)])],46,vt),[[Z,u.value]])]),_:1}))}}),Ct=`:root,
:host {
  --va-toast-display: flex;
  --va-toast-width: 330px;
  --va-toast-padding: 14px 26px 14px 13px;
  --va-toast-border-radius: 8px;
  --va-toast-border-color: transparent;
  --va-toast-border: 1px solid var(--va-toast-border-color);
  --va-toast-background-color: var(--va-background-secondary);
  --va-toast-box-shadow: 0 2px 12px 0 var(--va-shadow);
  --va-toast-transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
  --va-toast-z-index: calc(var(--va-z-index-teleport-overlay) + 100);
  /* Group */
  --va-toast-group-margin-left: 13px;
  --va-toast-group-margin-right: 8px;
  /* Title */
  --va-toast-title-font-weight: bold;
  --va-toast-title-font-size: 1rem;
  --va-toast-title-color: #303133;
  --va-toast-title-margin: 0 0 6px;
  /* Content */
  --va-toast-content-font-size: 1rem;
  --va-toast-content-line-height: 1.3125;
  --va-toast-content-padding-right: 20px;
  /* Icon */
  --va-toast-icon-height: 24px;
  --va-toast-icon-width: 24px;
  --va-toast-icon-font-size: 24px;
  /* Icon Close */
  --va-toast-close-icon-top: 18px;
  --va-toast-close-icon-right: 15px;
  --va-toast-close-icon-font-size: 1rem;
}
.va-toast {
  position: fixed;
  box-sizing: border-box;
  width: var(--va-toast-width);
  padding: var(--va-toast-padding);
  display: flex;
  align-items: center;
  border-radius: var(--va-toast-border-radius);
  border: var(--va-toast-border);
  background-color: var(--va-toast-background-color);
  box-shadow: var(--va-toast-box-shadow);
  transition: var(--va-toast-transition);
  overflow: hidden;
  z-index: var(--va-toast-z-index);
  font-family: var(--va-font-family);
}
.va-toast--inline {
  position: static;
}
.va-toast--multiline {
  min-height: 70px;
}
.va-toast--right {
  right: 16px;
}
.va-toast--left {
  left: 16px;
}
.va-toast__group {
  margin-left: var(--va-toast-group-margin-left);
  margin-right: var(--va-toast-group-margin-right);
}
.va-toast__title {
  font-weight: var(--va-toast-title-font-weight);
  font-size: var(--va-toast-title-font-size);
  margin: var(--va-toast-title-margin);
  font-size: 0.625rem;
  letter-spacing: 0.6px;
  line-height: 1.2;
  font-weight: 700;
  text-transform: uppercase;
}
.va-toast__content {
  font-size: var(--va-toast-content-font-size);
  line-height: var(--va-toast-content-line-height);
  padding-right: var(--va-toast-content-padding-right);
}
.va-toast__content p,
.va-toast__content div {
  margin: 0;
}
.va-toast__icon {
  height: var(--va-toast-icon-height);
  width: var(--va-toast-icon-width);
  font-size: var(--va-toast-icon-font-size);
}
.va-toast__close-icon {
  position: absolute;
  top: 50%;
  right: var(--va-toast-close-icon-right);
  cursor: pointer;
  transform: translateY(-50%);
  font-size: var(--va-toast-close-icon-font-siz);
  opacity: 0.7;
}
.va-toast__close-icon:hover {
  opacity: 1;
}
.va-toast-fade-enter.right {
  right: 0;
  transform: translateX(100%);
}
.va-toast-fade-enter.left {
  left: 0;
  transform: translateX(-100%);
}
.va-toast-fade-leave-active {
  opacity: 0;
}`,St=fe(wt,[["styles",[Ct]]]),$t=(e,t)=>{const n=Ye(),{globalConfig:s}=j(),o=m(()=>t.preset),a=i=>{var r,c,u;return(u=(c=(r=s.value.components)==null?void 0:r.presets)==null?void 0:c[e.name])==null?void 0:u[i]};return m(()=>{var i,r;const c={...(i=s.value.components)==null?void 0:i.all,...(r=s.value.components)==null?void 0:r[e.name]},u=n.value.reduce((p,f)=>f[e.name]?{...p,...f[e.name]}:p,{}),d=o.value||u.preset||c.preset,g=d&&a(d);return{...c,...u,...g}})},zt=/([a-z0-9])([A-Z])/g,Vt=e=>e.replace(zt,"$1-$2").toLowerCase(),Pt=(e,t)=>t in e?e[t]:e[Vt(t)],Tt=(e,t)=>{const n=e.props;return new Proxy(n,{get:(s,o)=>{var a;if(typeof o!="string")return s[o];const i=e.vnode.props||{},r=s[o],c=(a=t.value)==null?void 0:a[o];return Pt(i,o)!==void 0?r:c!==void 0?c:r}})},It=(e,t)=>{const n=e.attrs;return new Proxy(n,{get:(s,o)=>{var a;if(typeof o!="string")return s[o];if(o==="class")return se([t.value.class,n.class]);if(o==="style")return T([t.value.style,n.style]);const i=(a=t.value)==null?void 0:a[o];return i!==void 0?i:s[o]},ownKeys(s){return[...new Set([...Object.keys(n),...Object.keys(t.value)])]},getOwnPropertyDescriptor(s,o){return Reflect.getOwnPropertyDescriptor(t.value,o)??Reflect.getOwnPropertyDescriptor(n,o)}})},D=e=>{const t=(n,s)=>{var o;const a=X(),i=$t(e,n),r=m(()=>ae(i.value,Object.keys(n))),c=Tt(a,i),u=It(a,r);a.props=c,a.attrs=u;const d=(o=e.setup)==null?void 0:o.call(e,Ve(c),{...s,attrs:u});return typeof d=="object"&&!a.exposed&&s.expose(d),d};return new Proxy(e,{get(n,s){return s==="setup"?t:n[s]}})},q="__c",Nt=e=>(e[q]=D(e[q]),e),Rt=e=>"setup"in e?D(e):q in e?Nt(e):(e.setup=()=>({}),D(e)),At=Rt(St),me=5;let Y=1;S().vaToastInstances=[];const Et=(e,t)=>{if(e.el){const n=t.includes("bottom")?-1:1;return(e.el.offsetHeight+me)*n}return 0},Mt=(e,t,n)=>{const s=n.includes("bottom")?-1:1;return parseInt(e,10)-(t+me)*s},B=e=>{var t;return((t=e.component)==null?void 0:t.props)||{}},Ft=(e,t)=>{var n;if(!e)return;if(!S().vaToastInstances.length){Y=1;return}const s=S().vaToastInstances.findIndex(u=>u===e);if(s<0)return;const o=B(e),{offsetX:a,offsetY:i,position:r}=o,c=(n=e.el)==null?void 0:n.offsetHeight;t(),S().vaToastInstances=S().vaToastInstances.reduce((u,d,g)=>{if(d===e)return u;if(d.component){const{offsetX:p,offsetY:f,position:w}=B(d);if(g>s&&a===p&&i===f&&r===w&&d.el&&c){const[$,A]=d.el.style.transform.match(/[\d-]+(?=px)/g),I=Mt(A,c,w);d.el.style.transform=`translate(0, ${I}px)`}}return[...u,d]},[]),S().vaToastInstances.length||(Y=1)},kt=(e,t)=>{e&&(G(null,e),e.remove()),e=null},Ot=(e,{props:t,children:n,element:s,appContext:o}={})=>{let a=s,i;return i=v(e,{...t,onClose:()=>{Ft(i,()=>kt(a)),t!=null&&t.onClose&&t.onClose()}},n),o&&(i.appContext=o),a?G(i,a):typeof document<"u"&&G(i,a=document.createElement("div")),{vNode:i,el:a}},Bt=e=>{if(!S().vaToastInstances.length){Y=1;return}S().vaToastInstances.forEach(t=>{e&&t.appContext!==e||B(t).onClose()})},oe=e=>{const t=S().vaToastInstances.find(n=>{var s;return((s=n.el)==null?void 0:s.id)===e});t&&B(t).onClose()},Lt=e=>typeof e=="string"?{message:e}:e,Yt=(e,t)=>{const{vNode:n,el:s}=Ot(At,{appContext:t,props:Lt(e)}),o=B(n);if(s&&n.el&&o){document.body.appendChild(s.childNodes[0]);const{offsetX:a,offsetY:i,position:r}=o;n.el.style.display="flex",n.el.id="notification_"+Y;let c=0;return S().vaToastInstances.filter(u=>{const{offsetX:d,offsetY:g,position:p}=B(u);return d===a&&g===i&&r===p}).forEach(u=>{c+=Et(u,r)}),n.el.style.transform=`translate(0, ${c}px)`,Y+=1,S().vaToastInstances.push(n),n.el.id}return null},Ut=()=>{const e=X();return m(()=>{var t;return((t=Ie())==null?void 0:t._context)||(e==null?void 0:e.appContext)})},ve=()=>{const e=Ut(),t=[],n=r=>{const c=Yt(r,e.value);return c&&t.push(c),c};return{init:r=>n(r),notify:n,close:r=>oe(r),closeAll:(r=!1)=>Bt(r?void 0:e.value),closeAllCreatedInThisHook:()=>{t.forEach(r=>oe(r))}}},M={"--va-button-font-size":"14px","--va-button-line-height":"20px"},Ht={class:"flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5"},Xt=l("p",{class:"font-bold w-[200px]"},"Name",-1),jt={class:"flex-1"},Gt={class:"max-w-[748px]"},Dt={class:"flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5"},qt=l("p",{class:"font-bold w-[200px]"},"Email",-1),Kt={class:"flex-1"},Wt={class:"max-w-[748px]"},Jt={class:"flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5"},Qt=l("p",{class:"font-bold w-[200px]"},"Password",-1),Zt=l("div",{class:"flex-1"},[l("div",{class:"max-w-[748px]"},"•••••••••••••")],-1),en={class:"flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5"},tn=l("p",{class:"font-bold w-[200px]"},"Two-factor authentication",-1),nn={class:"flex-1"},on={class:"max-w-[748px]"},sn={class:"flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5"},an=l("p",{class:"font-bold w-[200px]"},"Email subscriptions",-1),rn={class:"flex-1"},ln={class:"max-w-[748px]"},cn=l("p",null,"To manage what emails you get, visit the",-1),un={class:"flex space-x-1 w-fit"},dn=R({__name:"Settings",emits:["openNameModal","openResetPasswordModal"],setup(e,{emit:t}){const n=W(),{init:s}=ve(),o=m(()=>n.is2FAEnabled?"2FA successfully enabled":"2FA successfully disabled"),a=m(()=>n.is2FAEnabled?{color:"danger",button:"Disable 2FA",content:"Two-Factor Authentication (2FA) is now enabled for your account, adding an extra layer of security to your sign-ins."}:{color:"primary",button:"Set up 2FA",content:"Add an extra layer of security to your account. To sign in, you’ll need to provide a code along with your username and password."}),i=()=>{n.toggle2FA(),s({message:o.value,color:"success"})},r=t;return(c,u)=>{const d=C("VaButton"),g=C("VaDivider"),p=C("RouterLink");return x(),N(H,null,[l("div",Ht,[Xt,l("div",jt,[l("div",Gt,V(h(n).userName),1)]),v(d,{style:T(h(M)),class:"w-fit h-fit",preset:"primary",onClick:u[0]||(u[0]=f=>r("openNameModal"))},{default:y(()=>[P(" Edit ")]),_:1},8,["style"])]),v(g),l("div",Dt,[qt,l("div",Kt,[l("div",Wt,V(h(n).email),1)])]),l("div",Jt,[Qt,Zt,v(d,{style:T(h(M)),class:"w-fit h-fit",preset:"primary",onClick:u[1]||(u[1]=f=>r("openResetPasswordModal"))},{default:y(()=>[P(" Reset Password ")]),_:1},8,["style"])]),v(g),l("div",en,[tn,l("div",nn,[l("div",on,V(a.value.content),1)]),v(d,{style:T(h(M)),class:"w-fit h-fit",preset:"primary",color:a.value.color,onClick:i},{default:y(()=>[P(V(a.value.button),1)]),_:1},8,["style","color"])]),v(g),l("div",sn,[an,l("div",rn,[l("div",ln,[cn,l("div",un,[v(p,{to:{name:"settings"},class:"font-semibold text-primary"},{default:y(()=>[P("Notification settings")]),_:1})])])])])],64)}}}),pn=l("h1",{class:"va-h5 mb-4"},"Reset password",-1),fn={class:"flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4"},mn=R({__name:"EditNameModal",emits:["cancel"],setup(e,{emit:t}){const n=W(),{init:s}=ve(),o=t,a=E(n.userName),i=()=>{if(!a.value||a.value===n.userName)return o("cancel");n.changeUserName(a.value),s({message:"You've successfully changed your name",color:"success"}),o("cancel")};return(r,c)=>{const u=C("VaInput"),d=C("VaButton"),g=C("VaForm"),p=C("VaModal");return x(),F(p,{"mobile-fullscreen":!1,size:"small","hide-default-actions":"","max-width":"380px","model-value":"","close-button":"","onUpdate:modelValue":c[2]||(c[2]=f=>o("cancel"))},{default:y(()=>[pn,v(g,{ref:"form",onSubmit:U(i,["prevent"])},{default:y(()=>[v(u,{modelValue:a.value,"onUpdate:modelValue":c[0]||(c[0]=f=>a.value=f),class:"mb-4",label:"Name",placeholder:"Name"},null,8,["modelValue"]),l("div",fn,[v(d,{style:T(h(M)),preset:"secondary",color:"secondary",onClick:c[1]||(c[1]=f=>o("cancel"))},{default:y(()=>[P(" Cancel")]),_:1},8,["style"]),v(d,{style:T(h(M)),class:"mb-4 md:mb-0",type:"submit",onClick:i},{default:y(()=>[P(" Save")]),_:1},8,["style"])])]),_:1},8,["onSubmit"])]),_:1})}}});const vn=l("h1",{class:"va-h5 mb-4"},"Reset password",-1),gn={class:"grid grid-cols-1 md:grid-cols-2 gap-6"},_n=l("div",{class:"hidden md:block"},null,-1),hn={class:"flex flex-col space-y-2"},xn={class:"flex space-x-2 items-center"},yn=l("p",null,"Must be at least 8 characters long",-1),bn={class:"flex space-x-2 items-center"},wn=l("p",null,"Must contain at least 6 unique characters",-1),Cn={class:"flex flex-col-reverse md:justify-end md:flex-row md:space-x-4"},Sn=R({__name:"ResetPasswordModal",emits:["cancel"],setup(e,{emit:t}){const n=E(),s=E(),o=E(),{validate:a}=Ne("form"),{init:i}=Re(),r=t,c=()=>{a()&&(i({message:"You've successfully changed your password",color:"success"}),r("cancel"))},u=[p=>!!p||"Old password field is required"],d=[p=>!!p||"New password field is required",p=>(p==null?void 0:p.length)>=8||"Must be at least 8 characters long",p=>new Set(p).size>=6||"Must contain at least 6 unique characters",p=>p!==n.value||"New password cannot be the same"],g=[p=>!!p||"Repeat new password field is required",p=>p===s.value||"Confirm password does not match new password"];return(p,f)=>{const w=C("VaInput"),b=C("VaIcon"),$=C("VaButton"),A=C("VaForm"),I=C("VaModal");return x(),F(I,{"max-width":"530px","mobile-fullscreen":!1,"hide-default-actions":"","model-value":"","close-button":"","onUpdate:modelValue":f[4]||(f[4]=k=>r("cancel"))},{default:y(()=>[vn,v(A,{ref:"form",class:"space-y-6",onSubmit:U(c,["prevent"])},{default:y(()=>{var k;return[l("div",gn,[v(w,{modelValue:n.value,"onUpdate:modelValue":f[0]||(f[0]=z=>n.value=z),rules:u,label:"Old password",placeholder:"Old password","required-mark":"",type:"password"},null,8,["modelValue"]),_n,v(w,{modelValue:s.value,"onUpdate:modelValue":f[1]||(f[1]=z=>s.value=z),rules:d,label:"New password",placeholder:"New password","required-mark":"",type:"password"},null,8,["modelValue"]),v(w,{modelValue:o.value,"onUpdate:modelValue":f[2]||(f[2]=z=>o.value=z),rules:g,label:"Repeat new password",placeholder:"Repeat new password","required-mark":"",type:"password"},null,8,["modelValue"])]),l("div",hn,[l("div",xn,[l("div",null,[v(b,{name:((k=s.value)==null?void 0:k.length)>=8?"mso-check":"mso-close",color:"secondary",size:"20px"},null,8,["name"])]),yn]),l("div",bn,[l("div",null,[v(b,{name:new Set(s.value).size>=6?"mso-check":"mso-close",color:"secondary",size:"20px"},null,8,["name"])]),wn])]),l("div",Cn,[v($,{style:T(h(M)),preset:"secondary",color:"secondary",onClick:f[3]||(f[3]=z=>r("cancel"))},{default:y(()=>[P(" Cancel")]),_:1},8,["style"]),v($,{style:T(h(M)),class:"mb-4 md:mb-0",type:"submit",onClick:c},{default:y(()=>[P(" Update Password")]),_:1},8,["style"])])]}),_:1},8,["onSubmit"])]),_:1})}}});const $n=l("h1",{class:"page-title"},"Preferences",-1),zn={class:"flex flex-col p-4 space-y-10 bg-backgroundSecondary rounded-lg"},Vn={class:"flex space-x-5"},Pn={class:"space-y-4 md:space-y-6"},An=R({__name:"Preferences",setup(e){const t=E(!1),n=E(!1);return(s,o)=>(x(),N(H,null,[$n,l("div",zn,[l("div",Vn,[v(Oe)]),l("div",Pn,[v(dn,{onOpenNameModal:o[0]||(o[0]=a=>t.value=!0),onOpenResetPasswordModal:o[1]||(o[1]=a=>n.value=!0)})])]),t.value?(x(),F(mn,{key:0,onCancel:o[2]||(o[2]=a=>t.value=!1)})):O("",!0),n.value?(x(),F(Sn,{key:1,onCancel:o[3]||(o[3]=a=>n.value=!1)})):O("",!0)],64))}});export{An as default};
//# sourceMappingURL=Preferences-7c1597c2.js.map
