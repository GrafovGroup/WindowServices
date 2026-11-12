import { validateQuote } from './form-validation.js';
import { initAnalytics, track } from './analytics.js';
document.documentElement.classList.add('js');
initAnalytics();

const menu = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('#menu-toggle');
if(menu && menuButton) {
  const closeMenu=()=>{ menu.close();menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');menuButton.focus(); };
  menuButton.addEventListener('click',()=>{menu.showModal();menuButton.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');});
  menu.querySelector('[data-close]').addEventListener('click',closeMenu);
  menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu();});
  menu.addEventListener('click',e=>{if(e.target===menu)closeMenu();});
  menu.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=[...menu.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const wide=matchMedia('(min-width: 1180px)');wide.addEventListener('change',e=>{if(e.matches&&menu.open)closeMenu();});
}

const form=document.querySelector('#quote-form');
if(form) {
  const lang=form.dataset.lang; const fr=lang==='fr';
  const status=document.querySelector('#form-status');const submit=document.querySelector('#submit-request');
  const standard=document.querySelector('#standard-submit');let submitting=false,accepted=false;
  const initialText=submit.textContent; const params=new URLSearchParams(location.search);
  const measure=(event,details={})=>track(event,{service:form.elements.service.value,property_type:form.elements.property.value,...details});
  let began=false;form.addEventListener('input',()=>{if(!began){began=true;measure('quote_start');}});
  const routeMap=JSON.parse(document.querySelector('#route-map').textContent);
  for(const field of ['service','property','province']) {
    const value=params.get(field);const control=form.elements.namedItem(field);
    if([...control.options].some(o=>o.value===value)) control.value=value;
  }
  const source=params.get('source');if(routeMap[source])form.elements.source_route.value=routeMap[source][lang];
  // Only non-personal, allowlisted context crosses the language switch.
  document.querySelectorAll('a[data-language]').forEach(link=>{
    const target=new URL(link.href);for(const field of ['service','property','province'])if(form.elements[field].value)target.searchParams.set(field,form.elements[field].value);
    if(routeMap[source])target.searchParams.set('source',source);link.href=target.href;
  });
  form.elements.submission_id.value=globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const updateExtras=()=>document.querySelectorAll('[data-extra]').forEach(group=>{
    const show=group.dataset.extra.split(' ').includes(form.elements.service.value);group.hidden=!show;
    group.querySelectorAll('input').forEach(input=>input.disabled=!show);
  });
  form.elements.service.addEventListener('change',updateExtras);updateExtras();
  form.noValidate=true;
  const displayStatus=(text)=>{status.textContent=text;status.hidden=false;status.focus();};
  const resetErrors=()=>{form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));form.querySelectorAll('.field-error').forEach(el=>el.textContent='');status.hidden=true;standard.hidden=true;};
  const showErrors=(errors)=>{
    measure('quote_validation_error',{error_type:'validation'});
    for(const [key,message] of Object.entries(errors)) {
      const input=form.elements.namedItem(key);const error=document.getElementById(`${key}-error`);
      if(input&&error){const details=input.closest('details');if(details)details.open=true;input.setAttribute('aria-invalid','true');error.textContent=message;}
    }
    displayStatus(fr?'Veuillez vérifier les champs indiqués.':'Please review the highlighted fields.');
    form.querySelector('[aria-invalid="true"]')?.focus();
  };
  standard.addEventListener('click',()=>{if(submitting||accepted)return;const errors=validateQuote(Object.fromEntries(new FormData(form)),lang);if(Object.keys(errors).length){showErrors(errors);return;}submitting=true;submit.disabled=true;standard.disabled=true;HTMLFormElement.prototype.submit.call(form);});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(submitting||accepted)return;resetErrors();
    const body=new FormData(form);const errors=validateQuote(Object.fromEntries(body),lang);
    if(Object.keys(errors).length){showErrors(errors);return;}
    if(body.get('_gotcha')){displayStatus(fr?'La demande n’a pas été envoyée. Veuillez nous appeler.':'The request was not sent. Please call us.');return;}
    if(!body.get('email')?.trim())body.delete('email');
    body.set('service_label',form.elements.service.selectedOptions[0].textContent);
    body.set('property_label',form.elements.property.selectedOptions[0].textContent);
    submitting=true;submit.disabled=true;submit.textContent=fr?'Envoi en cours…':'Sending…';form.setAttribute('aria-busy','true');
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
    try {
      const response=await fetch(form.action,{method:'POST',body,headers:{Accept:'application/json'},signal:controller.signal,credentials:'omit',referrerPolicy:'origin'});
      const result=await response.json().catch(()=>null);
      if(response.ok && result?.ok===true) {
        measure('generate_lead');
        accepted=true;form.hidden=true;const success=document.querySelector('#form-success');success.hidden=false;success.focus();form.reset();
      } else {
        measure('quote_submit_error',{error_type:response.status===429?'rate_limit':'provider'});
        const providerErrors={};
        for(const error of result?.errors||[]) if(typeof error.field==='string' && form.elements.namedItem(error.field)) providerErrors[error.field]=fr?'Veuillez vérifier ce renseignement.':'Please check this detail.';
        if(Object.keys(providerErrors).length)showErrors(providerErrors);
        else displayStatus(response.status===429 ? (fr?'Trop de tentatives. Attendez avant de réessayer ou appelez-nous.':'Too many attempts. Please wait before trying again, or call us.') : (fr?'L’envoi n’a pas été confirmé. Vos renseignements sont conservés ici. Vous pouvez poursuivre avec la vérification Formspree ou nous appeler.':'Submission was not confirmed. Your details are still here. You can continue with Formspree verification or call us.'));
        standard.hidden=response.status===429;
      }
    } catch(error) {
      measure('quote_submit_error',{error_type:error.name==='AbortError'?'timeout':'network'});
      displayStatus(error.name==='AbortError' ? (fr?'La confirmation prend trop de temps. La demande pourrait avoir été reçue. Appelez-nous pour vérifier avant de la renvoyer.':'Confirmation took too long. Your request may have been received. Please call to check before sending it again.') : (fr?'La connexion a été interrompue. La réception n’est pas confirmée. Vos renseignements sont conservés ici; appelez-nous avant de réessayer.':'The connection was interrupted. Receipt is unconfirmed. Your details are still here; please call before retrying.'));
    } finally {
      clearTimeout(timeout);submitting=false;form.removeAttribute('aria-busy');submit.disabled=accepted;submit.textContent=initialText;
    }
  });
}
