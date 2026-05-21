const $ = (id) => document.getElementById(id);
const ASSET_IMG = 'assets/img/';
const STORE_IMAGE_BASE = 'soumicrochet.store/';
const WHATSAPP_NUMBER = '212662711995';

let products = [];
let currentLang = localStorage.getItem('soumi_lang') || 'fr';
let selectedProduct = null;
let selectedImageIndex = 0;
let modalProduct = null;
let modalImageIndex = 0;
let revealObserver;

const translations = {
  ar:{
    navProducts:'الموديلات',navStory:'القصة',navReviews:'آراء الزبونات',navFaq:'الأسئلة',navGuarantees:'الضمانات',
    heroTitle:'✨ تألقي بلمسة فريدة.. صيكان هماوية مخدومة باليد! 👜',
    heroLead:'تشكيلة حصرية من حقائب الكروشي والعقيق 💎. خدمة متقونة، جودة عالية، وتفاصيل كتخطف الأنظار 😍. اختاري الستايل لي يواتيك وكوني متميزة فكل مناسبة 👑.',
    badge1:'مخدوم باليد',badge2:'الدفع عند الاستلام',badge3:'موديلات محدودة',
    primaryCta:'🛒 اطلبي الصاك ديالك دابا',secondaryCta:'👇 اكتشفي جميع الموديلات',
    productsTitle:'اختاري الموديل لي خطف قلبك',
    productsLead:'زلاقي يمين ويسار باش تشوفي الموديلات. كل بطاقة كتبيّن الصورة الرئيسية فقط، والتفاصيل كيتفتحو فالمودال.',
    storyTitle:'✨ ماشي غير صاك.. هادي تحفة فنية مخدومة بحب! 💖',
    storyBody:'كل صاك من soumicrochet 🧶 كيهز معاه قصة ديال إبداع، صبر، ودقة متناهية ⏳. ملي كتشوفي داك العقيق الكحل البراق مستف حبة حبة 🖤، ولا ديك الغرزة ديال الكروشي السميكة لي مخدومة باليد بعناية 🧵، غتعرفي بلي هادشي ماشي خدمة د الماكينة ولا إنتاج بالجملة 🚫.. هادي خدمة د اليدين 🤲 لي عطات وقتها وروحها باش تخرج ليك بياسة وحدة وفريدة 👑. التفاصيل عندنا هي كلشي! 🔍 من السنسلة الذهبية لي كتعطي لمسة ديال الفخامة ✨، للقفل المتين 🔒، وصولاً للهيكل لي كيخلي الصاك شاد راسو وعامر تبارك الله 👜.',
    storyCta:'نطلب موديل ديالي',reviewsTitle:'آراء زبونات Soumi Crochet',faqTitle:'أسئلة كطرحوها بزاف',
    faqQ1:'واش الصيكان مخدومين باليد 100%؟',faqA1:'نعم، كل صاك مخدوم بعناية ودقة عالية من طرف حرفيين، وهادشي كياخد وقت باش نضمنو ليك جودة هماوية وموديل ماكاينش بحالو.',
    faqQ2:'واش نقدر نخلص حتى يوصلني الصاك؟',faqA2:'بطبيعة الحال! الدفع كيكون عند الاستلام (Cash on Delivery) باش تكوني مرتاحة وتأكدي من الجودة ديال صاكك عاد تخلصي.',
    faqQ3:'شحال كياخد التوصيل؟',faqA3:'التوصيل سريع وكياخد بين 24 حتى 48 ساعة كأقصى حد لجميع المدن المغربية.',
    faqQ4:'واش التصاور حقيقيين؟',faqA4:'أكيد، كاع التصاور لي كتشوفي هما ديال الصيكان الحقيقيين ديالنا، وتأكدي بلي غيوصلك نفس الموديل لي شفتي وعجبك.',
    trustTitle:'✨ وعودنا ليك.. باش تقداي ونتي مرتاحة 100%!',
    trust1Title:'🥇 جودة مافيهاش نقاش',trust1Desc:'صيكان مخدومين بحب وعناية، كل غرزة وكل عقيقة بلاصتها باش يدومو معاك سنين.',
    trust2Title:'🤝 أثمنة معقولة بزاف',trust2Desc:'الجودة ديالنا كتسوى كثر، ولكن حيت كنخدمو ديريكت من يدينا ليديك وفرنا ليك أحسن ثمن.',
    trust3Title:'🚚 خلصي حتى تشدي صاكك',trust3Desc:'شوفي صاكك بعينيك، قيسيه وعجبك وتأكدي من الجودة ديالو، عاد خلصي.',
    trust4Title:'📞 خدمة ما بعد البيع',trust4Desc:'حنا معاك ديما، أي استفسار، فريقنا فالواتساب محلول ليك فكل وقت باش يجاوبك بسرعة.',
    orderBtn:'طلبها',confirm:'تأكيد الطلب',orderTitle:'كملي معلومات الطلب',nextBtn:'التالي',backBtn:'رجوع',
    nameLabel:'الاسم الكامل',phoneLabel:'رقم الهاتف',cityLabel:'المدينة',addressLabel:'العنوان الكامل',
    submitBtn:'تأكيد الطلب',stickyCta:'اطلبي الصاك ديالك دابا',waIntro:'سلام، كيفاش نقدر نعاونك؟ اختاري جواب سريع:',
    footerText:'صيكان كروشي وعقيق مخدومين باليد فالمغرب. أناقة حرفية، توصيل سريع، والدفع عند الاستلام.',
    policiesLink:'سياسة التوصيل والضمان',priceLabel:'الثمن'
  },
  fr:{
    navProducts:'Produits',navStory:'Histoire',navReviews:'Avis',navFaq:'FAQ',navGuarantees:'Garanties',
    heroTitle:'✨ Brillez avec une touche unique.. des sacs handmade qui captivent! 👜',
    heroLead:'Collection exclusive de sacs crochet et perles 💎. Finition soignée, haute qualité, et des détails qui attirent tous les regards 😍. Choisissez le style qui vous ressemble et soyez unique à chaque occasion 👑.',
    badge1:'Fait main',badge2:'Paiement à la livraison',badge3:'Modèles limités',
    primaryCta:'🛒 Commander mon sac maintenant',secondaryCta:'👇 Découvrir tous les modèles',
    productsTitle:'Choisissez le modèle qui vous fait craquer',
    productsLead:'Glissez à gauche et à droite pour découvrir les modèles. Chaque carte montre l’image principale; les détails s’ouvrent dans le modal.',
    storyTitle:'✨ Pas juste un sac.. une œuvre d’art faite avec amour! 💖',
    storyBody:'Chaque sac soumicrochet 🧶 porte une histoire de créativité, de patience et de précision extrême ⏳. Quand vous voyez ces perles noires brillantes posées une par une 🖤, ou cette maille crochet épaisse travaillée soigneusement à la main 🧵, vous savez que ce n’est ni une machine ni une production de masse 🚫.. c’est le travail des mains 🤲 qui donnent du temps et de l’âme pour créer une pièce unique 👑. Les détails sont tout pour nous! 🔍 De la chaîne dorée qui apporte une touche de luxe ✨, au fermoir solide 🔒, jusqu’à la structure qui garde le sac bien formé et généreux 👜.',
    storyCta:'Commander mon modèle',reviewsTitle:'Avis des clientes Soumi Crochet',faqTitle:'Questions fréquentes',
    faqQ1:'Les sacs sont-ils 100% faits main?',faqA1:'Oui, chaque sac est travaillé avec soin et haute précision par des artisans, ce qui demande du temps pour garantir une qualité premium et un modèle unique.',
    faqQ2:'Puis-je payer à la livraison?',faqA2:'Bien sûr! Le paiement se fait à la réception pour que vous soyez rassurée et que vous vérifiiez la qualité de votre sac avant de payer.',
    faqQ3:'Combien de temps prend la livraison?',faqA3:'La livraison est rapide et prend entre 24 et 48 heures maximum dans toutes les villes du Maroc.',
    faqQ4:'Les photos sont-elles réelles?',faqA4:'Oui, toutes les photos montrent nos vrais sacs. Vous recevrez le même modèle que vous avez vu et choisi.',
    trustTitle:'✨ Nos Engagements.. Pour un achat en toute sérénité!',
    trust1Title:'🥇 Qualité irréprochable',trust1Desc:'Des sacs faits main avec passion et précision pour durer.',
    trust2Title:'🤝 Prix juste et transparent',trust2Desc:"En travaillant directement de l'artisan à vous, nous offrons le meilleur prix.",
    trust3Title:'🚚 Paiement à la livraison',trust3Desc:'Vérifiez votre sac de vos propres yeux, assurez-vous de la qualité, et payez à la réception.',
    trust4Title:'📞 Service client dédié',trust4Desc:'Nous sommes toujours là pour vous. Notre équipe est disponible sur WhatsApp pour vous.',
    orderBtn:'Commander',confirm:'Confirmer la commande',orderTitle:'Finaliser votre commande',nextBtn:'Suivant',backBtn:'Retour',
    nameLabel:'Nom complet',phoneLabel:'Téléphone',cityLabel:'Ville',addressLabel:'Adresse complète',
    submitBtn:'Confirmer la commande',stickyCta:'Commander maintenant',waIntro:'Bonjour, comment pouvons-nous vous aider?',
    footerText:'Sacs crochet et perles faits main au Maroc. Élégance artisanale, livraison rapide, paiement à la réception.',
    policiesLink:'Politiques & garanties',priceLabel:'Prix'
  }
};

