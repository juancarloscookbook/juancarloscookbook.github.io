/* Full editorial homepage based on Maika's Cookbook. Preserves app.js and Supabase. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const defaults={
  journalLabel:'THE KITCHEN JOURNAL',
  editorialEyebrow:'WELCOME TO THE KITCHEN',
  editorialTitle:'Recipes, stories and traditions.',
  editorialText:'A collection of treasured recipes, kitchen discoveries and memorable meals. A place to celebrate the pleasure of cooking and sharing good food.',
  chaptersTitle:'The cookbook sections',
  chaptersIntro:'Explore recipes by chapter, from comforting classics to special occasions.',
  exploreEyebrow:'NOT SURE WHAT TO COOK?',
  exploreTitle:'Explore all the recipes.',
  exploreText:'Browse by chapter, discover the latest additions, or find inspiration for your next meal.',
  exploreButton:'Explore all recipes',
  exploreImage:'explore-pasta.jpg',
  latestTitle:'Latest recipes',
  latestIntro:'The newest additions to the kitchen journal.',
  closingTitle:'More than just recipes...',
  closingText:'A collection of flavours, memories and the people who gather around the table.',
  closingNote:'Good food. Better memories.',
  heroButton:'Explore the recipes'
};
const descriptions={
'Desserts & Baking':['desserts','Cakes, pastries and something sweet.'],
'Pasta & Rice':['pasta','Hearty favourites and timeless staples.'],
'Meat':['meat','Slow-cooked classics and generous main dishes.'],
'Fish':['seafood','Fresh catches and coastal flavours.'],
'Soups':['soups','Warm bowls and comforting favourites.'],
'Sides & Sauces':['other','The finishing touches that make a meal.'],
'To Try':['rice','New ideas for the next kitchen adventure.'],
'Main Courses':['meat','Memorable dishes for every table.'],
'Chicken':['chicken','Simple classics and family favourites.'],
'Seafood':['seafood','Fresh, elegant flavours from the sea.']
};
let enhancing=false;
const observer=new MutationObserver(enhance);
const section=(cls,html)=>{let s=document.createElement('section');s.className=cls;s.innerHTML=html;return s};
function enhance(){
 if(enhancing)return;
 const app=$('#app');if(!app)return;
 enhancing=true;
 try{
  const customize=app.querySelector('.settings');
  if(customize&&!customize.querySelector('[data-editorial-fields]')){
   const panel=document.createElement('div');panel.className='panel full';panel.dataset.editorialFields='true';
   panel.innerHTML='<h3>Editorial homepage — editable text and photography</h3><p class="muted">Personalize every section of your homepage. Save and publish settings to update the public site.</p>'+
    Object.entries(defaults).map(([key,def])=>`<label>${esc(key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()))}<textarea data-setting="${key}" rows="${key.endsWith('Text')||key==='chaptersIntro'?3:1}" placeholder="${esc(def)}">${esc(def)}</textarea></label>`).join('');
   const buttons=customize.querySelector('.panel.full');
   customize.insertBefore(panel,buttons||null);
   // Existing app.js saves all [data-setting] fields. Keep defaults until Supabase settings load.
   panel.querySelectorAll('[data-setting]').forEach(el=>{const s=window.__jcEditorialSettings||{};el.value=s[el.dataset.setting]??defaults[el.dataset.setting]});
   const original=customize.querySelector('#saveSettings');
   if(original)original.addEventListener('click',()=>{const entries=panel.querySelectorAll('[data-setting]');window.__jcEditorialSettings=Object.fromEntries([...entries].map(el=>[el.dataset.setting,el.value]));},true);
  }
  const hero=app.querySelector('.hero');
  if(!hero||hero.dataset.editorialDone)return;
  // The homepage's sections are rebuilt by app.js after every navigation.
  hero.dataset.editorialDone='true';
  const root=hero.parentNode;
  const settingFields=()=>window.__jcEditorialSettings||{};
  const val=k=>{const saved=settingFields()[k];return saved===undefined?defaults[k]:saved};
  // For published values, read from Supabase public settings endpoint, without changing app's auth.
  if(!window.__jcEditorialFetched){
   window.__jcEditorialFetched=true;
   const cfg=window.COOKBOOK_CONFIG||{};
   if(cfg.supabaseUrl&&cfg.supabasePublishableKey){
    fetch(cfg.supabaseUrl.replace(/\/$/,'')+'/rest/v1/cookbook_settings?select=settings&id=eq.main',{headers:{apikey:cfg.supabasePublishableKey}})
    .then(r=>r.ok?r.json():[]).then(rows=>{window.__jcEditorialSettings=rows?.[0]?.settings||{};const el=$('#app .hero');if(el){document.querySelector('#brand')?.click()}})
    .catch(()=>{});
   }
  }
  const title=hero.querySelector('h1');
  const subtitle=hero.querySelector('p');
  const pill=hero.querySelector('.pill');
  const cta=hero.querySelector('[data-view="recipes"]');
  if(pill)pill.textContent=val('journalLabel');
  if(cta)cta.textContent=val('heroButton')+' →';
  hero.classList.add('jc-editorial-hero');
  let img=hero.querySelector('img');
  if(!img){img=document.createElement('img');hero.append(img)}
  if(!img.getAttribute('src'))img.src='juan-carlos-hero.jpg';
  img.alt='Artisan bread and olive oil against a deep blue backdrop';
  const welcome=section('welcome-area jc-home-wrap',`<span class="jc-eyebrow">${esc(val('editorialEyebrow'))}</span><h2>${esc(val('editorialTitle'))}</h2><p>${esc(val('editorialText'))}</p>`);
  root.insertBefore(welcome,hero.nextSibling);
  const cats=[...app.querySelectorAll('.section-chip[data-category]')].map(x=>x.dataset.category);
  const categorySection=app.querySelector('.sections')?.closest('section');
  if(categorySection){
   categorySection.className='index-area jc-home-wrap';
   categorySection.innerHTML=`<div class="jc-section-head"><div><h2>${esc(val('chaptersTitle'))}</h2><p>${esc(val('chaptersIntro'))}</p></div><button class="jc-text-link" data-view="recipes">View all recipes →</button></div><div class="illustrated-index">${cats.map((c,i)=>{
    const [image,desc]=descriptions[c]||[['pasta','seafood','meat','rice','soups','desserts','other'][i%7],'Recipes and discoveries from the kitchen.'];
    return `<button class="index-tile index-${esc(image)}" data-category="${esc(c)}"><img src="illustration-${image}.png" alt=""><span class="index-words"><strong>${esc(c)}</strong><small>${esc(desc)}</small><span class="index-count">BROWSE CHAPTER &nbsp; →</span></span><span class="index-arrow">→</span></button>`;
   }).join('')}</div>`;
  }
  const explore=section('explore-strip jc-home-wrap',`<div class="explore-photo" role="img" aria-label="Food photography"></div><div class="explore-copy"><span class="jc-eyebrow">${esc(val('exploreEyebrow'))}</span><h2>${esc(val('exploreTitle'))}</h2><p>${esc(val('exploreText'))}</p><button class="primary" data-view="recipes">${esc(val('exploreButton'))} →</button></div>`);
  explore.querySelector('.explore-photo').style.backgroundImage=`url("${String(val('exploreImage')).replace(/["\\]/g,'')}")`;
  if(categorySection)categorySection.after(explore);else welcome.after(explore);
  const latest=[...root.children].find(s=>s.querySelector('h2')?.textContent==='From the kitchen');
  if(latest){
   latest.classList.add('latest-area','jc-home-wrap');
   const h=latest.querySelector('h2');h.textContent=val('latestTitle');
   const head=document.createElement('div');head.className='jc-section-head';
   const info=document.createElement('div');info.append(h);
   const p=document.createElement('p');p.textContent=val('latestIntro');info.append(p);
   const link=document.createElement('button');link.className='jc-text-link';link.dataset.view='recipes';link.textContent='View all recipes →';
   head.append(info,link);latest.prepend(head);
   const cards=latest.querySelector('.cards');if(cards)cards.classList.add('latest-grid');
   explore.after(latest);
  }
  const closing=section('closing-banner jc-home-wrap',`<div><h2>${esc(val('closingTitle'))}</h2><p>${esc(val('closingText'))}</p></div><div class="closing-note">${esc(val('closingNote'))}</div>`);
  root.append(closing);
  if(categorySection)welcome.after(categorySection);
 }finally{enhancing=false}
}
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
enhance();
})();
