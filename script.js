const imagenetClasses = window.paperSamples.imagenet;
let classIndex = 0;
function renderImageNetClass() {
  const current = imagenetClasses[classIndex];
  document.querySelector('#class-name').textContent = current.caption;
  document.querySelector('#class-count').textContent = `${classIndex + 1} / ${imagenetClasses.length}`;
  const collage = document.querySelector('#class-collage');
  collage.replaceChildren();
  for (const row of current.rows) {
    const figure = document.createElement('figure');
    figure.className = 'encoder-row';
    const caption = document.createElement('figcaption');
    caption.textContent = row.baseline ? row.model : `Ours · ${row.model}`;
    const viewport = document.createElement('div');
    viewport.className = 'encoder-samples';
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', `${current.caption}, ${row.model}, eight samples`);
    const image = document.createElement('img');
    image.src = row.src;
    image.alt = `Eight generated ${current.caption.toLowerCase()} images from ${row.baseline ? row.model : `FeaTok-L-${row.model}`}`;
    image.width = 2048;
    image.height = 256;
    viewport.append(image);
    figure.append(caption, viewport);
    collage.append(figure);
  }
}
function changeImageNetClass(direction) {
  classIndex = (classIndex + direction + imagenetClasses.length) % imagenetClasses.length;
  renderImageNetClass();
}
document.querySelector('#previous-class').addEventListener('click', () => changeImageNetClass(-1));
document.querySelector('#next-class').addEventListener('click', () => changeImageNetClass(1));
renderImageNetClass();

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const group = document.createElement('div');
  group.className = 'sample-group';
  for (const sample of window.paperSamples[gallery.dataset.gallery]) {
    const figure = document.createElement('figure');
    figure.className = 'sample';
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `View sample: ${sample.caption}`);
    const image = document.createElement('img');
    image.src = sample.src;
    image.alt = sample.caption;
    image.width = 256;
    image.height = 256;
    image.loading = 'lazy';
    const caption = document.createElement('figcaption');
    caption.textContent = sample.caption;
    button.append(image);
    figure.append(button, caption);
    group.append(figure);
  }
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  for (const button of duplicate.querySelectorAll('button')) button.tabIndex = -1;
  const track = gallery.querySelector('.track');
  track.append(group, duplicate);
  track.addEventListener('click', event => {
    const button = event.target.closest('.sample button');
    if (!button) return;
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    lightbox.showModal();
  });
  const pause = gallery.querySelector('.pause');
  const label = 'gallery';
  pause.addEventListener('click', () => {
    const paused = gallery.classList.toggle('is-paused');
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = `${paused ? 'Resume' : 'Pause'} ${label}`;
  });
}
lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target !== lightbox) return;
  const box = lightbox.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) lightbox.close();
});
const sections = document.querySelectorAll('section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of document.querySelectorAll('nav a')) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const citation = document.querySelector('#citation-text');
  const status = document.querySelector('#citation-status');
  try {
    await navigator.clipboard.writeText(citation.textContent + '\n');
    status.textContent = 'Citation copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C or Command+C to copy.';
  }
});
