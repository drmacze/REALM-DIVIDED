(() => {
  const STORAGE = {
    consent: 'rd_cookie_consent_v1',
    complete: 'rd_onboarding_complete_v1',
    interest: 'rd_project_interest_v1',
    source: 'rd_discovery_source_v1',
    music: 'rd_music_enabled_v1'
  };
  const CREST = 'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg';
  const AUDIO_SOURCES = [
    'assets/blendertimer-medieval-kingdoms-598387.mp3',
    'assets/realm-divided-song.mp3'
  ];

  const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const hasCookie = name => document.cookie.split(';').some(v => v.trim().startsWith(`${name}=`));
  const setCookie = (name, value, days = 365) => {
    const maxAge = Math.round(days * 86400);
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
  };

  let audio = null;
  let islandTimer = 0;
  let sourceIndex = 0;
  let audioStarted = false;

  function ensureAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'rd-soundtrack';
    audio.preload = 'auto';
    audio.loop = true;
    audio.playsInline = true;
    audio.volume = 0;
    audio.src = AUDIO_SOURCES[0];
    document.body.appendChild(audio);
    return audio;
  }

  function ensureIsland() {
    let island = document.querySelector('.rd-music-island');
    if (island) return island;
    island = document.createElement('div');
    island.className = 'rd-music-island';
    island.setAttribute('role', 'status');
    island.setAttribute('aria-live', 'polite');
    island.innerHTML = `
      <div class="rd-music-mark" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="rd-music-copy"><small>Now playing</small><strong>Realm Divided - Song</strong></div>`;
    document.body.appendChild(island);
    return island;
  }

  function showIsland() {
    const island = ensureIsland();
    clearTimeout(islandTimer);
    requestAnimationFrame(() => island.classList.add('is-open'));
    islandTimer = window.setTimeout(() => island.classList.remove('is-open'), 5200);
  }

  function fadeAudioIn(player) {
    const target = 0.42;
    const start = performance.now();
    const duration = 1600;
    const step = now => {
      const p = Math.min(1, (now - start) / duration);
      player.volume = target * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function startAudio(showUI = true) {
    const player = ensureAudio();
    if (audioStarted && !player.paused) {
      if (showUI) showIsland();
      return true;
    }
    for (let i = sourceIndex; i < AUDIO_SOURCES.length; i++) {
      sourceIndex = i;
      if (!player.src.endsWith(AUDIO_SOURCES[i])) player.src = AUDIO_SOURCES[i];
      try {
        await player.play();
        audioStarted = true;
        safeSet(STORAGE.music, '1');
        fadeAudioIn(player);
        if (showUI) showIsland();
        return true;
      } catch (_) {
        player.pause();
      }
    }
    return false;
  }

  function armReturningMusic() {
    if (safeGet(STORAGE.music) !== '1') return;
    const resume = async () => {
      const ok = await startAudio(true);
      if (ok) {
        window.removeEventListener('pointerdown', resume, true);
        window.removeEventListener('touchstart', resume, true);
        window.removeEventListener('keydown', resume, true);
      }
    };
    window.addEventListener('pointerdown', resume, true);
    window.addEventListener('touchstart', resume, true);
    window.addEventListener('keydown', resume, true);
  }

  function lockPage() {
    document.body.classList.add('rd-onboarding-active');
    try { window.realmLenis?.stop(); } catch (_) {}
  }
  function unlockPage() {
    document.body.classList.remove('rd-onboarding-active');
    try { window.realmLenis?.start(); } catch (_) {}
    try { window.ScrollTrigger?.refresh(); } catch (_) {}
  }

  function buildEntry() {
    const root = document.createElement('div');
    root.className = 'rd-entry';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Realm Divided welcome');
    root.innerHTML = `
      <div class="rd-entry-orbit" aria-hidden="true"></div>
      <div class="rd-entry-stage">
        <section class="rd-entry-panel rd-cookie-panel" data-stage="cookie">
          <p class="rd-entry-kicker">Realm Divided · Privacy</p>
          <h2 class="rd-entry-title">Cookies of the Realm.</h2>
          <p class="rd-entry-copy">Website ini menggunakan cookie esensial untuk mengingat pilihan kamu dan menjaga pengalaman Realm Divided tetap konsisten. Tidak ada data jawaban onboarding yang dikirim ke server dari halaman ini.</p>
          <p class="rd-cookie-note">Kamu dapat memilih cookie esensial saja atau menerima penyimpanan preferensi pengalaman.</p>
          <div class="rd-entry-actions">
            <button class="rd-entry-btn is-primary" data-consent="all">Terima semua</button>
            <button class="rd-entry-btn" data-consent="essential">Hanya esensial</button>
          </div>
        </section>

        <section class="rd-entry-panel" data-stage="welcome">
          <img class="rd-entry-crest" src="${CREST}" alt="Realm Divided crest">
          <p class="rd-entry-kicker">The gates remember your arrival</p>
          <h2 class="rd-entry-title">Welcome to<br>Realm Divided.</h2>
          <div class="rd-entry-rule" aria-hidden="true"></div>
          <p class="rd-entry-copy">Satu kekaisaran telah runtuh. Lima panji menunggu siapa yang akan berdiri di bawahnya.</p>
        </section>

        <section class="rd-entry-panel" data-stage="interest">
          <p class="rd-entry-kicker">Before you enter</p>
          <h2 class="rd-entry-title">Apakah kamu tertarik dengan project ini?</h2>
          <p class="rd-entry-copy">Pilihan ini hanya membantu membentuk sambutan kamu. Kamu tetap bebas menjelajahi seluruh website.</p>
          <div class="rd-entry-actions">
            <button class="rd-entry-btn is-primary" data-interest="yes">Ya, saya tertarik</button>
            <button class="rd-entry-btn" data-interest="explore">Hanya ingin eksplor</button>
          </div>
        </section>

        <section class="rd-entry-panel" data-stage="typing">
          <p class="rd-entry-kicker">A message from development</p>
          <h2 class="rd-entry-title">The realm is still being built.</h2>
          <div class="rd-typing-shell" aria-live="polite">
            <p class="rd-typing-text"><span data-typing></span><i class="rd-typing-cursor" aria-hidden="true"></i></p>
          </div>
        </section>

        <section class="rd-entry-panel" data-stage="source">
          <p class="rd-entry-kicker">One final question</p>
          <h2 class="rd-entry-title">Dari mana kamu mengetahui project ini?</h2>
          <p class="rd-entry-copy">Pilih satu. Setelah itu gerbang akan terbuka.</p>
          <div class="rd-source-grid">
            <button class="rd-entry-btn rd-source-btn" data-source="TikTok">TikTok<small>Short video</small></button>
            <button class="rd-entry-btn rd-source-btn" data-source="YouTube">YouTube<small>Video</small></button>
            <button class="rd-entry-btn rd-source-btn" data-source="Media Social">Media Social<small>Social feed</small></button>
            <button class="rd-entry-btn rd-source-btn" data-source="Discord">Discord<small>Community</small></button>
            <button class="rd-entry-btn rd-source-btn" data-source="Teman">Teman<small>Friend</small></button>
            <button class="rd-entry-btn rd-source-btn" data-source="Other">Other<small>Elsewhere</small></button>
          </div>
        </section>

        <div class="rd-entry-progress" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
      <div class="rd-entry-exit" aria-hidden="true"></div>`;
    document.body.appendChild(root);
    return root;
  }

  function controller(root) {
    const panels = [...root.querySelectorAll('[data-stage]')];
    const dots = [...root.querySelectorAll('.rd-entry-progress i')];
    let current = null;
    let transitionTimer = 0;

    const stageProgress = { welcome: 0, interest: 1, typing: 1, source: 2 };

    function stage(name, delay = 0) {
      clearTimeout(transitionTimer);
      const next = root.querySelector(`[data-stage="${name}"]`);
      if (!next) return;
      const swap = () => {
        panels.forEach(panel => {
          panel.classList.remove('is-active', 'is-leaving');
        });
        next.classList.add('is-active');
        current = next;
        const idx = stageProgress[name];
        dots.forEach((dot, i) => dot.classList.toggle('is-active', Number.isInteger(idx) && i === idx));
      };
      if (current?.classList.contains('is-active')) {
        current.classList.add('is-leaving');
        transitionTimer = window.setTimeout(swap, Math.max(420, delay));
      } else if (delay) {
        transitionTimer = window.setTimeout(swap, delay);
      } else swap();
    }

    function typeMessage() {
      const holder = root.querySelector('[data-typing]');
      if (!holder) return;
      const text = 'Mod ini sedang dalam pengerjaan oleh tim development, kamu bisa pre order untuk memberi tanda bahwa kamu mendukung pengerjaan ini.';
      holder.textContent = '';
      let i = 0;
      const tick = () => {
        if (i >= text.length) {
          window.setTimeout(() => stage('source'), 1500);
          return;
        }
        const step = text[i] === ' ' ? 2 : 1;
        holder.textContent += text.slice(i, i + step);
        i += step;
        const last = text[Math.max(0, i - 1)];
        const pause = /[,.]/.test(last) ? 115 : 24 + Math.random() * 30;
        window.setTimeout(tick, pause);
      };
      window.setTimeout(tick, 380);
    }

    async function finish(source) {
      safeSet(STORAGE.source, source);
      safeSet(STORAGE.complete, '1');
      safeSet(STORAGE.music, '1');
      setCookie('rd_discovery_source', source, 365);
      startAudio(true);
      root.classList.add('is-exiting');
      window.setTimeout(() => {
        root.classList.remove('is-visible');
        unlockPage();
      }, 560);
      window.setTimeout(() => root.remove(), 1200);
    }

    root.querySelectorAll('[data-consent]').forEach(btn => btn.addEventListener('click', () => {
      const value = btn.dataset.consent;
      safeSet(STORAGE.consent, value);
      setCookie('rd_cookie_consent', value, 365);
      stage('welcome');
      window.setTimeout(() => stage('interest'), 2850);
    }));

    root.querySelectorAll('[data-interest]').forEach(btn => btn.addEventListener('click', () => {
      const value = btn.dataset.interest;
      safeSet(STORAGE.interest, value);
      if (value === 'yes') {
        stage('typing');
        window.setTimeout(typeMessage, 520);
      } else {
        stage('source');
      }
    }));

    root.querySelectorAll('[data-source]').forEach(btn => btn.addEventListener('click', () => finish(btn.dataset.source)));

    const consentKnown = safeGet(STORAGE.consent) || hasCookie('rd_cookie_consent');
    if (consentKnown) {
      stage('welcome', 160);
      window.setTimeout(() => stage('interest'), 3000);
    } else {
      stage('cookie', 100);
    }
  }

  function startFirstVisit() {
    lockPage();
    const root = buildEntry();
    requestAnimationFrame(() => root.classList.add('is-visible'));
    controller(root);
  }

  function boot() {
    if (safeGet(STORAGE.complete) === '1') {
      armReturningMusic();
      return;
    }
    startFirstVisit();
  }

  window.RealmOnboarding = {
    reset() {
      Object.values(STORAGE).forEach(key => { try { localStorage.removeItem(key); } catch (_) {} });
      document.cookie = 'rd_cookie_consent=;path=/;max-age=0;SameSite=Lax';
      document.cookie = 'rd_discovery_source=;path=/;max-age=0;SameSite=Lax';
      location.reload();
    },
    playMusic: () => startAudio(true),
    stopMusic() { if (audio) { audio.pause(); audio.currentTime = 0; audioStarted = false; } }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
