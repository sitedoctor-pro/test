const SUPABASE_URL = 'https://axgcycsojorwztwlfprg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1YuKU9O3wuH1Zbikx_OonQ_ayCIjmSR';
const WEBSITE_ONESIGNAL_APP_ID = 'b0ca17c7-75cb-49bb-bfbd-936677a81519';
const WHATSAPP_NUMBER = '212662711995';
const $ = (id) => document.getElementById(id);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let products = [];
let currentLang = localStorage.getItem('soumi_lang') || 'fr';
let selectedProduct = null;
let selectedImageIndex = 0;
let geoCache = { ip: null, city: null };
let activityHistory = [];
let pageStart = Date.now();
let analyticsLoaded = false;

const translations = {
  fr: {
    navProducts:'Produits', navReviews:'Avis', navFaq:'FAQ', heroTitle:'Sacs crochet et perles faits main au Maroc 👜✨', heroLead:'Découvrez une collection exclusive de sacs faits main avec amour, finition premium, paiement à la livraison et livraison rapide partout au Maroc.', orderNow:'Commander maintenant', discover:'Découvrir les modèles', productsTitle:'Choisissez le modèle qui vous ressemble', productsLead:'Glissez pour découvrir les modèles. Chaque carte affiche l’image principale; les détails s’ouvrent dans une galerie dédiée.', reviewsTitle:'Avis de nos clientes', reviewsLead:'Partagez votre expérience avec Soumi Crochet.', leaveReview:'Laissez un avis', faqTitle:'Questions fréquentes', faqQ1:'Les sacs sont-ils faits main à 100%?', faqA1:'Oui, chaque sac est travaillé avec précision pour garantir une qualité premium.', faqQ2:'Puis-je payer à la livraison?', faqA2:'Oui, le paiement se fait à la réception partout au Maroc.', faqQ3:'Combien prend la livraison?', faqA3:'La livraison prend généralement entre 24h et 48h.', notifyTitle:'Activez les notifications Soumi Crochet ✨', notifyText:'Recevez les nouveaux modèles, confirmations et offres exclusives directement sur votre appareil.', activateNotifications:'Activate Notifications', continueBrowsing:'Continue Browsing', confirmOrder:'Confirmer la commande', orderTitle:'Finaliser votre commande', nameLabel:'Nom complet', phoneLabel:'Téléphone', cityLabel:'Ville', addressLabel:'Adresse', submitOrder:'Envoyer la commande', price:'Prix', denied:'Les notifications sont désactivées. Certaines confirmations peuvent être limitées.', sentReview:'Merci! Votre avis sera publié après validation.', orderSent:'Commande enregistrée.'
  },
  ar: {
    navProducts:'الموديلات', navReviews:'آراء الزبونات', navFaq:'الأسئلة', heroTitle:'حقائب كروشي وعقيق مخدومة باليد في المغرب 👜✨', heroLead:'تشكيلة حصرية من الصيكان المخدومة بحب، جودة عالية، الدفع عند الاستلام، وتوصيل سريع لجميع مدن المغرب.', orderNow:'اطلبي الصاك دابا', discover:'اكتشفي الموديلات', productsTitle:'اختاري الموديل لي خطف قلبك', productsLead:'سحبي باش تشوفي الموديلات. كل بطاقة فيها الصورة الرئيسية، والتفاصيل كتفتحيهم فمعرض خاص بكل موديل.', reviewsTitle:'آراء زبوناتنا', reviewsLead:'شاركي تجربتك مع Soumi Crochet.', leaveReview:'خلي رأيك', faqTitle:'أسئلة كطرحوها بزاف', faqQ1:'واش الصيكان مخدومين باليد 100%؟', faqA1:'نعم، كل صاك مخدوم بعناية ودقة عالية باش نضمنو ليك جودة ممتازة.', faqQ2:'واش نقدر نخلص حتى يوصلني الصاك؟', faqA2:'بطبيعة الحال، الدفع كيكون عند الاستلام فكل مدن المغرب.', faqQ3:'شحال كياخد التوصيل؟', faqA3:'التوصيل كياخد غالبا بين 24 و48 ساعة.', notifyTitle:'فعلي إشعارات Soumi Crochet ✨', notifyText:'توصلي بالجديد، تأكيد الطلب، والعروض الحصرية مباشرة فالجهاز ديالك.', activateNotifications:'تفعيل الإشعارات', continueBrowsing:'كملي التصفح', confirmOrder:'تأكيد الطلب', orderTitle:'كملي الطلب ديالك', nameLabel:'الاسم الكامل', phoneLabel:'الهاتف', cityLabel:'المدينة', addressLabel:'العنوان', submitOrder:'إرسال الطلب', price:'الثمن', denied:'الإشعارات غير مفعلة. بعض التأكيدات يمكن تكون محدودة.', sentReview:'شكرا! الرأي ديالك غادي يتنشر بعد المراجعة.', orderSent:'تم تسجيل الطلب.'
  }
};

