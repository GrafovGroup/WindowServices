import { services } from '../content/services.mjs';

export const routes = {
  home: ['', ''], services: ['services', 'services'], commercial: ['commercial', 'commercial'],
  residential: ['residential', 'residentiel'], management: ['commercial/property-management', 'commercial/gestion-immobiliere'],
  areas: ['areas', 'regions'], resources: ['resources', 'ressources'],
  compare: ['resources/repair-or-replace-windows', 'ressources/reparer-ou-remplacer-fenetres'],
  condensation: ['resources/window-condensation', 'ressources/condensation-fenetres'],
  preparation: ['resources/preparing-window-service-quote', 'ressources/preparer-demande-soumission'],
  about: ['about', 'a-propos'], contact: ['contact', 'contact'], quote: ['request-a-quote', 'demander-une-soumission'],
  privacy: ['privacy', 'confidentialite'], accessibility: ['accessibility', 'accessibilite'],
  thanks: ['thank-you', 'merci'], error: ['404', '404'],
};
for (const service of services) routes[service.id] = [`services/${service.en.slug}`, `services/${service.fr.slug}`];
export const locales = ['en', 'fr'];
export function route(id, lang) {
  if (!routes[id] || !locales.includes(lang)) throw new Error(`Unknown route: ${id}/${lang}`);
  return `/${lang}/${routes[id][lang === 'fr' ? 1 : 0]}${id === 'home' ? '' : '/'}`;
}
export function quoteLink(lang, context = {}) {
  const query = new URLSearchParams();
  if (services.some(s => s.id === context.service)) query.set('service', context.service);
  if (['commercial', 'residential', 'other'].includes(context.property)) query.set('property', context.property);
  if (routes[context.source]) query.set('source', context.source);
  if (context.province) query.set('province', context.province);
  return route('quote', lang) + (query.size ? `?${query}` : '');
}
