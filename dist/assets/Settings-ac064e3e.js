import{d as _,I as g,e as m,f as h,a as i,c as b,b as t,t as f,h as d,u as k,v as V,g as S}from"./index-d0dba67e.js";const x={class:"flex items-center justify-between"},y={class:"w-40"},B=_({__name:"LanguageSwitcher",setup(p){const{locale:s}=g(),a={uzbek:"Uzbek",russian:"Русский"},o={uz:a.uzbek,ru:a.russian},c=Object.fromEntries(Object.entries(o).map(([e,n])=>[n,e])),u=Object.values(o),l=m({get(){return o[s.value]},set(e){s.value=c[e]}});return(e,n)=>{const r=h("VaSelect");return i(),b("div",x,[t("p",null,f(e.$t("language.language")),1),t("div",y,[d(r,{modelValue:l.value,"onUpdate:modelValue":n[0]||(n[0]=v=>l.value=v),options:k(u)},null,8,["modelValue","options"])])])}}}),$=_({__name:"ThemeSwitcher",setup(p){const{applyPreset:s,currentPresetName:a}=V(),o=m({get(){return a.value},set(l){s(l)}}),{t:c}=g(),u=[{label:c("buttonSelect.dark"),value:"dark"},{label:c("buttonSelect.light"),value:"light"}];return(l,e)=>{const n=h("VaButtonToggle");return i(),S(n,{modelValue:o.value,"onUpdate:modelValue":e[0]||(e[0]=r=>o.value=r),color:"background-element","border-color":"background-element",options:u},null,8,["modelValue"])}}}),j={class:"flex flex-col space-y-6 md:space-y-4"},w={class:"page-title"},z={class:"flex flex-col p-4 space-y-4 bg-backgroundSecondary rounded-lg"},C=t("h3",{class:"h3"},"Theme",-1),N={class:"flex flex-col p-4 space-y-4 bg-backgroundSecondary rounded-lg"},T=t("h3",{class:"h3"},"General preferences",-1),U=_({__name:"Settings",setup(p){return(s,a)=>(i(),b("div",j,[t("h1",w,f(s.$t("menu.settings")),1),t("div",z,[C,d($)]),t("div",N,[T,d(B)])]))}});export{U as default};
//# sourceMappingURL=Settings-ac064e3e.js.map
