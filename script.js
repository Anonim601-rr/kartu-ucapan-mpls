const WHATSAPP_NUMBER = '60104628715'; // Contoh: '6281234567890'. Kosongkan jika ingin membuka WhatsApp tanpa nomor tujuan.
const MUSIC_URL = 'test-audio.mp3'; // Tautan audio langsung yang aman diputar di browser

function init() {
  const form = document.querySelector('[data-form]');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      const payload = {
        name: formData.get('name')?.toString().trim() || '',
        role: formData.get('role')?.toString().trim() || '',
        message: formData.get('message')?.toString().trim() || ''
      };

      if (!payload.name || !payload.role || !payload.message) {
        showToast(toast, 'Harap lengkapi semua kolom terlebih dahulu.');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Membuka WhatsApp...';

      try {
        const whatsappUrl = buildWhatsappUrl(payload);
        const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!opened) {
          window.location.href = whatsappUrl;
        }
        form.reset();
        showToast(toast, 'Doa restu Anda sedang dibuka di WhatsApp.');
        launchConfetti();
      } catch (error) {
        showToast(toast, 'Maaf, WhatsApp belum bisa dibuka. Coba lagi sebentar.');
        console.error(error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim ke WhatsApp';
      }
    });
  }

  initMusicControls();
}

function initMusicControls() {
  const toggleButton = document.getElementById('music-toggle-btn');
  const audio = document.getElementById('background-audio');

  if (!toggleButton || !audio) {
    return;
  }

  const savedUrl = localStorage.getItem('background-music-url');
  const musicUrl = savedUrl || MUSIC_URL;

  if (musicUrl) {
    audio.src = musicUrl;
    audio.load();
    toggleButton.textContent = 'Play Musik';
  }

  toggleButton.addEventListener('click', async () => {
    if (!audio.src && musicUrl) {
      audio.src = musicUrl;
      audio.load();
    }

    if (!audio.src) {
      toggleButton.textContent = 'Play Musik';
      return;
    }

    try {
      if (audio.paused) {
        audio.currentTime = 0;
        await audio.play();
        toggleButton.textContent = 'Pause Musik';
      } else {
        audio.pause();
        toggleButton.textContent = 'Play Musik';
      }
    } catch (error) {
      console.error('Audio play failed:', error);
      try {
        audio.pause();
        audio.load();
        audio.currentTime = 0;
        await audio.play();
        toggleButton.textContent = 'Pause Musik';
      } catch (retryError) {
        console.error('Audio retry failed:', retryError);
        toggleButton.textContent = 'Play Musik';
      }
    }
  });

  audio.addEventListener('play', () => {
    toggleButton.textContent = 'Pause Musik';
  });

  audio.addEventListener('pause', () => {
    toggleButton.textContent = 'Play Musik';
  });

  audio.addEventListener('ended', () => {
    toggleButton.textContent = 'Play Musik';
  });
}

function buildWhatsappUrl(payload) {
  const message = `Nama: ${payload.name}\nPeran: ${payload.role}\n\nDoa & Dukungan:\n${payload.message}`;
  const encodedMessage = encodeURIComponent(message);

  if (WHATSAPP_NUMBER) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

function showToast(toast, message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  if (!layer) return;

  const colors = ['#54e1ff', '#7c9cff', '#ff8fcf', '#ffe27a', '#9dffb1'];
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = '-10px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animationDelay = `${Math.random() * 0.15}s`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

window.addEventListener('DOMContentLoaded', init);