function escapeHTML(value){
  return String(value || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function asset(path){ return path || ''; }
function imageUrl(path){ return STORE_IMAGE_BASE + String(path || '').replace(/^\/+/,''); }
function productName(p){ return p?.name?.[currentLang] || p?.name?.fr || p?.name?.ar || ''; }
function productDesc(p){ return p?.description?.[currentLang] || p?.description?.fr || p?.description?.ar || ''; }
function priceText(p){ return currentLang === 'ar' ? `${p.price} درهم` : `${p.price} DH`; }
function oldPriceText(p){ return currentLang === 'ar' ? `${p.oldPrice} درهم` : `${p.oldPrice} DH`; }
function priceFullText(p){ return `${oldPriceText(p)} → ${priceText(p)}`; }
function priceHtml(p){
  return `<span class="price-tag"><span>${translations[currentLang].priceLabel}:</span> <del class="old-price">${oldPriceText(p)}</del> <strong>${priceText(p)}</strong></span>`;
}
function safeSet(id, value){ const el = $(id); if(el) el.textContent = value; }

async function loadProducts(){
  const response = await fetch('products.json', {cache:'no-store'});
  if(!response.ok) throw new Error('products.json not found');
  products = await response.json();
  selectedProduct = products[0];
  modalProduct = products[0];
}

function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if(translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('soumi_lang', currentLang);
  document.querySelectorAll('#langSwitch span').forEach(s => s.classList.toggle('active', s.textContent.toLowerCase() === currentLang));
  renderProducts();
  renderPicker();
  setSelectedProduct(selectedProduct || products[0], selectedImageIndex);
  prepareTypeTargets(true);
  typeHeroTargets();
}

function renderProducts(){
  const wrap = $('productCarousel');
  if(!wrap || !products.length) return;
  wrap.innerHTML = products.map((p, idx) => `
    <article class="product-card glass reveal">
      <button class="product-media" type="button" data-open-product="${p.id}" aria-label="${escapeHTML(productName(p))}">
        <img src="${asset(p.images[0])}" alt="${escapeHTML(productName(p))}" loading="lazy" />
        <span class="product-badge">${String(idx+1).padStart(2,'0')}</span>
      </button>
      <div class="product-card-body">
        <h3>${escapeHTML(productName(p))}</h3>
        ${priceHtml(p)}
        <p class="type-target product-desc-type">${escapeHTML(productDesc(p))}</p>
        <button class="btn btn-primary btn-small btn-glow pulse" type="button" data-order-product="${p.id}">${translations[currentLang].orderBtn}</button>
      </div>
    </article>`).join('');

  wrap.querySelectorAll('[data-open-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(btn.dataset.openProduct)));
  wrap.querySelectorAll('[data-order-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(btn.dataset.orderProduct)));
  prepareTypeTargets(true, wrap);
  observeReveal();
}

function renderPicker(){
  const grid = $('visualPickerGrid');
  if(!grid || !products.length) return;
  grid.innerHTML = products.map(p => `
    <button type="button" class="${selectedProduct && selectedProduct.id === p.id ? 'active':''}" data-pick-product="${p.id}">
      <img src="${asset(p.images[0])}" alt="${escapeHTML(productName(p))}" loading="lazy" />
      <strong>${escapeHTML(productName(p))}</strong>
      <span class="picker-price">${priceHtml(p)}</span>
    </button>`).join('');

  grid.querySelectorAll('[data-pick-product]').forEach(btn => btn.addEventListener('click', () => {
    const p = products.find(x => x.id === btn.dataset.pickProduct) || products[0];
    setSelectedProduct(p, 0);
    renderPicker();
  }));
}

function setSelectedProduct(product, imgIndex = 0){
  selectedProduct = product || products[0];
  if(!selectedProduct) return;
  selectedImageIndex = imgIndex || 0;
  const file = selectedProduct.images[selectedImageIndex] || selectedProduct.images[0];
  const fullUrl = imageUrl(file);
  if($('selectedModelName')) $('selectedModelName').value = productName(selectedProduct);
  if($('selectedProductImage')) $('selectedProductImage').value = fullUrl;
  if($('selectedProductPrice')) $('selectedProductPrice').value = priceFullText(selectedProduct);
  if($('sourcePage')) $('sourcePage').value = window.location.href;
  if($('selectedPreview')) {$('selectedPreview').src = asset(file); $('selectedPreview').alt = productName(selectedProduct);}
  safeSet('selectedLabel', productName(selectedProduct));
  if($('selectedPriceLabel')) $('selectedPriceLabel').innerHTML = priceHtml(selectedProduct);
  safeSet('selectedUrlText', fullUrl);
  safeSet('finalProductName', productName(selectedProduct));
  if($('finalProductPrice')) $('finalProductPrice').innerHTML = priceHtml(selectedProduct);
  safeSet('finalProductUrl', fullUrl);
}

function openProductModal(id){
  const p = products.find(x => x.id === id) || products[0];
  modalProduct = p;
  modalImageIndex = 0;
  renderProductModal();
  openModal('productModal');
}

function renderProductModal(){
  const node = $('productModalContent');
  if(!node || !modalProduct) return;
  const imgs = modalProduct.images || [];
  const file = imgs[modalImageIndex] || imgs[0];
  node.innerHTML = `
    <div class="modal-product-grid">
      <div class="modal-carousel">
        <img id="modalCarouselImage" src="${asset(file)}" alt="${escapeHTML(productName(modalProduct))}" />
        <button class="carousel-arrow prev" type="button" id="modalPrev" aria-label="Previous image">‹</button>
        <button class="carousel-arrow next" type="button" id="modalNext" aria-label="Next image">›</button>
        <div class="carousel-dots">${imgs.map((_,i)=>`<button type="button" class="${i===modalImageIndex?'active':''}" data-modal-dot="${i}" aria-label="Image ${i+1}"></button>`).join('')}</div>
      </div>
      <div class="modal-info">
        <span class="eyebrow">SOUMI DETAILS</span>
        <h2>${escapeHTML(productName(modalProduct))}</h2>
        ${priceHtml(modalProduct)}
        <p>${escapeHTML(productDesc(modalProduct))}</p>
        <div class="modal-thumbs">${imgs.map((img,i)=>`<button type="button" class="${i===modalImageIndex?'active':''}" data-modal-thumb="${i}"><img src="${asset(img)}" alt="${escapeHTML(productName(modalProduct))} ${i+1}" /></button>`).join('')}</div>
        <button class="btn btn-primary btn-xl btn-glow pulse" type="button" id="confirmModalOrder">${translations[currentLang].confirm}</button>
      </div>
    </div>`;

  $('modalPrev')?.addEventListener('click', () => changeModalImage(-1));
  $('modalNext')?.addEventListener('click', () => changeModalImage(1));
  document.querySelectorAll('[data-modal-dot],[data-modal-thumb]').forEach(btn => btn.addEventListener('click', () => {
    modalImageIndex = Number(btn.dataset.modalDot ?? btn.dataset.modalThumb);
    renderProductModal();
  }));
  $('confirmModalOrder')?.addEventListener('click', () => {
    setSelectedProduct(modalProduct, modalImageIndex);
    closeModal('productModal');
    showStep(1);
    renderPicker();
    openModal('orderModal');
  });
  setupSwipe(node.querySelector('.modal-carousel'), (dir) => changeModalImage(dir));
}

function changeModalImage(direction){
  if(!modalProduct) return;
  const total = modalProduct.images.length;
  modalImageIndex = (modalImageIndex + direction + total) % total;
  renderProductModal();
}

function setupSwipe(el, cb){
  if(!el) return;
  let sx=0, sy=0;
  el.addEventListener('touchstart', e => {sx=e.touches[0].clientX; sy=e.touches[0].clientY;}, {passive:true});
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) cb(dx > 0 ? -1 : 1);
  }, {passive:true});
}

function openModal(id){
  const node = $(id);
  if(!node) return;
  node.classList.add('show');
  node.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}

function closeModal(id){
  const node = $(id);
  if(!node) return;
  node.classList.remove('show');
  node.setAttribute('aria-hidden','true');
  if(!document.querySelector('.modal.show')) document.body.classList.remove('modal-open');
}

function showStep(step){
  document.querySelectorAll('.form-step').forEach(s => s.classList.toggle('active', s.dataset.step === String(step)));
  document.querySelectorAll('.order-progress span').forEach((s,i)=>s.classList.toggle('active', i < step));
  prepareTypeTargets(true, $('orderForm'));
  if(step === 1) renderPicker();
}

function validateStep(step){
  if(step === 2){
    const name = $('customerName'); const phone = $('customerPhone');
    if(!name.value.trim()){name.focus(); return false;}
    phone.value = normalizePhone(phone.value);
    if(!/^0[5-7][0-9]{8}$/.test(phone.value)){
      phone.focus();
      alert(currentLang === 'ar' ? 'دخل رقم هاتف مغربي صحيح بحال 06XXXXXXXX' : 'Entrez un numéro marocain valide comme 06XXXXXXXX');
      return false;
    }
  }
  return true;
}

function normalizePhone(value){
  let v = (value || '').replace(/\s+/g,'').replace(/[^0-9]/g,'');
  if(v.startsWith('212')) v = '0' + v.slice(3);
  return v;
}

function initOrderForm(){
  document.querySelectorAll('.js-open-order').forEach(btn => btn.addEventListener('click', () => {
    showStep(1);
    renderPicker();
    setSelectedProduct(selectedProduct || products[0], selectedImageIndex);
    openModal('orderModal');
  }));
  $('closeProductModal')?.addEventListener('click', () => closeModal('productModal'));
  $('closeOrderSheet')?.addEventListener('click', () => closeModal('orderModal'));
  document.querySelectorAll('[data-close="product"]').forEach(x => x.addEventListener('click', () => closeModal('productModal')));
  document.querySelectorAll('[data-close="order"]').forEach(x => x.addEventListener('click', () => closeModal('orderModal')));
  document.querySelectorAll('.next-step').forEach(btn => btn.addEventListener('click', () => {
    const current = Number(document.querySelector('.form-step.active')?.dataset.step || 1);
    if(validateStep(current)) showStep(Number(btn.dataset.next));
  }));
  document.querySelectorAll('.prev-step').forEach(btn => btn.addEventListener('click', () => showStep(Number(btn.dataset.prev))));

  $('orderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setSelectedProduct(selectedProduct, selectedImageIndex);
    const step3Inputs = Array.from(document.querySelectorAll('.form-step[data-step="3"] input[required]'));
    for(const input of step3Inputs){ if(!input.value.trim()){ input.focus(); return; } }

    const selectedImageFile = selectedProduct.images[selectedImageIndex] || selectedProduct.images[0];
    const payload = {
      name: $('customerName')?.value || '',
      phone: $('customerPhone')?.value || '',
      city: $('customerCity')?.value || '',
      address: $('customerAddress')?.value || '',
      product: productName(selectedProduct),
      price: priceText(selectedProduct),
      oldPrice: oldPriceText(selectedProduct),
      image: $('selectedProductImage')?.value || imageUrl(selectedImageFile),
      imageAsset: asset(selectedImageFile)
    };
    const encodedPayload = JSON.stringify(payload);
    sessionStorage.setItem('soumi_last_order', encodedPayload);
    localStorage.setItem('soumi_last_order_backup', encodedPayload);
    try{ history.replaceState({soumiLastOrder: payload}, document.title, window.location.href); }catch(err){}

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if(submitBtn){
      submitBtn.textContent = 'جاري الإرسال... / Envoi...';
      submitBtn.disabled = true;
    }

    try{
      const response = await fetch(form.action, { method:'POST', body:formData, headers:{ 'Accept':'application/json' } });
      if(response.ok){
        window.location.href = 'thankyou.html';
      }else{
        alert("وقع مشكل فإرسال الطلب، المرجو المحاولة. / Erreur lors de l'envoi.");
        if(submitBtn){ submitBtn.textContent = originalText; submitBtn.disabled = false; }
      }
    }catch(err){
      window.location.href = 'thankyou.html';
    }
  });
}

