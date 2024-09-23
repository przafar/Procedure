import{d as g,Z as x,a0 as I,f as l,a as k,g as C,w as r,b as c,i as d,h as t,R as m}from"./index-d0dba67e.js";import{u as R}from"./useForm-18fd503d.js";import{u as P}from"./useToast-e2130e64.js";const A=c("h1",{class:"font-semibold text-4xl mb-4"},"Sign up",-1),B={class:"text-base mb-4 leading-5"},S={class:"flex justify-center mt-4"},N=g({__name:"Signup",setup(q){const{validate:f}=R("form"),{push:_}=x(),{init:v}=P(),o=I({email:"",password:"",repeatPassword:""}),p=()=>{f()&&(v({message:"You've successfully signed up",color:"success"}),_({name:"dashboard"}))},w=[e=>!!e||"Password field is required",e=>e&&e.length>=8||"Password must be at least 8 characters long",e=>e&&/[A-Za-z]/.test(e)||"Password must contain at least one letter",e=>e&&/\d/.test(e)||"Password must contain at least one number",e=>e&&/[!@#$%^&*(),.?":{}|<>]/.test(e)||"Password must contain at least one special character"];return(e,n)=>{const b=l("RouterLink"),u=l("VaInput"),i=l("VaIcon"),V=l("VaValue"),y=l("VaButton"),h=l("VaForm");return k(),C(h,{ref:"form",onSubmit:m(p,["prevent"])},{default:r(()=>[A,c("p",B,[d(" Have an account? "),t(b,{to:{name:"login"},class:"font-semibold text-primary"},{default:r(()=>[d("Login")]),_:1})]),t(u,{modelValue:o.email,"onUpdate:modelValue":n[0]||(n[0]=a=>o.email=a),rules:[a=>!!a||"Email field is required",a=>/.+@.+\..+/.test(a)||"Email should be valid"],class:"mb-4",label:"Email",type:"email"},null,8,["modelValue","rules"]),t(V,{"default-value":!1},{default:r(a=>[t(u,{ref:"password1",modelValue:o.password,"onUpdate:modelValue":n[1]||(n[1]=s=>o.password=s),rules:w,type:a.value?"text":"password",class:"mb-4",label:"Password",messages:"Password should be 8+ characters: letters, numbers, and special characters.",onClickAppendInner:m(s=>a.value=!a.value,["stop"])},{appendInner:r(()=>[t(i,{name:a.value?"mso-visibility_off":"mso-visibility",class:"cursor-pointer",color:"secondary"},null,8,["name"])]),_:2},1032,["modelValue","type","onClickAppendInner"]),t(u,{ref:"password2",modelValue:o.repeatPassword,"onUpdate:modelValue":n[2]||(n[2]=s=>o.repeatPassword=s),rules:[s=>!!s||"Repeat Password field is required",s=>s===o.password||"Passwords don't match"],type:a.value?"text":"password",class:"mb-4",label:"Repeat Password",onClickAppendInner:m(s=>a.value=!a.value,["stop"])},{appendInner:r(()=>[t(i,{name:a.value?"mso-visibility_off":"mso-visibility",class:"cursor-pointer",color:"secondary"},null,8,["name"])]),_:2},1032,["modelValue","rules","type","onClickAppendInner"])]),_:1}),c("div",S,[t(y,{class:"w-full",onClick:p},{default:r(()=>[d(" Create account")]),_:1})])]),_:1},8,["onSubmit"])}}});export{N as default};
//# sourceMappingURL=Signup-026353f4.js.map
