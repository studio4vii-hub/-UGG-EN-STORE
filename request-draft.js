import {resolveCartChoice} from './cart-edit.js';
export function createRequestDraft(values,cart,products,colors,createdAt=new Date().toISOString()){
 const clean=(key,max)=>String(values[key]??'').trim().slice(0,max);
 const name=clean('name',80),contact=clean('contact',120),comment=clean('comment',1500);
 if(!name)throw Error('Укажи, как к тебе обращаться');
 if(!contact)throw Error('Укажи контакт for связи');
 const items=cart.map(item=>{
  const product=products.find(p=>p.id===item.id),variant=resolveCartChoice(product,item.sku);
  if(!variant||!Number.isInteger(item.qty)||item.qty<1||item.qty>20)throw Error('Обнови корзину перед сохранением запроса');
  return {...item,color:variant.color,size:variant.size,model:product.name,colorName:colors[variant.color].name,demoUnitPrice:variant.price};
 });
 return {createdAt,name,contact,comment,items,demo:true};
}
