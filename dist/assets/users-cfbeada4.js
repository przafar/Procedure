import{s as o}from"./utils-b2fc192b.js";import{u as g,p as w}from"./users-db-c5bad630.js";const n=g,U=t=>w.filter(e=>e.team.includes(Number(t))).map(e=>({...e,project_owner:n.find(s=>s.id===e.project_owner),team:e.team.map(s=>n.find(i=>i.id===s)),status:e.status})),m=(t,e)=>e==="projects"?t.projects.map(s=>s.project_name).join(", "):t[e],y=async t=>{await o(1e3);const{isActive:e,search:s,sortBy:i,sortingOrder:c}=t;let r=n;r=r.filter(a=>a.active===e),s&&(r=r.filter(a=>a.fullname.toLowerCase().includes(s.toLowerCase()))),r=r.map(a=>({...a,projects:U(a.id)})),i&&c&&(r=r.sort((a,l)=>{const f=m(a,i),u=m(l,i);return f>u?c==="asc"?1:-1:f<u?c==="asc"?-1:1:0}));const{page:d=1,perPage:p=10}=t||{};return{data:r.slice((d-1)*p,d*p),pagination:{page:d,perPage:p,total:r.length}}},h=async t=>{await o(1e3),n.unshift(t)},v=async t=>{await o(1e3);const e=n.findIndex(s=>s.id===t.id);n[e]=t},I=async t=>{await o(1e3),n.splice(n.findIndex(e=>e.id===t.id),1)};export{h as a,y as g,I as r,v as u};
//# sourceMappingURL=users-cfbeada4.js.map
