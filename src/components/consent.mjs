import { route } from '../i18n/routes.mjs';

export function consentNotice(lang) {
  const fr=lang==='fr';
  return `<aside class="consent-notice" id="analytics-consent" aria-labelledby="consent-title" hidden>
    <h2 id="consent-title" tabindex="-1">${fr?'Mesure d’audience facultative':'Optional website analytics'}</h2>
    <p>${fr?'Acceptez-vous les témoins Google Analytics pour nous aider à comprendre les visites et les demandes? Les renseignements saisis dans le formulaire ne sont pas transmis à Google. Votre choix n’affecte pas votre demande.':'May we use Google Analytics cookies to understand visits and enquiries? Information you type in the form is not sent to Google. Your choice does not affect your enquiry.'} <a href="${route('privacy',lang)}">${fr?'Confidentialité':'Privacy details'}</a></p>
    <div class="consent-actions"><button type="button" class="button outline" data-consent="declined">${fr?'Refuser':'Decline'}</button><button type="button" class="button outline" data-consent="accepted">${fr?'Accepter':'Accept'}</button></div>
  </aside>`;
}
