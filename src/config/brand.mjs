// Option 1 reconstruction visually approved by the owner on November 11, 2026.
// These are editable vectors with outlined Manrope lettering and transparent backgrounds.
export const brand = {
  selectedConcept: 1,
  horizontal: { src: '/brand/logo-horizontal.svg', width: 600, height: 110 },
  reversed: { src: '/brand/logo-horizontal-white.svg', width: 600, height: 110 },
};

export function validateBrand(config, { production = false } = {}) {
  for (const variant of ['horizontal', 'reversed']) {
    const asset = config[variant];
    if (!asset) {
      if (production) throw new Error(`Approved ${variant} logo artwork is required for production.`);
      continue;
    }
    if (!/^\/brand\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.(svg|png|webp)$/.test(asset.src)) {
      throw new Error(`The ${variant} logo must be a local file directly inside public/brand/.`);
    }
    if (![asset.width, asset.height].every(value => Number.isInteger(value) && value > 0 && value <= 10000)) {
      throw new Error(`The ${variant} logo needs valid width and height dimensions.`);
    }
  }
}
