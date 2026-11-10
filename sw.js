const V='v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['manifest.json','icon-192.png'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok&&!u.pathname.includes('youssefalaa101020')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('404.html'))))});
