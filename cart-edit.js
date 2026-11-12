export function cartChoice(product,color,size){if(size!=null)return product.variants.find(v=>v.color===color&&v.size===size);const variants=product.variants.filter(v=>v.color===color);if(!variants.length)return null;return {sku:'pending:'+product.id+':'+encodeURIComponent(variants[0].colorName??String(color)),color,size:null,price:Math.min(...variants.map(v=>v.price))}}
export function resolveCartChoice(product,sku){if(!product)return null;return product.variants.find(v=>v.sku===sku)||[...new Set(product.variants.map(v=>v.color))].map(color=>cartChoice(product,color,null)).find(v=>v.sku===sku)}
// Editing a line preserves its quantity; duplicate variants merge without dropping pairs.
export function changeCartVariant(cart,products,fromSku,toSku){
 const source=cart.find(item=>item.sku===fromSku);
 if(!source)throw Error('Pair больше не находится в корзине');
 const product=products.find(p=>p.id===source.id);
 const variant=resolveCartChoice(product,toSku);
 if(!variant)throw Error('Этот вариант модели недоступен');
 if(fromSku===toSku)return cart.map(item=>({...item}));
 const target=cart.find(item=>item.sku===toSku);
 if((target?.qty||0)+source.qty>20)throw Error('You can add up to 20 pairs of each variant');
 return cart.flatMap(item=>{
  if(item.sku===fromSku)return target?[]:[{...item,sku:variant.sku,color:variant.color,size:variant.size}];
  if(item.sku===toSku)return [{...item,qty:item.qty+source.qty}];
  return [{...item}];
 });
}
export function parseRoute(hash){
 const value=String(hash||'').replace(/^#/,'');
 if(['home','catalog','wishlist','cart','about'].includes(value))return {page:value};
 const match=/^product\/(\d+)$/.exec(value);
 if(match&&Number.isSafeInteger(+match[1])&&+match[1]>0)return {productId:+match[1]};
 return {page:'home'};
}
