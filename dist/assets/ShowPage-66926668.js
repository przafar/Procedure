import{d as O,$ as B,r as g,e as $,a0 as L,C as U,o as Y,f as i,a as d,c,b as e,t as s,F as G,x as j,h as r,w as f,i as y,s as z,_ as R}from"./index-d0dba67e.js";import{p as H,h as q}from"./moment-7faabd50.js";import{S as J}from"./services-b8050135.js";import{a as K}from"./appointment-aa586bdf.js";const Q={class:"container w-full px-2 sm:px-4 custom-h-screen"},W={class:"flex justify-start mb-4"},X={key:0,class:"grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto"},Z={class:"col-span-12 md:col-span-4 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg info-block"},tt={class:"text-lg sm:text-xl font-semibold mb-4"},et={class:"space-y-2"},st={class:"bg-white p-3 rounded-lg shadow-sm"},ot={class:"text-md font-semibold"},at={class:"text-gray-700 text-sm"},nt={class:"bg-white p-3 rounded-lg shadow-sm"},lt={class:"text-md font-semibold"},dt={class:"text-gray-700 text-sm"},ct={class:"bg-white p-3 rounded-lg shadow-sm"},it={class:"text-md font-semibold"},rt={class:"text-gray-700 text-sm"},pt={class:"bg-white p-3 rounded-lg shadow-sm"},mt={class:"text-md font-semibold"},ut={class:"text-gray-700 text-sm"},_t={class:"bg-white p-3 rounded-lg shadow-sm"},ht={class:"text-md font-semibold"},gt={class:"text-gray-700 text-sm"},ft={class:"bg-white p-3 rounded-lg shadow-sm"},yt={class:"text-md font-semibold"},bt={class:"text-gray-700 text-sm"},wt={class:"col-span-12 md:col-span-8 bg-white rounded-lg shadow-lg history-block custom-h-screen-minus-300"},vt={class:"text-lg sm:text-xl font-semibold sticky top-0 bg-white z-10 pt-4 sm:pt-6 px-4 sm:px-6"},xt={key:0,class:"p-4 sm:p-6"},$t={class:"space-y-4"},St={class:"font-bold text-gray-700"},Vt={class:"text-gray-600"},Tt={class:"text-gray-600"},Et={class:"text-gray-600"},kt={class:"text-gray-600"},At={key:1,class:"p-5"},Ct={class:"text-gray-500"},Dt={key:1,class:"text-center"},Nt={class:"text-gray-500"},It={class:"flex flex-col gap-4 w-full mt-4"},Pt={class:"w-full"},Mt={class:"w-full"},Ft={class:"w-full flex justify-end"},Ot=O({__name:"ShowPage",setup(Bt){const u=B().params.id,S=H(),p=J(),b=K(),l=g(null),w=g(!0),m=g(!1),V=$(()=>p.getEncounterClasses);$(()=>p.getEncounterTypes);const n=L({newAppointment:{role:"",type:"",text:""},appointments:[]});U(()=>n.newAppointment.role,async t=>{if(t)try{await p.GET_LIST_OF_ECOUNTER_TYPES(t)}catch(o){console.error("Failed to fetch encounter types:",o)}});const v=async()=>{w.value=!0;try{const t={patient_id:u,page:1,per_page:10},o=await S.GET_BY_ID(u),_=await b.GET_LIST_OF_APPOINTMENTS(t);l.value={...o,full_name:`${o.last_name} ${o.first_name} ${o.middle_name}`},n.appointments=_.data.data}catch(t){console.error("Failed to fetch patient data:",t)}finally{w.value=!1}},T=t=>!t||t.length===0?"No Document":t.map(o=>`${o.display}: ${o.value}`).join(", "),E=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),k=async()=>{m.value=!0,await p.GET_LIST_OF_ECOUNTER_CLASSES()},A=async t=>{t()},C=t=>q(t).format("DD-MM-YYYY HH:mm"),D=t=>{switch(t){case"in-progress":return"bg-yellow-300 text-yellow-900";case"completed":return"bg-green-300 text-green-900";case"canceled":return"bg-red-300 text-red-900";case"draft":return"bg-gray-300 text-gray-900";default:return"bg-gray-200 text-gray-700"}},N=async()=>{const t={patient_id:u,encounter_class:n.newAppointment.role,reason_text:n.newAppointment.text};await b.CREATE_APPOINTMENT(t),await v(),m.value=!1};return Y(async()=>{await v()}),(t,o)=>{const _=i("router-link"),I=i("VaSelect"),P=i("VaTextarea"),M=i("VaButton"),F=i("VaModal");return d(),c("div",Q,[e("div",W,[e("button",{onClick:k,class:"bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"},s(t.$t("createAppointment")),1)]),l.value?(d(),c("div",X,[e("div",Z,[e("h2",tt,s(t.$t("patientInfo")),1),e("div",et,[e("div",st,[e("h3",ot,s(t.$t("patientId")),1),e("p",at,s(l.value.id),1)]),e("div",nt,[e("h3",lt,s(t.$t("fullName")),1),e("p",dt,s(l.value.full_name),1)]),e("div",ct,[e("h3",it,s(t.$t("passport")),1),e("p",rt,s(T(l.value.identifier)),1)]),e("div",pt,[e("h3",mt,s(t.$t("birthDate")),1),e("p",ut,s(E(l.value.birth_date)),1)]),e("div",_t,[e("h3",ht,s(t.$t("phoneNumber")),1),e("p",gt,s(l.value.phone_number||t.$t("noPhoneNumber")),1)]),e("div",ft,[e("h3",yt,s(t.$t("gender")),1),e("p",bt,s(l.value.gender==="1"?t.$t("male"):t.$t("female")),1)])])]),e("div",wt,[e("h2",vt,s(t.$t("appointments")),1),n.appointments.length>0?(d(),c("div",xt,[e("ul",$t,[(d(!0),c(G,null,j(n.appointments,(a,x)=>(d(),c("li",{key:a.id,class:"relative p-4 rounded-lg shadow-sm transition-colors bg-gray-50"},[e("span",{class:z(["absolute right-2 top-2 px-3 py-1 rounded-full text-sm font-bold shadow-sm",D(a.status)])},s(t.$t(a.status)),3),r(_,{to:{name:"appointment-show",params:{id:a.id}},class:"block"},{default:f(()=>[e("h4",St,s(t.$t("appointment"))+" #"+s(x+1),1)]),_:2},1032,["to"]),e("p",Vt,s(t.$t("createdAt"))+": "+s(C(a.created_at)),1),e("p",Tt,[y(s(t.$t("direction"))+": ",1),e("b",null,s(a.encounter_class.code),1),y(" "+s(a.encounter_class.display),1)]),e("p",Et,s(t.$t("appointmentType"))+": "+s(a.encounter_type.display),1),e("p",kt,s(t.$t("note"))+": "+s(a.reason_text),1)]))),128))])])):(d(),c("div",At,[e("p",Ct,s(t.$t("noAppointments")),1)]))])])):(d(),c("div",Dt,[e("p",Nt,s(t.$t("loadingPatientData")),1)])),r(F,{modelValue:m.value,"onUpdate:modelValue":o[2]||(o[2]=a=>m.value=a),size:"medium","mobile-fullscreen":"","close-button":"","hide-default-actions":"","before-cancel":A},{default:f(({cancel:a,ok:x})=>[e("h1",null,s(t.$t("createAppointment")),1),e("div",It,[e("div",Pt,[r(I,{modelValue:n.newAppointment.role,"onUpdate:modelValue":o[0]||(o[0]=h=>n.newAppointment.role=h),label:t.$t("selectDirection"),class:"w-full",options:V.value,"text-by":"display","value-by":"code"},null,8,["modelValue","label","options"])]),e("div",Mt,[r(P,{label:t.$t("note"),modelValue:n.newAppointment.text,"onUpdate:modelValue":o[1]||(o[1]=h=>n.newAppointment.text=h),class:"w-full"},null,8,["label","modelValue"])]),e("div",Ft,[r(M,{onClick:N},{default:f(()=>[y(s(t.$t("create")),1)]),_:1})])])]),_:1},8,["modelValue"])])}}});const zt=R(Ot,[["__scopeId","data-v-5625e8d1"]]);export{zt as default};
//# sourceMappingURL=ShowPage-66926668.js.map