function visitorId(){
  let id = localStorage.getItem('soumi_visitor_id');
  if(!id){ id = `v_${crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(16).slice(2)}`; localStorage.setItem('soumi_visitor_id', id); }
  return id;
}
function sessionId(){
  let id = sessionStorage.getItem('soumi_session_id');
  if(!id){ id = `s_${Date.now()}_${Math.random().toString(16).slice(2)}`; sessionStorage.setItem('soumi_session_id', id); }
  return id;
}
function asset(path){ return path || ''; }
function productName(product){ return product?.name?.[currentLang] || product?.name?.fr || product?.name?.ar || ''; }
function productDesc(product){ return product?.description?.[currentLang] || product?.description?.fr || product?.description?.ar || ''; }
function priceMarkup(product){ return `<span class="price-tag"><del class="old-price">${product.oldPrice || product.price} DH</del><strong>${translations[currentLang].price}: ${product.price} DH</strong></span>`; }
function setDir(){ document.documentElement.lang = currentLang; document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'; }
function applyTranslations(){
  setDir();
  qsa('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if(translations[currentLang][key]) el.textContent = translations[currentLang][key]; });
  qsa('.type-target').forEach(el => { el.classList.remove('typed'); el.style.visibility = 'visible'; });
}
function typeText(el){
  const text = el.textContent.trim();
  if(!text || el.dataset.typedText === text) return;
  el.dataset.typedText = text;
  el.classList.add('typed');
  el.textContent = '';
  let i = 0;
  const tick = () => { el.textContent = text.slice(0, i++); if(i <= text.length) requestAnimationFrame(tick); };
  tick();
}
function initReveal(){
  const io = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); if(entry.target.classList.contains('type-target')) typeText(entry.target); io.unobserve(entry.target); } }), { threshold:.18 });
  qsa('.reveal,.type-target').forEach(el => io.observe(el));
  qsa('#home .type-target').forEach(typeText);
}
async function getGeo(){
  if(geoCache.ip || geoCache.city) return geoCache;
  try{ const ipRes = await fetch('https://api.ipify.org?format=json'); geoCache.ip = (await ipRes.json()).ip || null; }catch(e){ geoCache.ip = null; }
  try{ const locRes = await fetch('https://ipapi.co/json/'); const loc = await locRes.json(); geoCache.city = loc.city || loc.region || null; if(!geoCache.ip && loc.ip) geoCache.ip = loc.ip; }catch(e){ geoCache.city = null; }
  return geoCache;
}
async function getOneSignalId(){
  try{
    if(!window.OneSignalDeferred) return null;
    return await new Promise(resolve => {
      let done = false;
      const finish = (value) => { if(!done){ done = true; resolve(value || null); } };
      OneSignalDeferred.push(async function(OneSignal){
        try{ finish(OneSignal.User?.PushSubscription?.id || OneSignal.User?.onesignalId || null); }catch(e){ finish(null); }
      });
      setTimeout(() => finish(null), 3500);
    });
  }catch(e){ return null; }
}
async function saveSubscriber(city){
  if(!db) return null;
  const player = await getOneSignalId();
  if(!player) return null;
  await db.from('subscribers').upsert({ onesignal_player_id: player, city: city || geoCache.city, device_info: { userAgent:navigator.userAgent, language:navigator.language, platform:navigator.platform, appId:WEBSITE_ONESIGNAL_APP_ID } }, { onConflict:'onesignal_player_id' });
  return player;
}
async function hydrateAnalytics(){
  if(!db || analyticsLoaded) return;
  analyticsLoaded = true;
  const { data } = await db.from('analytics').select('activity_history').eq('visitor_id', visitorId()).maybeSingle();
  if(Array.isArray(data?.activity_history)) activityHistory = data.activity_history.slice(-30);
}
async function updateAnalytics(extra = {}){
  if(!db) return;
  await hydrateAnalytics();
  const geo = await getGeo();
  const onesignal = await getOneSignalId();
  const formDraft = extra.form_draft || {};
  const payload = {
    visitor_id: visitorId(),
    ip_address: geo.ip,
    city: extra.city || geo.city,
    page_url: location.href,
    time_spent_seconds: Math.max(0, Math.round((Date.now() - pageStart) / 1000)),
    last_seen: new Date().toISOString(),
    onesignal_user_id: onesignal,
    activity_history: activityHistory.slice(-30),
    form_draft: formDraft
  };
  await db.from('analytics').upsert(payload, { onConflict:'visitor_id' });
}
function addActivity(type, meta = {}){
  activityHistory.push({ type, meta, at: new Date().toISOString() });
  if(activityHistory.length > 30) activityHistory.shift();
  updateAnalytics().catch(()=>{});
}
async function trackVisit(){
  await hydrateAnalytics();
  if(!activityHistory.some(a => a.type === 'visit' && String(a.at || '').slice(0,10) === new Date().toISOString().slice(0,10))){
    activityHistory.push({ type:'visit', meta:{ page_url: location.href }, at: new Date().toISOString() });
  }
  await updateAnalytics();
}
async function loadProducts(){
  const carousel = $('productCarousel');
  if(!carousel) return;
  carousel.innerHTML = '<div class="loading">Loading...</div>';
  try{
    const res = await fetch('products.json', { cache:'no-store' });
    if(!res.ok) throw new Error('products.json not found');
    const data = await res.json();
    products = Array.isArray(data) ? data : [];
    renderProducts();
  }catch(err){ carousel.innerHTML = '<p class="error">Products could not load. Please refresh.</p>'; console.error(err); }
}
function renderProducts(){
  const carousel = $('productCarousel');
  if(!carousel) return;
  carousel.innerHTML = products.map((p, idx) => `<article class="product-card glass reveal" data-id="${p.id}"><button class="product-media" data-open-product="${idx}"><img src="${asset(p.images?.[0])}" alt="${productName(p)}"></button><div class="product-body"><h3>${productName(p)}</h3><p>${productDesc(p)}</p>${priceMarkup(p)}<button class="btn primary full" data-order-product="${idx}">${translations[currentLang].orderNow}</button></div></article>`).join('') || '<p class="error">No products found.</p>';
  qsa('[data-open-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(+btn.dataset.openProduct, 0)));
  qsa('[data-order-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(+btn.dataset.orderProduct, 0)));
  initReveal();
}
function openProductModal(index, imgIndex = 0){
  selectedProduct = products[index]; selectedImageIndex = imgIndex;
  if(!selectedProduct) return;
  renderProductModal();
  $('productModal')?.classList.add('active'); document.body.classList.add('no-scroll');
  addActivity('product_view', { product_id:selectedProduct.id, product_name:productName(selectedProduct) });
}
function renderProductModal(){
  if(!selectedProduct) return;
  $('modalImage').src = asset(selectedProduct.images[selectedImageIndex]);
  $('modalTitle').textContent = productName(selectedProduct);
  $('modalDesc').textContent = productDesc(selectedProduct);
  $('modalPrice').innerHTML = priceMarkup(selectedProduct);
  $('modalThumbs').innerHTML = selectedProduct.images.map((img,i)=>`<button class="${i===selectedImageIndex?'active':''}" data-thumb="${i}"><img src="${asset(img)}" alt="${productName(selectedProduct)} ${i+1}"></button>`).join('');
  qsa('[data-thumb]', $('modalThumbs')).forEach(btn => btn.addEventListener('click', () => { selectedImageIndex = +btn.dataset.thumb; renderProductModal(); }));
}
function setSelectedProduct(){
  if(!selectedProduct && products[0]) selectedProduct = products[0];
  if(!selectedProduct) return;
  const img = selectedProduct.images[selectedImageIndex] || selectedProduct.images[0];
  $('productId').value = selectedProduct.id;
  $('productName').value = productName(selectedProduct);
  $('productPrice').value = selectedProduct.price;
  $('selectedProductImage').value = img;
  $('selectedPreview').src = asset(img);
  $('selectedName').textContent = `${productName(selectedProduct)} - ${selectedProduct.price} DH`;
}
function openOrder(){ setSelectedProduct(); $('productModal')?.classList.remove('active'); $('orderSheet')?.classList.add('active'); document.body.classList.add('no-scroll'); addActivity('form_open', { product_id:selectedProduct?.id }); }
function closeOverlays(){ qsa('.modal,.notify-modal,.bottom-sheet').forEach(el => el.classList.remove('active')); document.body.classList.remove('no-scroll'); }
async function handleOrderSubmit(e){
  e.preventDefault();
  if(!db || !selectedProduct) return alert('Supabase is not ready.');
  setSelectedProduct();
  const cityTyped = $('customerCity').value.trim();
  const onesignal = await saveSubscriber(cityTyped);
  const imageUrl = $('selectedProductImage').value;
  const payload = {
    customer_name:$('customerName').value.trim(),
    phone:$('customerPhone').value.trim(),
    city:cityTyped || geoCache.city || '',
    address:$('customerAddress').value.trim(),
    product_id:selectedProduct.id,
    product_name:productName(selectedProduct),
    price:Number(selectedProduct.price || 0),
    status:'pending',
    onesignal_user_id:onesignal,
    session_id:sessionId(),
    image_url:imageUrl
  };
  if(!payload.customer_name || !payload.phone || !payload.city || !payload.address) return;
  addActivity('form_submit', { product_id: payload.product_id, product_name: payload.product_name });
  await updateAnalytics({ city: payload.city, form_draft: payload });
  let { error } = await db.from('orders').insert(payload);
  if(error && /image_url|column/i.test(error.message || '')){
    const fallbackPayload = { ...payload };
    delete fallbackPayload.image_url;
    const retry = await db.from('orders').insert(fallbackPayload);
    error = retry.error;
  }
  if(error){ alert(error.message); return; }
  sessionStorage.setItem('soumi_last_order', JSON.stringify({ ...payload, image:imageUrl }));
  location.href = 'thankyou.html';
}
async function loadPublishedReviews(){
  if(!db || !$('publishedReviews')) return;
  const { data } = await db.from('reviews').select('*').eq('is_published', true).order('created_at', { ascending:false }).limit(6);
  $('publishedReviews').innerHTML = (data || []).map(r => `<article class="review-card"><strong>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</strong><h3>${r.reviewer_name} - ${r.city}</h3><p>${r.review_text}</p></article>`).join('') || '<p>No reviews yet.</p>';
}
async function handleReviewSubmit(e){
  e.preventDefault();
  if(!db) return;
  const payload = { reviewer_name:$('reviewerName').value.trim(), city:$('reviewerCity').value.trim(), rating:Number($('reviewRating').value), review_text:$('reviewText').value.trim(), status:'pending', is_published:false };
  const { error } = await db.from('reviews').insert(payload);
  if(error){ $('reviewStatus').textContent = error.message; return; }
  addActivity('review_submit', { rating: payload.rating, city: payload.city });
  $('reviewStatus').textContent = translations[currentLang].sentReview;
  e.target.reset();
  setTimeout(() => { closeOverlays(); $('reviewStatus').textContent = ''; }, 2000);
}
async function showNotificationModal(){
  if(localStorage.getItem('soumi_notify_choice')) return;
  setTimeout(() => $('notifyModal')?.classList.add('active'), 900);
}
async function activateNotifications(){
  try{
    if(window.OneSignalDeferred){
      await new Promise(resolve => OneSignalDeferred.push(async function(OneSignal){ try{ await OneSignal.Notifications.requestPermission(); }catch(e){} resolve(); }));
    }else if('Notification' in window){ await Notification.requestPermission(); }
    const permission = 'Notification' in window ? Notification.permission : 'default';
    localStorage.setItem('soumi_notify_choice', permission);
    if(permission === 'denied') $('notifyWarning').textContent = translations[currentLang].denied;
    await saveSubscriber(geoCache.city);
    if(permission !== 'denied'){
      addActivity('push_subscribe', { permission });
      closeOverlays();
    }
  }catch(e){ $('notifyWarning').textContent = translations[currentLang].denied; }
}
function initEvents(){
  $('menuToggle')?.addEventListener('click', () => $('mainNav')?.classList.toggle('show'));
  $('langSwitch')?.addEventListener('click', () => { currentLang = currentLang === 'fr' ? 'ar' : 'fr'; localStorage.setItem('soumi_lang', currentLang); applyTranslations(); renderProducts(); if(selectedProduct) renderProductModal(); });
  $('galleryPrev')?.addEventListener('click', () => $('productCarousel')?.scrollBy({ left: document.documentElement.dir === 'rtl' ? 360 : -360, behavior:'smooth' }));
  $('galleryNext')?.addEventListener('click', () => $('productCarousel')?.scrollBy({ left: document.documentElement.dir === 'rtl' ? -360 : 360, behavior:'smooth' }));
  qsa('.open-order').forEach(btn => btn.addEventListener('click', openOrder));
  $('confirmProduct')?.addEventListener('click', openOrder);
  qsa('[data-close-product],[data-close-sheet],[data-close-review]').forEach(el => el.addEventListener('click', closeOverlays));
  $('orderForm')?.addEventListener('submit', handleOrderSubmit);
  $('openReviewModalBtn')?.addEventListener('click', () => { $('reviewModal')?.classList.add('active'); document.body.classList.add('no-scroll'); });
  $('reviewForm')?.addEventListener('submit', handleReviewSubmit);
  $('activateNotifications')?.addEventListener('click', activateNotifications);
  $('continueBrowsing')?.addEventListener('click', () => { localStorage.setItem('soumi_notify_choice', 'skipped'); closeOverlays(); });
  $('notifyClose')?.addEventListener('click', closeOverlays);
  document.addEventListener('click', e => {
    const target = e.target.closest('a,button,[data-open-product]');
    if(target) addActivity('click', { text: target.textContent?.trim()?.slice(0,80) || target.dataset.openProduct || '', href: target.href || '' });
  });
  qsa('#orderForm input').forEach(input => input.addEventListener('input', () => {
    addActivity('form_draft', { field: input.id, product_id:selectedProduct?.id });
    updateAnalytics({ city:$('customerCity')?.value || geoCache.city, form_draft:{ name:$('customerName')?.value, phone:$('customerPhone')?.value, city:$('customerCity')?.value, address:$('customerAddress')?.value, product_id:selectedProduct?.id } }).catch(()=>{});
  }));
  window.addEventListener('beforeunload', () => { if(db) updateAnalytics().catch(()=>{}); });
}
async function init(){
  applyTranslations();
  initEvents();
  initReveal();
  loadProducts();
  loadPublishedReviews();
  trackVisit().catch(()=>{});
  showNotificationModal();
}
document.addEventListener('DOMContentLoaded', init);