function initMenu(){
  $('menuToggle')?.addEventListener('click', () => {
    const menu = $('mainNav');
    const btn = $('menuToggle');
    const open = !menu.classList.contains('show');
    menu.classList.toggle('show', open);
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#mainNav a').forEach(a => a.addEventListener('click', () => {
    $('mainNav')?.classList.remove('show');
    $('menuToggle')?.classList.remove('active');
    $('menuToggle')?.setAttribute('aria-expanded','false');
  }));
}

function initWhatsApp(){
  $('waToggle')?.addEventListener('click', () => $('waChat')?.classList.toggle('show'));
  $('waClose')?.addEventListener('click', () => $('waChat')?.classList.remove('show'));
  document.querySelectorAll('[data-wa]').forEach(btn => btn.addEventListener('click', () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(btn.dataset.wa)}`, '_blank', 'noopener');
  }));
}

function initDesktopGalleryArrows(){
  const carousel = $('productCarousel');
  const prev = $('galleryPrev');
  const next = $('galleryNext');
  if(!carousel || !prev || !next) return;
  const scroll = (visualDirection) => {
    const amount = Math.round(carousel.clientWidth * 0.82);
    const isRTL = document.documentElement.dir === 'rtl';
    carousel.scrollBy({ left: visualDirection * amount * (isRTL ? -1 : 1), behavior:'smooth' });
  };
  prev.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));
}

function initCursorGlow(){
  const glow = document.querySelector('.cursor-glow');
  if(!glow || matchMedia('(pointer: coarse)').matches) return;
  window.addEventListener('pointermove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, {passive:true});
}

function prepareTypeTargets(reset=false, scope=document){
  scope.querySelectorAll('.type-target').forEach(el => {
    if(reset || !el.dataset.fullText){
      el.dataset.fullText = el.textContent.trim();
      el.dataset.typed = '';
      el.dataset.typeRun = String((Number(el.dataset.typeRun || 0) + 1));
      el.textContent = '';
      el.classList.add('typing-ready');
      el.classList.remove('typing-active','typed');
      el.dataset.observed = '';
    }
  });
  observeReveal();
}

function typeText(el){
  if(!el || el.dataset.typed === 'done') return;
  const text = el.dataset.fullText || el.textContent.trim();
  if(!text) return;
  const run = String((Number(el.dataset.typeRun || 0) + 1));
  el.dataset.typeRun = run;
  el.dataset.typed = 'running';
  el.textContent = '';
  el.classList.add('typing-active');
  el.classList.remove('typing-ready');
  let i = 0;
  const step = () => {
    if(el.dataset.typeRun !== run) return;
    el.textContent = text.slice(0, i);
    i += 1;
    if(i <= text.length){
      setTimeout(step, Math.min(28, Math.max(8, 900 / Math.max(text.length, 1))));
    }else{
      el.dataset.typed = 'done';
      el.classList.add('typed');
    }
  };
  step();
}

function typeHeroTargets(){
  document.querySelectorAll('#home .type-target').forEach(el => {
    if(!el.dataset.fullText) el.dataset.fullText = el.textContent.trim();
    typeText(el);
  });
}

function observeReveal(){
  if(!revealObserver){
    revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          if(entry.target.classList.contains('type-target')) typeText(entry.target);
          entry.target.querySelectorAll?.('.type-target').forEach(typeText);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.14, rootMargin:'0px 0px -60px 0px'});
  }
  document.querySelectorAll('.reveal, .type-target').forEach(el => {
    if(el.dataset.observed !== '1'){
      el.dataset.observed = '1';
      revealObserver.observe(el);
    }
  });
}

async function init(){
  try{
    await loadProducts();
  }catch(err){
    console.error(err);
    products = [];
  }
  selectedProduct = products[0] || null;
  modalProduct = products[0] || null;
  applyTranslations();
  setSelectedProduct(products[0], 0);
  observeReveal();
  initMenu();
  initOrderForm();
  initWhatsApp();
  initDesktopGalleryArrows();
  initCursorGlow();
  $('langSwitch')?.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'fr' : 'ar';
    applyTranslations();
    typeHeroTargets();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      closeModal('productModal');
      closeModal('orderModal');
      $('waChat')?.classList.remove('show');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);


/* ==========================================================================
   Soumi Crochet final Supabase reviews and page-view patch
   UI-preserving append-only logic
   ========================================================================== */
(function(){
  'use strict';

  const SUPABASE_URL = 'https://axgcycsojorwztwlfprg.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_1YuKU9O3wuH1Zbikx_OonQ_ayCIjmSR';
  const pageStartedAt = Date.now();

  function getClient(){
    if(window.soumiSupabase) return window.soumiSupabase;
    if(window.supabase && typeof window.supabase.createClient === 'function'){
      window.soumiSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return window.soumiSupabase;
    }
    return null;
  }

  function byId(id){ return document.getElementById(id); }

  function safeText(value){
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function getVisitorId(){
    let visitorId = localStorage.getItem('soumi_visitor_id');
    if(!visitorId){
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('soumi_visitor_id', visitorId);
    }
    return visitorId;
  }

  function getSessionId(){
    let sessionId = sessionStorage.getItem('soumi_session_id');
    if(!sessionId){
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem('soumi_session_id', sessionId);
    }
    return sessionId;
  }

  async function getPublicIP(){
    try{
      const response = await fetch('https://api.ipify.org?format=json', {cache:'no-store'});
      if(!response.ok) return null;
      const data = await response.json();
      return data && data.ip ? data.ip : null;
    }catch(err){
      return null;
    }
  }

  async function getApproxCity(){
    try{
      const response = await fetch('https://ipapi.co/json/', {cache:'no-store'});
      if(!response.ok) return null;
      const data = await response.json();
      return data && data.city ? data.city : null;
    }catch(err){
      return null;
    }
  }

  function normalizeHistory(value){
    if(Array.isArray(value)) return value;
    if(typeof value === 'string'){
      try{
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      }catch(err){
        return [];
      }
    }
    return [];
  }

  async function loadPublishedReviews(){
    const client = getClient();
    const container = byId('supabaseReviews');
    if(!client || !container) return;

    container.innerHTML = '';

    try{
      const { data, error } = await client
        .from('reviews')
        .select('reviewer_name, city, rating, review_text, is_published, status, created_at')
        .or('is_published.eq.true,status.eq.approved')
        .order('created_at', { ascending:false })
        .limit(12);

      if(error || !Array.isArray(data) || !data.length){
        container.innerHTML = '';
        return;
      }

      const fragment = document.createDocumentFragment();
      data.forEach((review) => {
        const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
        const card = document.createElement('article');
        card.className = 'review-card glass reveal';
        card.innerHTML = '<div class="stars">' + '★'.repeat(rating) + '☆'.repeat(5 - rating) + '</div>' +
          '<h3>' + safeText(review.reviewer_name || 'Cliente') + ' - ' + safeText(review.city || 'Maroc') + '</h3>' +
          '<p>' + safeText(review.review_text || '') + '</p>';
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
      if(typeof observeReveal === 'function') observeReveal();
    }catch(err){
      container.innerHTML = '';
    }
  }

  function openReviewModal(){
    const modal = byId('reviewModal');
    if(!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.classList.add('no-scroll');
  }

  function closeReviewModal(){
    const modal = byId('reviewModal');
    if(!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.classList.remove('no-scroll');
  }

  function initReviewModal(){
    const openBtn = byId('openReviewModalBtn');
    const form = byId('reviewForm');
    openBtn && openBtn.addEventListener('click', openReviewModal);

    document.querySelectorAll('[data-close-review-modal]').forEach((btn) => {
      btn.addEventListener('click', closeReviewModal);
    });

    document.addEventListener('keydown', (event) => {
      if(event.key === 'Escape' && byId('reviewModal') && byId('reviewModal').classList.contains('show')){
        closeReviewModal();
      }
    });

    if(!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const client = getClient();
      const status = byId('reviewStatus');
      const submitBtn = form.querySelector('button[type="submit"]');
      const original = submitBtn ? submitBtn.textContent : '';

      if(!client){
        if(status) status.textContent = 'Connexion indisponible. Réessayez dans un instant.';
        return;
      }

      const payload = {
        reviewer_name: (byId('reviewerName') && byId('reviewerName').value.trim()) || '',
        phone: (byId('reviewPhone') && byId('reviewPhone').value.trim()) || '',
        city: (byId('reviewCity') && byId('reviewCity').value.trim()) || '',
        rating: Number((byId('reviewRating') && byId('reviewRating').value) || 5),
        review_text: (byId('reviewText') && byId('reviewText').value.trim()) || '',
        is_published: false,
        status: 'pending'
      };

      if(!payload.reviewer_name || !payload.city || !payload.review_text){
        if(status) status.textContent = 'Merci de remplir tous les champs obligatoires.';
        return;
      }

      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
      }
      if(status) status.textContent = '';

      try{
        const { error } = await client.from('reviews').insert(payload);
        if(error) throw error;
        form.reset();
        if(status) status.textContent = 'Merci! Votre avis sera publié après validation.';
        setTimeout(() => {
          closeReviewModal();
          if(status) status.textContent = '';
        }, 2000);
      }catch(err){
        if(status) status.textContent = 'Erreur lors de l’envoi. Réessayez.';
      }finally{
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        }
      }
    });
  }

  async function trackPageView(finalUpdate){
    const client = getClient();
    if(!client) return;

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const seconds = Math.max(0, Math.round((Date.now() - pageStartedAt) / 1000));

    try{
      const { data: existing } = await client
        .from('analytics')
        .select('activity_history, time_spent_seconds, ip_address, city, onesignal_user_id')
        .eq('visitor_id', visitorId)
        .maybeSingle();

      const history = normalizeHistory(existing && existing.activity_history);
      history.push({
        type: 'page_view',
        page_url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        time_spent_seconds: seconds,
        final_update: Boolean(finalUpdate),
        timestamp: new Date().toISOString()
      });

      const ip = existing && existing.ip_address ? existing.ip_address : await getPublicIP();
      const city = existing && existing.city ? existing.city : await getApproxCity();

      await client.from('analytics').upsert({
        visitor_id: visitorId,
        session_id: sessionId,
        ip_address: ip,
        city: city,
        page_url: window.location.href,
        activity_history: history.slice(-80),
        time_spent_seconds: Math.max(Number(existing && existing.time_spent_seconds) || 0, seconds),
        last_seen: new Date().toISOString()
      }, { onConflict: 'visitor_id' });
    }catch(err){
      // keep UX silent if analytics fails
    }
  }

  function initSoumiFinalPatch(){
    getClient();
    loadPublishedReviews();
    initReviewModal();
    trackPageView(false);
    window.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'hidden') trackPageView(true);
    });
    window.addEventListener('pagehide', () => trackPageView(true));
  }

  window.loadPublishedReviews = loadPublishedReviews;
  window.trackPageView = trackPageView;
  window.openReviewModal = openReviewModal;
  window.closeReviewModal = closeReviewModal;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initSoumiFinalPatch);
  }else{
    initSoumiFinalPatch();
  }
})();
