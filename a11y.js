// Accessibility module: persists font size + contrast and binds UI controls on any screen
(function(){
  const KEY_FS = 'lr_fontSize';
  const KEY_HC = 'lr_contrast';

  function applyFromStorage(){
    const fs = localStorage.getItem(KEY_FS) || 'fs-normal';
    const hc = localStorage.getItem(KEY_HC) === '1';
    document.body.classList.remove('fs-small','fs-normal','fs-large','fs-xl');
    document.body.classList.add(fs);
    document.body.classList.toggle('contrast-high', hc);
    return { fs, hc };
  }

  function save(fs, hc){
    if (fs) localStorage.setItem(KEY_FS, fs);
    if (typeof hc === 'boolean') localStorage.setItem(KEY_HC, hc ? '1' : '0');
  }

  function bindControls(root){
    const fontCtl = root.querySelector('.a11y-font');
    const contrastCtl = root.querySelector('.a11y-contrast');
    if (!fontCtl && !contrastCtl) return;

    // Init to current state
    const { fs, hc } = applyFromStorage();
    if (fontCtl) fontCtl.value = fs;
    if (contrastCtl) contrastCtl.checked = hc;

    if (fontCtl) fontCtl.addEventListener('change', () => {
      document.body.classList.remove('fs-small','fs-normal','fs-large','fs-xl');
      document.body.classList.add(fontCtl.value);
      save(fontCtl.value, undefined);
    });

    if (contrastCtl) contrastCtl.addEventListener('change', () => {
      document.body.classList.toggle('contrast-high', contrastCtl.checked);
      save(undefined, contrastCtl.checked);
    });
  }

  // Expose simple API
  window.A11y = { applyFromStorage, bindControls };
})();
