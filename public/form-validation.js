export const provinces = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];
export const serviceIds = ['cleaning','repair','installation','replacement','unsure'];
const limits = {name:100,email:254,phone:40,city:100,company:150,message:5000,timing:150,quantity:80,access:500,frequency:150,sides:100,openings:300};
export function validateQuote(data, lang = 'en') {
  const fr=lang==='fr'; const errors={};
  const val=key=>typeof data[key]==='string'?data[key].trim():'';
  const required=fr?'Veuillez remplir ce champ.':'Please complete this field.';
  for(const key of ['name','city','province','property','service','message']) if(!val(key)) errors[key]=required;
  if(!val('email')&&!val('phone')) {
    errors.email=errors.phone=fr?'Indiquez un courriel ou un numéro de téléphone.':'Enter an email address or a phone number.';
  }
  if(val('email')&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) errors.email=fr?'Indiquez une adresse courriel valide.':'Enter a valid email address.';
  if(val('phone')&&(val('phone').replace(/\D/g,'').length<10 || !/^[+\d\s().x#-]+$/i.test(val('phone')))) errors.phone=fr?'Indiquez un numéro valide avec l’indicatif régional.':'Enter a valid phone number with area code.';
  if(val('message')&&val('message').length<10) errors.message=fr?'Décrivez votre projet en au moins 10 caractères.':'Describe the project in at least 10 characters.';
  for(const [key,max] of Object.entries(limits)) if(val(key).length>max) errors[key]=fr?`Limitez ce champ à ${max} caractères.`:`Keep this field to ${max} characters.`;
  if(val('province')&&!provinces.includes(val('province'))) errors.province=required;
  if(val('service')&&!serviceIds.includes(val('service'))) errors.service=required;
  if(val('property')&&!['commercial','residential','other'].includes(val('property'))) errors.property=required;
  return errors;
}
