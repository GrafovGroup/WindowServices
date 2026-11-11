import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuote } from '../public/form-validation.js';
import { route, routes, quoteLink } from '../src/i18n/routes.mjs';
const valid={name:'Website test',email:'test@example.com',phone:'',city:'Toronto',province:'ON',property:'commercial',service:'cleaning',message:'Clearly labelled test request.'};
test('either email or phone is required; each supplied contact is validated',()=>{
 assert.deepEqual(validateQuote(valid),{});
 assert.deepEqual(validateQuote({...valid,email:'',phone:'(833) 696-9996'}),{});
 assert(validateQuote({...valid,email:''}).email);
 assert(validateQuote({...valid,email:'bad-address'}).email);
 assert(validateQuote({...valid,phone:'123'}).phone);
});
test('blank, oversized and unrecognized fields are rejected in both locales',()=>{
 for(const lang of ['en','fr']){
   assert(validateQuote({...valid,message:'   '},lang).message);
   assert(validateQuote({...valid,message:'a'.repeat(5001)},lang).message);
   assert(validateQuote({...valid,province:'XX',service:'emergency'},lang).province);
   assert(validateQuote({...valid,property:'unexpected'},lang).property);
 }
 assert.match(validateQuote({},'fr').name,/Veuillez/);
});
test('every route has a unique localized equivalent and unknown routes fail',()=>{
 const seen=new Set();for(const key of Object.keys(routes))for(const lang of ['en','fr']){const path=route(key,lang);assert(!seen.has(path));seen.add(path);assert(path.endsWith('/'));}
 assert.throws(()=>route('missing','en'));assert.throws(()=>route('home','de'));
 assert.equal(route('repair','fr'),'/fr/services/reparation-fenetres/');
});
test('quote links only include supported service/property context and no personal data',()=>{
 const link=quoteLink('fr',{service:'cleaning',property:'commercial',source:'cleaning',email:'private@example.com'});
 assert(link.includes('service=cleaning'));assert(!link.includes('private'));
 assert(!quoteLink('en',{service:'emergency',property:'fake',source:'https://evil.example'}).includes('?'));
});
