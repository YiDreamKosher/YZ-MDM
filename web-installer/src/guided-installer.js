// Progressive disclosure only: device actions remain in installer.js.
export function initGuidedInstaller() {
  const el = id => document.getElementById(id);
  const copy = {
    en: {title:'Prepare your phone', lead:'Keep your phone unlocked and follow these steps before connecting.', prep:['Use Android 8 or newer and a USB data cable.','Open Settings → About phone and tap Build number seven times to enable Developer options.','In Developer options, enable USB debugging. Connect the USB cable, then approve the debugging prompt on your phone.'], back:'Back', next:'Continue', apps:'Choose your applications', appsLead:'Choose the apps you want, then check what is already installed.', review:'Review and install', reviewLead:'Review your selection, then start installation. Keep your phone connected and unlocked.', selection:'Selected applications', required:'required', connect:'Connect your phone to continue.', check:'Check the applications before continuing.', ready:'Your selection is ready. Installation starts only when you press Install.'},
    fr: {title:'Préparez votre téléphone',lead:'Gardez le téléphone déverrouillé et suivez ces étapes avant de le connecter.',prep:['Utilisez Android 8 ou plus récent et un câble USB de données.','Ouvrez Réglages → À propos du téléphone et appuyez sept fois sur Numéro de build pour activer les options développeur.','Dans les options développeur, activez le débogage USB. Branchez le câble, puis acceptez la demande de débogage sur le téléphone.'],back:'Retour',next:'Continuer',apps:'Choisissez vos applications',appsLead:'Choisissez vos applications, puis vérifiez celles déjà installées.',review:'Vérifiez et installez',reviewLead:'Vérifiez votre sélection, puis lancez l’installation. Gardez le téléphone connecté et déverrouillé.',selection:'Applications sélectionnées',required:'indispensable',connect:'Connectez votre téléphone pour continuer.',check:'Vérifiez les applications avant de continuer.',ready:'Votre sélection est prête. L’installation démarre uniquement avec le bouton Installer.'},
    he: {title:'הכינו את הטלפון',lead:'השאירו את הטלפון פתוח ופעלו לפי השלבים לפני החיבור.',prep:['נדרשים Android 8 ומעלה וכבל USB להעברת נתונים.','פתחו הגדרות ← מידע על הטלפון ולחצו שבע פעמים על מספר Build להפעלת אפשרויות מפתחים.','באפשרויות מפתחים הפעילו ניפוי באגים ב-USB. חברו את הכבל ואשרו את הבקשה בטלפון.'],back:'חזרה',next:'המשך',apps:'בחרו אפליקציות',appsLead:'בחרו את האפליקציות ובדקו מה כבר מותקן.',review:'בדיקה והתקנה',reviewLead:'בדקו את הבחירה והתחילו בהתקנה. השאירו את הטלפון מחובר ופתוח.',selection:'אפליקציות שנבחרו',required:'נדרש',connect:'חברו את הטלפון כדי להמשיך.',check:'בדקו את האפליקציות לפני ההמשך.',ready:'הבחירה מוכנה. ההתקנה תתחיל רק בלחיצה על התקנה.'},
    yi: {title:'גרייט דעם טעלעפֿאָן',lead:'האַלט דעם טעלעפֿאָן אָפֿן און פֿאָלגט די שריט פֿאַרן פֿאַרבינדן.',prep:['מען דאַרף Android 8 אָדער נײַער און אַ USB דאַטן־קאַבל.','עפֿנט Settings → About phone און דריקט זיבן מאָל Build number פֿאַר Developer options.','אין Developer options אַקטיוויזירט USB debugging. פֿאַרבינדט דעם קאַבל און באַשטעטיקט אויפֿן טעלעפֿאָן.'],back:'צוריק',next:'ווײַטער',apps:'קלײַבט אַפּס',appsLead:'קלײַבט די אַפּס און קאָנטראָלירט וואָס איז שוין אינסטאַלירט.',review:'קאָנטראָלירן און אינסטאַלירן',reviewLead:'קאָנטראָלירט די אויסוואַל און הייבט אָן. האַלט דעם טעלעפֿאָן פֿאַרבונדן און אָפֿן.',selection:'אויסגעקליבענע אַפּס',required:'נייטיק',connect:'פֿאַרבינדט דעם טעלעפֿאָן צו ממשיך זײַן.',check:'קאָנטראָלירט די אַפּס איידער איר גייט ווײַטער.',ready:'די אויסוואַל איז גרייט. נאָר דער אינסטאַלירן־קנעפּל הייבט אָן די אינסטאַלאַציע.'}
  };
  let stage = 1, state = {connected:false,checked:false,busy:false};
  const card = document.querySelector('main.card');
  const prep = document.createElement('section');
  prep.className = 'guided-preparation';
  prep.innerHTML = '<ol></ol>';
  card.prepend(prep);
  const review = document.createElement('section');
  review.className = 'guided-review';
  review.innerHTML = '<strong></strong><ul></ul><p class="hint"></p>';
  card.insertBefore(review, document.querySelector('.runtime-panel'));
  const nav = document.createElement('div');
  nav.className = 'actions guided-navigation';
  nav.innerHTML = '<button type="button" class="button quiet" id="guidedBack"></button><span class="hint" id="guidedHint" role="status"></span><button type="button" class="button primary" id="guidedNext"></button>';
  card.append(nav);
  const choices = [...card.querySelectorAll('.section-head, .app, .footline')];
  const device = card.querySelector('.device');
  const owner = card.querySelector('.owner-setup');
  const rule = card.querySelector('.rule');
  const style = document.createElement('style');
  style.textContent = '.guided-preparation ol{padding-inline-start:22px;color:var(--muted);font-size:13px}.guided-preparation li{margin-bottom:12px}.guided-review ul{padding-inline-start:22px;color:var(--muted)}.guided-navigation{grid-template-columns:auto minmax(0,1fr) auto}.guided-navigation .hint{text-align:center}.step[aria-current="step"]{font-weight:650}.button:disabled{cursor:not-allowed;opacity:.45}@media(max-width:540px){.guided-navigation{grid-template-columns:auto 1fr auto}.guided-navigation .hint{grid-column:auto}}';
  document.head.append(style);
  function render(focus = false) {
    const lang = document.documentElement.lang;
    const t = copy[lang] || copy.en;
    el('copyTitle').textContent = stage === 1 ? t.title : stage === 2 ? t.apps : t.review;
    el('copyLead').textContent = stage === 1 ? t.lead : stage === 2 ? t.appsLead : t.reviewLead;
    prep.hidden = stage !== 1;
    prep.firstElementChild.replaceChildren(...t.prep.map(text => {const li = document.createElement('li');li.textContent=text;return li;}));
    device.hidden = stage !== 1;
    rule.hidden = stage !== 1;
    choices.forEach(node => {node.hidden = stage !== 2;});
    owner.hidden = stage !== 3;
    review.hidden = stage !== 3;
    review.querySelector('strong').textContent = t.selection;
    const apps = ['YiDream Launcher ('+t.required+')', ...['zemer','waze'].filter(id=>card.querySelector(`[data-app="${id}"] .select`).checked).map(id=>id==='zemer'?'Zemer':'Waze')];
    review.querySelector('ul').replaceChildren(...apps.map(name=>{const li=document.createElement('li');li.textContent=name;return li;}));
    review.querySelector('p').textContent = t.ready;
    el('checkBtn').hidden = stage !== 2;
    el('installBtn').hidden = stage !== 3;
    el('actionNote').hidden = stage === 1;
    el('guidedBack').textContent = t.back;
    el('guidedBack').hidden = stage === 1;
    el('guidedBack').disabled = state.busy;
    el('guidedNext').textContent = t.next;
    el('guidedNext').hidden = stage === 3;
    el('guidedNext').disabled = state.busy || (stage === 1 ? !state.connected : !state.checked);
    el('guidedHint').textContent = stage === 1 && !state.connected ? t.connect : stage === 2 && !state.checked ? t.check : '';
    [1,2,3].forEach(n=>{const node=el('step'+n);node.classList.toggle('active',n===stage);node.classList.toggle('done',n<stage);if(n===stage)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});
    if(focus){el('copyTitle').tabIndex=-1;el('copyTitle').focus();}
  }
  el('guidedNext').addEventListener('click',()=>{if(state.busy || (stage===1&&!state.connected) || (stage===2&&!state.checked))return;stage=Math.min(3,stage+1);render(true);});
  el('guidedBack').addEventListener('click',()=>{if(state.busy)return;stage=Math.max(1,stage-1);render(true);});
  window.addEventListener('installer-state',event=>{state=event.detail;if(!state.connected)stage=1;render();});
  window.addEventListener('installer-language',()=>render());
  card.querySelectorAll('.select').forEach(node=>node.addEventListener('change',()=>render()));
  render();
}
