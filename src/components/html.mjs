export const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const list = items => `<ul class="check-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
