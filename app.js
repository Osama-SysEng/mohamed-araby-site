// JavaScript for Mohamed El-Araby's Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
  // 1. Image Data (69 extracted images)
  const allImages = Array.from({ length: 69 }, (_, i) => {
    const id = i + 1;
    const numStr = id < 10 ? `0${id}` : `${id}`;
    let category = 'activities';
    if ([64, 1, 2, 3, 4, 5, 10, 11].includes(id)) category = 'certificates';
    else if ([14, 15, 16, 17, 18, 19, 20].includes(id)) category = 'bebras';
    else if ([6, 7, 8, 9, 12, 13, 21, 22, 23].includes(id)) category = 'lab';

    return {
      id,
      src: `images/img_${numStr}.jpeg`,
      alt: id === 68 ? 'صورة المعلم محمد العربي عبدالسميع إبراهيم' : `شاهد من ملف إنجاز المعلم محمد العربي (${id})`,
      category
    };
  });

  const portraitIndex = allImages.findIndex((image) => image.id === 68);
  if (portraitIndex > 0) allImages.unshift(allImages.splice(portraitIndex, 1)[0]);

  // 2. Hero Slider logic
  initHeroSlider();

  // 3. Main Carousel Logic
  let currentMainIndex = 0;
  let activeFilteredImages = [...allImages];
  let autoPlayInterval = null;
  let isPlaying = true;

  const carouselTrack = document.getElementById('carousel-track');
  const thumbnailsTrack = document.getElementById('thumbnails-track');
  const sliderCountText = document.getElementById('slider-count-text');

  function renderMainCarousel(images) {
    activeFilteredImages = images;
    currentMainIndex = 0;

    // Render Track Items
    carouselTrack.innerHTML = images.map((img, idx) => `
      <div class="carousel-item">
        <img src="${img.src}" alt="${img.alt}" data-index="${idx}" class="carousel-img">
      </div>
    `).join('');

    // Render Thumbnails
    thumbnailsTrack.innerHTML = images.map((img, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <img src="${img.src}" alt="مصغر">
      </div>
    `).join('');

    updateCarouselPosition();
    attachThumbnailEvents();
  }

  function updateCarouselPosition() {
    if (activeFilteredImages.length === 0) return;
    carouselTrack.style.transform = `translateX(${currentMainIndex * 100}%)`;
    sliderCountText.textContent = `${currentMainIndex + 1} / ${activeFilteredImages.length}`;

    // Update Thumbnails
    document.querySelectorAll('.thumb-item').forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === currentMainIndex);
      // Autoplay updates thumbnails only; it must not change the document's vertical position.
    });
  }

  function attachThumbnailEvents() {
    document.querySelectorAll('.thumb-item').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        currentMainIndex = parseInt(e.currentTarget.getAttribute('data-index'));
        updateCarouselPosition();
      });
    });

    document.querySelectorAll('.carousel-img').forEach(img => {
      img.addEventListener('click', (e) => {
        openLightbox(e.target.src, e.target.alt);
      });
    });
  }

  document.getElementById('carousel-prev').addEventListener('click', () => {
    currentMainIndex = (currentMainIndex - 1 + activeFilteredImages.length) % activeFilteredImages.length;
    updateCarouselPosition();
  });

  document.getElementById('carousel-next').addEventListener('click', () => {
    currentMainIndex = (currentMainIndex + 1) % activeFilteredImages.length;
    updateCarouselPosition();
  });

  // Auto play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      if (isPlaying && activeFilteredImages.length > 0) {
        currentMainIndex = (currentMainIndex + 1) % activeFilteredImages.length;
        updateCarouselPosition();
      }
    }, 3500);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  }

  const autoPlayBtn = document.getElementById('auto-play-toggle');
  autoPlayBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    autoPlayBtn.textContent = isPlaying ? '⏸ إيقاف المؤقت' : '▶ تشغيل المؤقت';
  });

  // Filter Logic
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');

      const filtered = filter === 'all'
        ? allImages
        : allImages.filter(img => img.category === filter);

      renderMainCarousel(filtered);
    });
  });

  // 4. Render Grid Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  function renderGalleryGrid() {
    galleryGrid.innerHTML = allImages.map(img => `
      <div class="gallery-card" data-src="${img.src}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
      </div>
    `).join('');

    galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        openLightbox(card.getAttribute('data-src'), 'شاهد مصور');
      });
    });
  }

  document.getElementById('toggle-grid-btn').addEventListener('click', () => {
    if (galleryGrid.style.display === 'none' || galleryGrid.style.display === '') {
      galleryGrid.style.display = 'grid';
    } else {
      galleryGrid.style.display = 'none';
    }
  });

  // 5. Lightbox Modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  }

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    const updateBackToTopVisibility = () => {
      backToTopButton.hidden = window.scrollY < 400;
    };

    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    backToTopButton.addEventListener('click', () => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    });
    updateBackToTopVisibility();
  }

  // 6. Live Edit Mode Toggle (الميزة المطلوبة: إكسس والتعديل)
  const toggleEditBtn = document.getElementById('toggle-edit-btn');
  const editBtnText = document.getElementById('edit-btn-text');
  let isEditMode = false;

  toggleEditBtn.addEventListener('click', () => {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode-active', isEditMode);

    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
      el.contentEditable = isEditMode ? 'true' : 'false';
    });

    if (isEditMode) {
      editBtnText.textContent = 'إنهاء وضع التعديل (تم التفعيل)';
      alert('تم تفعيل وضع التعديل المباشر! يمكنك الآن الضغط على أي نص وتعديله مباشرة.');
    } else {
      editBtnText.textContent = 'تفعيل وضع التعديل المباشر';
      saveEditsLocally();
      alert('تم حفظ التعديلات في متصفحك بنجاح.');
    }
  });

  function saveEditsLocally() {
    const dataToSave = {};
    document.querySelectorAll('[id]').forEach(el => {
      if (el.hasAttribute('contenteditable')) {
        dataToSave[el.id] = el.innerHTML;
      }
    });
    localStorage.setItem('mohamed_site_edits', JSON.stringify(dataToSave));
  }

  function loadSavedEdits() {
    const saved = localStorage.getItem('mohamed_site_edits');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = data[id];
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Initializations
  renderMainCarousel(allImages);
  renderGalleryGrid();
  galleryGrid.style.display = 'none'; // hidden by default
  startAutoPlay();
  loadSavedEdits();
});

// Helper for Hero Slider
function initHeroSlider() {
  const wrapper = document.getElementById('hero-slider-wrapper');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const dotsContainer = document.getElementById('hero-dots');
  const slides = wrapper.querySelectorAll('.slide');

  let current = 0;

  // Dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    wrapper.style.transform = `translateX(${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  setInterval(() => {
    goTo(current + 1);
  }, 4000);
}
