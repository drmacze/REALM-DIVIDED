(() => {
  if (document.querySelector('.rd-other-projects')) return;

  const style = document.createElement('style');
  style.id = 'rd-other-projects-style';
  style.textContent = `
    .rd-other-projects{
      position:relative;
      padding:clamp(54px,7vw,88px) clamp(20px,5vw,64px);
      border-top:1px solid rgba(196,150,82,.14);
      background:#050403;
      overflow:hidden;
    }
    .rd-other-projects:before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:radial-gradient(circle at 80% 12%,rgba(116,90,46,.08),transparent 34%);
    }
    .rd-other-projects__inner{
      position:relative;
      z-index:1;
      width:min(100%,1080px);
      margin:0 auto;
    }
    .rd-other-projects__head{
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap:24px;
      margin-bottom:clamp(22px,3vw,30px);
    }
    .rd-other-projects__eyebrow{
      margin:0 0 9px;
      color:#b98b4b;
      font:600 .66rem/1 Manrope,sans-serif;
      text-transform:uppercase;
      letter-spacing:.24em;
    }
    .rd-other-projects__heading{
      margin:0;
      color:#f0e9df;
      font-family:"Cormorant Garamond",Georgia,serif;
      font-size:clamp(2.15rem,5vw,3.8rem);
      font-weight:500;
      line-height:.94;
      letter-spacing:-.03em;
    }
    .rd-other-projects__count{
      margin:0 0 4px;
      color:rgba(240,233,223,.36);
      font:500 .62rem/1 Manrope,sans-serif;
      letter-spacing:.18em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .rd-project-card{
      display:grid;
      grid-template-columns:minmax(0,1.55fr) minmax(260px,.7fr);
      min-height:318px;
      color:inherit;
      text-decoration:none;
      border:1px solid rgba(196,150,82,.2);
      background:#080705;
      overflow:hidden;
      box-shadow:0 20px 48px rgba(0,0,0,.24);
      transition:border-color .28s ease,transform .32s cubic-bezier(.2,.7,.2,1),box-shadow .32s ease;
    }
    .rd-project-card:hover{
      transform:translateY(-3px);
      border-color:rgba(196,150,82,.38);
      box-shadow:0 28px 62px rgba(0,0,0,.3);
    }
    .rd-project-card__media{
      position:relative;
      min-height:318px;
      background:#000;
      overflow:hidden;
    }
    .rd-project-card__media:after{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:linear-gradient(90deg,transparent 68%,rgba(8,7,5,.38) 100%),linear-gradient(0deg,rgba(0,0,0,.12),transparent 34%);
    }
    .rd-project-card__media img{
      width:100%;
      height:100%;
      display:block;
      object-fit:contain;
      object-position:center;
      image-rendering:auto;
      background:#000;
      transform:scale(1.001);
      filter:saturate(.98) contrast(1.02);
      transition:transform .7s cubic-bezier(.2,.75,.2,1),filter .7s ease;
    }
    .rd-project-card:hover .rd-project-card__media img{
      transform:scale(1.018);
      filter:saturate(1.02) contrast(1.04);
    }
    .rd-project-card__tag{
      position:absolute;
      z-index:2;
      left:18px;
      bottom:17px;
      padding:8px 11px;
      border:1px solid rgba(255,255,255,.13);
      background:rgba(5,7,6,.72);
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      color:rgba(245,246,242,.8);
      font:600 .58rem/1 Manrope,sans-serif;
      letter-spacing:.18em;
      text-transform:uppercase;
    }
    .rd-project-card__body{
      position:relative;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      gap:32px;
      padding:clamp(25px,3.4vw,38px);
      background:linear-gradient(155deg,rgba(14,14,12,.98),rgba(7,7,6,.99));
    }
    .rd-project-card__index{
      margin:0 0 14px;
      color:rgba(242,234,223,.38);
      font:500 .6rem/1 Manrope,sans-serif;
      letter-spacing:.2em;
      text-transform:uppercase;
    }
    .rd-project-card__title{
      margin:0;
      color:#f1eee8;
      font:600 clamp(1.95rem,3.4vw,3rem)/.96 Manrope,sans-serif;
      letter-spacing:-.045em;
      white-space:nowrap;
    }
    .rd-project-card__meta{
      max-width:240px;
      margin:13px 0 0;
      color:#858a83;
      font:500 .65rem/1.55 Manrope,sans-serif;
      letter-spacing:.1em;
      text-transform:uppercase;
    }
    .rd-project-card__visit{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding-top:18px;
      border-top:1px solid rgba(255,255,255,.08);
      color:#d9ddd5;
      font:600 .66rem/1 Manrope,sans-serif;
      text-transform:uppercase;
      letter-spacing:.17em;
    }
    .rd-project-card__icon{
      width:29px;
      height:29px;
      flex:0 0 29px;
      display:grid;
      place-items:center;
      border:1px solid rgba(142,230,76,.32);
      border-radius:50%;
      background:rgba(142,230,76,.045);
      color:#8ee64c;
      transition:transform .25s ease,border-color .25s ease,background .25s ease;
    }
    .rd-project-card__icon svg{
      width:13px;
      height:13px;
      display:block;
      fill:none;
      stroke:currentColor;
      stroke-width:1.8;
      stroke-linecap:round;
      stroke-linejoin:round;
    }
    .rd-project-card:hover .rd-project-card__icon{
      transform:translate(2px,-2px);
      border-color:rgba(142,230,76,.62);
      background:rgba(142,230,76,.09);
    }
    .rd-other-projects.is-visible .rd-project-card{animation:rdProjectIn .72s cubic-bezier(.2,.75,.2,1) both}
    .rd-other-projects.is-visible .rd-other-projects__head{animation:rdProjectText .62s cubic-bezier(.2,.75,.2,1) both}
    @keyframes rdProjectIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
    @keyframes rdProjectText{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @media(max-width:760px){
      .rd-other-projects{padding:50px 20px 56px}
      .rd-other-projects__head{align-items:flex-start;margin-bottom:20px}
      .rd-other-projects__eyebrow{font-size:.6rem;margin-bottom:8px}
      .rd-other-projects__heading{font-size:clamp(2.15rem,10.8vw,3rem)}
      .rd-other-projects__count{display:none}
      .rd-project-card{grid-template-columns:1fr;min-height:0;border-color:rgba(196,150,82,.17);box-shadow:0 16px 36px rgba(0,0,0,.22)}
      .rd-project-card__media{min-height:0;aspect-ratio:1/1}
      .rd-project-card__media:after{background:linear-gradient(0deg,rgba(5,6,5,.18),transparent 38%)}
      .rd-project-card__tag{left:14px;bottom:13px;padding:7px 10px;font-size:.54rem}
      .rd-project-card__body{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:18px;padding:20px 18px 19px}
      .rd-project-card__index{margin-bottom:10px;font-size:.56rem}
      .rd-project-card__title{font-size:clamp(1.82rem,8vw,2.35rem);letter-spacing:-.05em}
      .rd-project-card__meta{margin-top:9px;font-size:.58rem;line-height:1.45;letter-spacing:.09em}
      .rd-project-card__visit{align-self:end;justify-content:flex-end;gap:9px;padding:0;border:0;white-space:nowrap;font-size:.58rem;letter-spacing:.13em}
      .rd-project-card__icon{width:27px;height:27px;flex-basis:27px}
      .rd-project-card__icon svg{width:12px;height:12px}
    }
    @media(max-width:390px){
      .rd-project-card__body{grid-template-columns:1fr;gap:17px}
      .rd-project-card__visit{justify-content:space-between;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)}
    }
    @media(prefers-reduced-motion:reduce){.rd-other-projects *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'rd-other-projects';
  section.setAttribute('aria-labelledby','rd-other-projects-title');
  section.innerHTML = `
    <div class="rd-other-projects__inner">
      <div class="rd-other-projects__head">
        <div>
          <p class="rd-other-projects__eyebrow">Other Project</p>
          <h2 class="rd-other-projects__heading" id="rd-other-projects-title">Beyond the Realm.</h2>
        </div>
        <p class="rd-other-projects__count">02 / Zombie Apocalypse</p>
      </div>

      <a class="rd-project-card" href="https://drmacze.github.io/DIRECTIVE-I/" target="_blank" rel="noreferrer" aria-label="Visit DIRECTIVE I project">
        <div class="rd-project-card__media">
          <img
            src="assets/directive-i-other-project.webp?v=2"
            alt="DIRECTIVE I — Minecraft Zombie Apocalypse Modpack"
            width="900"
            height="900"
            loading="lazy"
            decoding="async"
          >
          <span class="rd-project-card__tag">Season I</span>
        </div>
        <div class="rd-project-card__body">
          <div>
            <p class="rd-project-card__index">Project 02</p>
            <h3 class="rd-project-card__title">DIRECTIVE I</h3>
            <p class="rd-project-card__meta">Minecraft Zombie Apocalypse Modpack</p>
          </div>
          <span class="rd-project-card__visit">
            <span>View Project</span>
            <span class="rd-project-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg>
            </span>
          </span>
        </div>
      </a>
    </div>
  `;

  const footer = document.querySelector('.footer');
  if (footer) footer.before(section);
  else document.body.appendChild(section);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          io.disconnect();
        }
      });
    }, { threshold: .14 });
    io.observe(section);
  } else {
    section.classList.add('is-visible');
  }
})();
