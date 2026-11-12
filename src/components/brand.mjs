import { brand } from '../config/brand.mjs';
import { esc } from './html.mjs';

export function renderBrand({ reversed = false } = {}, config = brand) {
  const asset = config[reversed ? 'reversed' : 'horizontal'];
  if (asset) return `<img class="brand-artwork" src="${esc(asset.src)}" width="${asset.width}" height="${asset.height}" alt="WindowServices.ca" decoding="async">`;
  return '<span class="wordmark">Window<span>Services</span><small>.ca</small></span>';
}
