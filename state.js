import {resolveCartChoice} from './cart-edit.js';
export function restoreWishlist(value,products){return Array.isArray(value)?[...new Set(value)].filter(id=>products.some(p=>p.id===id)):[]}
export function restoreCart(value,products){if(!Array.isArray(value))return [];const result=[];for(const item of value){if(!item||!Number.isInteger(item.qty)||item.qty<1||item.qty>20)continue;const product=products.find(p=>p.id===item.id);if(!product)continue;const variant=item.sku?resolveCartChoice(product,item.sku):product.variants.find(v=>v.color===item.color&&v.size===item.size);if(!variant)continue;const existing=result.find(i=>i.sku===variant.sku);if(existing)existing.qty=Math.min(20,existing.qty+item.qty);else result.push({id:product.id,sku:variant.sku,color:variant.color,size:variant.size,qty:item.qty})}return result}
export function requestText(draft){
 if(!draft||typeof draft!=='object')return '';
 const items=Array.isArray(draft.items)?draft.items:[];
 const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 const priced=items.length>0&&items.every(i=>Number.isFinite(i.demoUnitPrice)&&i.demoUnitPrice>0&&Number.isInteger(i.qty)&&i.qty>0);
 return ['INQUIRY — NOT SENT',`Saved: ${draft.createdAt||'date not specified'}`,`Name: ${draft.name||''}`,`Contact: ${draft.contact||''}`,`Comment: ${draft.comment||''}`,'',items.length?'SELECTED PAIRS':'QUESTION WITHOUT PRODUCTS',...items.map(i=>`${i.model} · ${i.colorName||''} · ${i.size==null?'Size not selected':'EU '+i.size} · ${i.qty} pcs. · ${i.size==null?'SKU not selected':'SKU '+i.sku}${Number.isFinite(i.demoUnitPrice)&&i.demoUnitPrice>0?' · unit price '+currency(i.demoUnitPrice):''}`),'',...(priced?[`Estimated total: ${currency(items.reduce((sum,i)=>sum+i.demoUnitPrice*i.qty,0))}`]:[]),'Prices, availability and delivery require confirmation.','Draft saved locally; it is not sent to a manager automatically.'].join('\n');
}
