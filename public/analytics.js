// Basic opt-in: the Google script is never requested before consent.
const preferenceKey='ws-analytics-consent-v1';
const lifetime=180*24*60*60*1000;
const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
let enabled=false,started=false,config,routes,returnFocus;
const allowedEvents=new Set(['quote_cta_click','phone_click','email_click','quote_start','quote_validation_error','quote_submit_error','generate_lead']);
const allowedValues={service:['cleaning','repair','installation','replacement','unsure'],property_type:['commercial','residential','other'],error_type:['validation','provider','rate_limit','network','timeout']};

function preference() {
  try { const value=JSON.parse(localStorage.getItem(preferenceKey));return value&&['accepted','declined'].includes(value.choice)&&value.at<=Date.now()&&Date.now()-value.at<lifetime?value.choice:null; } catch { return null; }
}
function forgetCookies() {
  for(const cookie of document.cookie.split(';')) {
    const name=cookie.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;
    for(const domain of ['',location.hostname,'.'+location.hostname])document.cookie=`${name}=; Max-Age=0; Path=/;${domain?' Domain='+domain+';':''} SameSite=Lax; Secure`;
  }
}
function context() {
  const id=document.body.dataset.page,language=document.body.dataset.language;
  return {page_id:routes[id]?id:'error',site_language:language==='fr'?'fr':'en'};
}
export function track(name,details={}) {
  if(!enabled||!allowedEvents.has(name))return;
  const safe=context();
  for(const [key,values] of Object.entries(allowedValues))if(values.includes(details[key]))safe[key]=details[key];
  window.gtag('event',name,{...safe,send_to:config.measurementId});
}
function start() {
  enabled=true;window['ga-disable-'+config.measurementId]=false;
  if(started){window.gtag('consent','update',{...denied,analytics_storage:'granted'});return;}
  started=true;window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',denied);
  window.gtag('consent','update',{...denied,analytics_storage:'granted'});
  window.gtag('js',new Date());
  let referrer='';try {const ref=new URL(document.referrer);if(ref.origin!==location.origin)referrer=ref.origin+'/';}catch{}
  const {page_id,site_language}=context();
  window.gtag('config',config.measurementId,{
    send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
    cookie_expires:lifetime/1000,cookie_update:false,cookie_domain:location.hostname,cookie_flags:'SameSite=Lax;Secure',
    page_location:config.origin+routes[page_id][site_language],page_referrer:referrer,
    page_title:document.title,page_id,site_language,
  });
  window.gtag('event','page_view',{send_to:config.measurementId});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+config.measurementId;document.head.append(script);
}
function stop() {
  enabled=false;window['ga-disable-'+config.measurementId]=true;
  if(started)window.gtag('consent','update',denied);
  forgetCookies();
}
export function initAnalytics() {
  const element=document.querySelector('#analytics-config');if(!element)return;
  config=JSON.parse(element.textContent);routes=JSON.parse(document.querySelector('#route-map').textContent);
  if(!config.enabled||!/^G-[A-Z0-9]+$/.test(config.measurementId))return;
  const panel=document.querySelector('#analytics-consent');
  const settings=document.querySelector('[data-analytics-settings]');settings.hidden=false;
  const show=(focus=false)=>{panel.hidden=false;document.body.classList.add('consent-visible');if(focus){returnFocus=document.activeElement;document.querySelector('#consent-title').focus();}};
  const hide=()=>{panel.hidden=true;document.body.classList.remove('consent-visible');if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null;};
  const choose=choice=>{
    try{localStorage.setItem(preferenceKey,JSON.stringify({choice,at:Date.now()}));}catch{}
    choice==='accepted'?start():stop();hide();
  };
  settings.addEventListener('click',()=>show(true));
  panel.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.consent)));
  const saved=preference();if(saved==='accepted')start();else if(!saved)show();else stop();
  window.addEventListener('storage',event=>{if(event.key===preferenceKey){if(preference()==='accepted'){start();hide();}else {stop();if(!preference())show();else hide();}}});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link)return;const url=new URL(link.href);
    if(url.protocol==='tel:')track('phone_click');else if(url.protocol==='mailto:')track('email_click');
    else if(url.origin===location.origin&&Object.values(routes.quote).includes(url.pathname))track('quote_cta_click',{service:url.searchParams.get('service'),property_type:url.searchParams.get('property')});
  });
}
