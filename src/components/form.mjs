import { site, regions } from '../config/site.mjs';
import { services } from '../content/services.mjs';
import { messages } from '../i18n/messages.mjs';
import { route } from '../i18n/routes.mjs';
import { esc } from './html.mjs';

export function quoteForm(lang) {
  const t = messages[lang];
  const input = (name, label, attrs = '', optional = false) => `<div class="field"><label for="${name}">${esc(label)}${optional ? ` <span>(${t.optional})</span>` : ''}</label><input id="${name}" name="${name}" ${attrs} aria-describedby="${name}-error"><span class="field-error" id="${name}-error"></span></div>`;
  const select = (name, label, options) => `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}" required aria-describedby="${name}-error"><option value="">${t.select}</option>${options.map(([value,label])=>`<option value="${esc(value)}">${esc(label)}</option>`).join('')}</select><span class="field-error" id="${name}-error"></span></div>`;
  return `<div class="quote-layout wrap"><aside class="quote-aside"><span class="eyebrow">${t.quoteSide}</span><h2>${lang === 'en' ? 'The details make<br>the difference.' : 'Les détails font<br>la différence.'}</h2><p>${t.quoteSideText}</p><p class="safety-note">${t.safe}</p><a class="phone-large" href="${site.phoneHref}">${site.phone}</a><a href="mailto:${site.email}">${site.email}</a><p class="small">${t.availability}</p></aside>
  <div class="form-panel"><form id="quote-form" action="${esc(site.formEndpoint)}" method="POST" accept-charset="UTF-8" data-lang="${lang}">
  <p class="small form-instructions">${t.required}</p>
  <input type="hidden" name="language" value="${lang}-CA"><input type="hidden" name="source_route" value="${route('quote',lang)}">
  <input type="hidden" name="subject" value="WindowServices.ca — ${lang === 'en' ? 'Quote request' : 'Demande de soumission'}">
  <input type="hidden" name="submission_id" value="">
  <div class="honeypot" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="_gotcha" tabindex="-1" autocomplete="off"></div>
  <div id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1" hidden></div>
  <fieldset><legend><span>01</span> ${lang === 'en' ? 'How can we reach you?' : 'Comment vous joindre?'}</legend>
    ${input('name',t.name,'autocomplete="name" required maxlength="100"')}
    <p id="contact-hint" class="small">${t.contactHint}</p>
    <div class="form-row">${input('email',t.emailLabel,'type="email" autocomplete="email" maxlength="254"')}${input('phone',t.phone,'type="tel" autocomplete="tel" maxlength="40"')}</div>
    ${input('company',t.company,'autocomplete="organization" maxlength="150"',true)}
  </fieldset>
  <fieldset><legend><span>02</span> ${lang === 'en' ? 'Where is the property?' : 'Où se trouve la propriété?'}</legend>
    <div class="form-row">${input('city',t.city,'autocomplete="address-level2" required maxlength="100"')}${select('province',t.province,regions.map(r=>[r[0],r[lang==='fr'?2:1]]))}</div>
    ${select('property',t.property,[['commercial',t.commercial],['residential',t.residential],['other',t.other]])}
  </fieldset>
  <fieldset><legend><span>03</span> ${lang === 'en' ? 'What needs attention?' : 'Que souhaitez-vous faire?'}</legend>
    ${select('service',t.service,[...services.map(s=>[s.id,s[lang].title]),['unsure',t.unsure]])}
    <div class="field"><label for="message">${t.description}</label><textarea id="message" name="message" rows="5" required minlength="10" maxlength="5000" aria-describedby="message-error"></textarea><span class="field-error" id="message-error"></span></div>
    <div class="form-row">${input('quantity',t.quantity,'maxlength="80"',true)}${input('timing',t.timing,'maxlength="150"',true)}</div>
    <div data-extra="cleaning" hidden><div class="form-row">${input('frequency',t.frequency,'maxlength="150" disabled',true)}${input('sides',t.scopeChoice,'maxlength="100" disabled',true)}</div></div>
    <div data-extra="installation replacement" hidden>${input('openings',t.newExisting,'maxlength="300" disabled',true)}</div>
    ${input('access',t.access,'maxlength="500"',true)}
  </fieldset>
  <p class="small privacy-note">${t.formPrivacy} <a href="${route('privacy',lang)}">${t.privacyLink}</a>.</p>
  <button class="button" type="submit" id="submit-request">${t.submit}</button>
  <button class="text-button" type="button" id="standard-submit" hidden>${lang==='en'?'Continue with Formspree verification':'Continuer avec la vérification Formspree'}</button>
  <noscript><p class="notice">${t.noJs} ${t.contactHint}</p></noscript>
  </form><section id="form-success" class="success-panel" tabindex="-1" hidden><span class="success-icon" aria-hidden="true">✓</span><h2>${t.successTitle}</h2><p>${t.successText}</p><a class="button" href="${route('thanks',lang)}">${t.next}</a></section></div></div>`;
}
