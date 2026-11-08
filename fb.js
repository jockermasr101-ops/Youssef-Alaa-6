import {initializeApp} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,signOut} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,collection,query,where,onSnapshot,runTransaction,arrayUnion} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
// إعدادات Firebase عامة بطبيعتها. الحماية الحقيقية من firestore.rules
const app=initializeApp({apiKey:"AIzaSyA4AMdIdb4El8laeNTSEaeNh7PYob023u4",authDomain:"youssef-101.firebaseapp.com",projectId:"youssef-101",storageBucket:"youssef-101.firebasestorage.app",messagingSenderId:"663356705913",appId:"1:663356705913:web:36b8f50aa09bafa50f98a8"});
const auth=getAuth(app),db=getFirestore(app),A=window.APP,CLOUD="vohjq4fi",PRESET="zzr8q6oz";
const clean=o=>JSON.parse(JSON.stringify(o)),STAFF=['owner','admin','staff'];
let unsubs=[],tm,last='';
async function mk(u,data){await runTransaction(db,async tx=>{const o=doc(db,'config','owner'),s=await tx.get(o),first=!s.exists();if(first)tx.set(o,{uid:u.uid});tx.set(doc(db,'users',u.uid),clean({email:u.email,role:first?'owner':'client',data,at:Date.now()}))})}
async function load(u){const s=await getDoc(doc(db,'users',u.uid));if(!s.exists()){A.user(null);return null}const p={id:u.uid,...s.data()};A.user(p);subs(p);return p}
function listen(ref,fn){unsubs.push(onSnapshot(ref,fn,e=>console.warn(e.code)))}
const rows=s=>s.docs.map(d=>({...d.data(),id:d.id}));
function subs(p){unsubs.forEach(f=>f());unsubs=[];const st=STAFF.includes(p.role),c=n=>collection(db,n),q=n=>query(c(n),where('uid','==',p.id));
 listen(doc(db,'site','private'),s=>A.setSite(null,s.exists()?s.data():{}));
 if(st){listen(c('orders'),s=>A.set('orders',rows(s)));listen(c('leads'),s=>A.set('leads',rows(s).map(x=>({...x,lead:1}))));listen(c('transfers'),s=>A.set('transfers',rows(s)));listen(c('support'),s=>A.set('support',rows(s)));listen(c('users'),s=>A.set('users',rows(s)))}
 else{listen(q('orders'),s=>A.set('orders',rows(s)));listen(q('transfers'),s=>A.set('transfers',rows(s)));listen(doc(db,'support',p.id),s=>A.set('support',s.exists()?[{...s.data(),id:p.id}]:[]))}}
onSnapshot(doc(db,'site','main'),s=>A.setSite(s.exists()?s.data():{},null),e=>console.warn(e.code));
onAuthStateChanged(auth,u=>{if(!u){unsubs.forEach(f=>f());unsubs=[];A.user(null)}else load(u)});
const cur=()=>auth.currentUser;
window.FB={
 async register(email,pw,data){const c=await createUserWithEmailAndPassword(auth,email,pw);await mk(c.user,data);const p=await load(c.user);A.toast(p&&p.role==='owner'?'مبروك! أنت المالك':'اتعمل الحساب')},
 async login(e,p){await signInWithEmailAndPassword(auth,e,p)},
 async google(){const c=await signInWithPopup(auth,new GoogleAuthProvider()),s=await getDoc(doc(db,'users',c.user.uid)),nm=c.user.displayName||'';if(!s.exists()){await mk(c.user,{name:nm,n:nm.split(' ').slice(0,4)});await load(c.user)}},
 logout(){return signOut(auth)},
 saveSite(){clearTimeout(tm);tm=setTimeout(async()=>{if(!['owner','admin'].includes(A.role())||!A.ready())return;const {pub,priv}=A.getSite(),j=JSON.stringify([pub,priv]);if(j===last)return;last=j;try{await setDoc(doc(db,'site','main'),clean(pub));await setDoc(doc(db,'site','private'),clean(priv))}catch(e){A.toast('تعذّر الحفظ: '+e.code)}},700)},
 addOrder(o){return setDoc(doc(db,o.lead?'leads':'orders',o.id),clean(o)).catch(e=>A.toast('تعذّر الإرسال: '+e.code))},
 saveOrder(o){return updateDoc(doc(db,o.lead?'leads':'orders',o.id),{st:o.st,amt:o.amt||0}).catch(e=>A.toast('تعذّر الحفظ: '+e.code))},
 delOrder(o){return deleteDoc(doc(db,o.lead?'leads':'orders',o.id)).catch(e=>A.toast('تعذّر الحذف: '+e.code))},
 msg(k,m){const u=cur();if(k==='support')return setDoc(doc(db,'support',u.uid),{uid:u.uid,email:u.email,msgs:arrayUnion(m)},{merge:true});if(k.startsWith('support:'))return updateDoc(doc(db,'support',k.slice(8)),{msgs:arrayUnion(m)});return updateDoc(doc(db,'orders',k),{msgs:arrayUnion(m)})},
 async upload(file){const f=new FormData();f.append('file',file);f.append('upload_preset',PRESET);const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,{method:'POST',body:f}),j=await r.json();if(!j.secure_url)throw new Error(j.error&&j.error.message||'فشل الرفع');return j.secure_url},
 async addTransfer(t,file){try{if(file)t.rc=await this.upload(file);await setDoc(doc(db,'transfers',t.id),clean(t))}catch(e){A.toast('تعذّر إرسال التحويل: '+(e.code||e.message))}},
 saveTransfer(t){return updateDoc(doc(db,'transfers',t.id),{st:t.st}).catch(e=>A.toast('تعذّر الحفظ: '+e.code))},
 role(u){return updateDoc(doc(db,'users',u.id),{role:u.role}).catch(e=>A.toast('تعذّر: '+e.code))},
 owner(u,m){return runTransaction(db,async tx=>{tx.update(doc(db,'users',u.id),{role:'owner'});tx.update(doc(db,'users',m.id),{role:'admin'});tx.update(doc(db,'config','owner'),{uid:u.id})}).catch(e=>A.toast('تعذّر النقل: '+e.code))}
};
