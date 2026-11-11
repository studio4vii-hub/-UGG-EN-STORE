// Telegram SDK is optional in an ordinary browser. No initData is sent or trusted here.
export function initTelegram({onBack,canGoBack}){
 const tg=window.Telegram?.WebApp;
 if(!tg||tg.platform==='unknown')return {syncBack(){}};
 const supported=v=>typeof tg.isVersionAtLeast==='function'&&tg.isVersionAtLeast(v);
 const inset=n=>Number.isFinite(n)&&n>0?Math.min(n,200):0;
 function updateInsets(){const safe=tg.safeAreaInset||{},content=tg.contentSafeAreaInset||{};for(const side of ['top','bottom','left','right'])document.documentElement.style.setProperty('--telegram-safe-'+side,Math.max(inset(safe[side]),inset(content[side]))+'px')}
 function syncBack(){if(!supported('6.1'))return;if(canGoBack())tg.BackButton.show();else tg.BackButton.hide()}
 try{if(supported('6.1')){tg.BackButton.onClick(onBack);tg.setHeaderColor('#ffffff');tg.setBackgroundColor('#ffffff')}if(supported('7.10'))tg.setBottomBarColor?.('#ffffff');tg.onEvent('safeAreaChanged',updateInsets);tg.onEvent('contentSafeAreaChanged',updateInsets);tg.onEvent('viewportChanged',updateInsets);updateInsets();syncBack();tg.ready();tg.expand()}catch(error){console.warn('Telegram interface setup was incomplete')}
 return {syncBack};
}
