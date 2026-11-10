1) ارفع كل الملفات في فولدر واحد على Netlify أو Cloudflare Pages.
2) Firebase Console > Authentication > Settings > Authorized domains: ضيف دومين موقعك. وفعّل Email/Password و Google.
3) Firestore > Rules: الصق محتوى firestore.rules واضغط Publish.
4) أول حساب تسجّل بيه بعد النشر بيبقى المالك. سجّل انت الأول قبل أي حد.
5) لوحة الإدارة: youssefalaa101020.html (متحطهاش في أي مكان عام).
6) غيّر YOUR-DOMAIN في robots.txt و sitemap.xml.
7) في Google Cloud > Credentials: قيّد الـ API key على دومينك.
8) (اختياري لكن مُوصى بيه) App Check: Firebase Console > App Check > سجّل الموقع بـ reCAPTCHA v3 وخد الـ Site key، حطه في fb.js مكان APPCHECK_KEY، وبعد ما تتأكد إن الموقع شغال فعّل Enforce على Firestore.
9) الأعمال: من لوحة الإدارة > الأعمال تقدر تضيف نصوص وصور وفيديو وملفات. الملفات الكبيرة ارفعها على Drive/Dropbox وحط الرابط. في إعدادات Cloudinary Upload Preset تأكد إن الصيغ المسموحة تشمل psd و pdf و txt و zip.
