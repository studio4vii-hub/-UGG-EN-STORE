import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url),dest=new URL('./public/',root);
await fs.mkdir(dest,{recursive:true});
for(const name of ['index.html','style.css','app.js','catalog.js','state.js','cart-edit.js','request-draft.js','product-images.js','photos.js','telegram.js'])await fs.copyFile(new URL(name,root),new URL(name,dest));
await fs.mkdir(new URL('data/',dest),{recursive:true});
for(const name of ['csv.js','catalog-matrix.csv'])await fs.copyFile(new URL('data/'+name,root),new URL('data/'+name,dest));
await fs.cp(new URL('images/',root),new URL('images/',dest),{recursive:true});
await fs.writeFile(new URL('.nojekyll',dest),'');
console.log('GitHub Pages package prepared: public/');
