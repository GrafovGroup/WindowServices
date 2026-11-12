export const site = {
  name: 'WindowServices.ca',
  legalName: 'Superclean Canada Inc.',
  phone: '(833) 696-9996',
  phoneHref: 'tel:+18336969996',
  email: 'info@windowservices.ca',
  origin: process.env.SITE_URL || 'https://windowservices.ca',
  formEndpoint: process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/mppdzldb',
  mode: process.env.SITE_MODE || 'preview',
};

// Change only when evidence is recorded in docs/LAUNCH_CHECKLIST.md.
export const launch = {
  approvedLogo: true,
  serviceScopeVerified: true,
  legalAndPrivacyReviewed: true,
  formDeliveryVerified: false,
  hostingVerified: false,
};

export const regions = [
  ['AB', 'Alberta', 'Alberta'], ['BC', 'British Columbia', 'Colombie-Britannique'],
  ['MB', 'Manitoba', 'Manitoba'], ['NB', 'New Brunswick', 'Nouveau-Brunswick'],
  ['NL', 'Newfoundland and Labrador', 'Terre-Neuve-et-Labrador'],
  ['NS', 'Nova Scotia', 'Nouvelle-Écosse'], ['NT', 'Northwest Territories', 'Territoires du Nord-Ouest'],
  ['NU', 'Nunavut', 'Nunavut'], ['ON', 'Ontario', 'Ontario'],
  ['PE', 'Prince Edward Island', 'Île-du-Prince-Édouard'], ['QC', 'Quebec', 'Québec'],
  ['SK', 'Saskatchewan', 'Saskatchewan'], ['YT', 'Yukon', 'Yukon'],
];

export const conditionalServices = ['screens', 'films', 'skylights', 'high-rise', 'restoration', 'emergency'];
