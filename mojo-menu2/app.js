let currentStep = 1;
let selectedCategory = null;
let selectedSubCategory = null;

const contentList = document.getElementById("contentList");
const backBtn = document.getElementById("backBtn");
const viewTitle = document.getElementById("viewTitle");
const viewSubtitle = document.getElementById("viewSubtitle");
const subCategoryScroll = document.getElementById("subCategoryScroll");
const animContainer = document.getElementById("animContainer");

// Kategori Renkleri (Blob butonlar için)
const categoryColors = {
  "yiyecekler": "bg-gradient-to-br from-[#ff9a9e] to-[#fecfef] text-[#d63031]",
  "icecekler": "bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] text-[#0984e3]",
  "kutuphane": "bg-gradient-to-br from-[#d4fc79] to-[#96e6a1] text-[#00b894]"
};

// Animasyonlu Geçiş Fonksiyonu
function transitionTo(renderFunction) {
  animContainer.classList.remove("page-enter");
  animContainer.classList.add("page-exit");
  
  setTimeout(() => {
    renderFunction(); // İçeriği değiştir
    animContainer.classList.remove("page-exit");
    void animContainer.offsetWidth; // Reflow tetikle (animasyonu yeniden başlatmak için)
    animContainer.classList.add("page-enter");
  }, 300); // 300ms çıkış animasyon süresi
}

// İlk Açılış
renderStep1();

// 1. AŞAMA: Ana Kategoriler
function renderStep1() {
  currentStep = 1;
  backBtn.classList.add("hidden");
  subCategoryScroll.classList.add("hidden");
  viewTitle.innerText = "Sihirli Menümüz";
  viewSubtitle.innerText = "Neyi keşfetmek istersin?";

  contentList.innerHTML = menuData.categories.map((cat) => `
    <button onclick="transitionTo(() => selectCategory('${cat.id}'))" 
      class="blob-shape flex flex-col items-center justify-center p-8 sm:p-12 ${categoryColors[cat.id] || 'bg-white'} border-4 border-white shadow-lg relative overflow-hidden group">
      <!-- Arka plan süsü -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      
      <span class="text-6xl sm:text-7xl mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-300">${cat.icon}</span>
      <h3 class="text-2xl sm:text-3xl font-black drop-shadow-sm">${cat.title}</h3>
      <p class="text-sm font-bold opacity-75 mt-2 bg-white/30 px-4 py-1 rounded-full">${menuData.subCategories[cat.id].length} Bölüm</p>
    </button>
  `).join("");
}

// 2. AŞAMA: Alt Kategoriler
function selectCategory(catId) {
  currentStep = 2;
  selectedCategory = catId;
  backBtn.classList.remove("hidden");
  subCategoryScroll.classList.add("hidden");

  const categoryObj = menuData.categories.find(c => c.id === catId);
  viewTitle.innerText = categoryObj.title + " Dünyası";
  viewSubtitle.innerText = "Hangisini seçelim?";

  const subCats = menuData.subCategories[catId];
  contentList.innerHTML = subCats.map((sub, index) => {
    const itemCount = menuData.items.filter(i => i.category === catId && i.subCategory === sub.id).length;
    return `
      <button onclick="transitionTo(() => selectSubCategory('${sub.id}'))" 
        class="fun-card flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute left-0 top-0 w-2 h-full bg-[#5f27cd] group-hover:w-full transition-all duration-300 opacity-10"></div>
        <div class="text-left relative z-10">
          <h4 class="font-black text-stone-800 text-lg sm:text-xl group-hover:text-[#5f27cd] transition-colors">${sub.title}</h4>
          <span class="text-xs sm:text-sm text-stone-500 font-bold mt-1 block px-2 py-0.5 bg-stone-200 rounded-full inline-block">🎁 ${itemCount} Çeşit</span>
        </div>
        <span class="text-[#5f27cd] font-black text-3xl relative z-10 group-hover:translate-x-2 transition-transform">→</span>
      </button>
    `;
  }).join("");
}

// 3. AŞAMA: İçerik Listeleme
function selectSubCategory(subId) {
  currentStep = 3;
  selectedSubCategory = subId;
  backBtn.classList.remove("hidden");
  subCategoryScroll.classList.remove("hidden");

  renderHorizontalTabs();
  renderItems();
}

function renderHorizontalTabs() {
  const subCats = menuData.subCategories[selectedCategory];
  subCategoryScroll.innerHTML = subCats.map(sub => {
    const isActive = sub.id === selectedSubCategory;
    return `
      <button onclick="transitionTo(() => changeSubCategoryTab('${sub.id}'))" 
        class="px-6 py-3 rounded-full text-sm sm:text-base font-black transition-all active:scale-90 duration-200 border-2 ${
          isActive 
            ? 'bg-[#5f27cd] text-white border-[#5f27cd] shadow-lg shadow-purple-500/30 -translate-y-1' 
            : 'bg-white/80 text-stone-600 border-transparent hover:bg-white hover:-translate-y-1'
        }">
        ${sub.title}
      </button>
    `;
  }).join("");
}

function changeSubCategoryTab(subId) {
  selectedSubCategory = subId;
  renderHorizontalTabs();
  renderItems();
}

function renderItems() {
  const items = menuData.items.filter(i => i.category === selectedCategory && i.subCategory === selectedSubCategory);
  
  if (items.length === 0) {
    contentList.innerHTML = `<div class="col-span-full text-center text-stone-500 font-bold text-lg py-16 bg-white/50 rounded-3xl">Burada henüz bir sürpriz yok 🎈</div>`;
    return;
  }

  contentList.innerHTML = items.map((item) => `
    <div class="fun-card flex flex-col bg-white overflow-hidden group">
      <div class="relative h-48 sm:h-56 overflow-hidden">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <!-- Fiyat Etiketi (Eğlenceli balon stili) -->
        <div class="absolute top-3 right-3 bg-[#ff6b6b] text-white font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-white rotate-3 group-hover:rotate-0 transition-transform">
          ${item.price}
        </div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 class="font-black text-stone-900 text-lg sm:text-xl leading-snug">${item.title}</h4>
          <p class="text-sm text-stone-500 mt-2 font-semibold leading-relaxed">${item.desc}</p>
        </div>
      </div>
    </div>
  `).join("");
}

// Geri Butonu
function goBack() {
  if (currentStep === 3) {
    transitionTo(() => selectCategory(selectedCategory));
  } else if (currentStep === 2) {
    transitionTo(renderStep1);
  }
}