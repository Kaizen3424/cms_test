/**
 * Progressive enhancement for the static inquiry form on /contact.
 * Mirrors the React TravelWithUsView behavior: validate required fields,
 * swap the form body for the success panel, and raise the same toasts.
 */

// Module marker: keeps these helpers out of the global script scope so they
// don't collide with the identical helpers in favorites.ts / newsletter.ts.
export {};

function toast(message: string) {
  let region = document.querySelector<HTMLElement>('[data-toast-region]');
  if (!region) {
    region = document.createElement('div');
    region.setAttribute('data-toast-region', '');
    region.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end';
    document.body.appendChild(region);
  }

  const node = document.createElement('div');
  node.className =
    'flex items-center gap-2 bg-[#1a1a18] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium border border-white/10';
  node.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#e60023]"></span>';
  const label = document.createElement('span');
  label.textContent = message;
  node.appendChild(label);
  region.appendChild(node);

  window.setTimeout(() => node.remove(), 3200);
}

function init() {
  const form = document.querySelector<HTMLFormElement>('[data-inquiry-form]');
  const success = document.querySelector<HTMLElement>('[data-inquiry-success]');
  if (!form || !success) return;

  const nameNode = success.querySelector<HTMLElement>('[data-inquiry-name]');
  const destinationNode = success.querySelector<HTMLElement>('[data-inquiry-destination]');
  const emailNode = success.querySelector<HTMLElement>('[data-inquiry-email]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]'),
    );
    const invalid = requiredFields.find((field) => !field.value.trim() || !field.checkValidity());
    if (invalid) {
      toast('Please provide your name and email');
      invalid.focus();
      return;
    }

    const fullName = form.querySelector<HTMLInputElement>('[name="fullName"]');
    const destination = form.querySelector<HTMLSelectElement>('[name="destination"]');
    const email = form.querySelector<HTMLInputElement>('[name="email"]');
    if (nameNode) nameNode.textContent = fullName?.value.trim() || 'traveler';
    if (destinationNode) destinationNode.textContent = destination?.value || 'your destination';
    if (emailNode) emailNode.textContent = email?.value.trim() || 'your email';

    form.hidden = true;
    success.hidden = false;
    toast(
      'Your travel inquiry has been received! An expedition director will be in touch within 24 hours.',
    );
  });

  // "Submit Another Inquiry": reveal the form again, keeping every value
  // except the free-text message, exactly like the React version did.
  success.querySelector<HTMLButtonElement>('[data-inquiry-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    const message = form.querySelector<HTMLTextAreaElement>('[name="message"]');
    if (message) message.value = '';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
