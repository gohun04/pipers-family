(function(){
'use strict';
var rows=[],r=0,c=0,dialog=false,bridges=[],toastTimer;
function tile(icon,label,app){var b=document.createElement('button');b.className='tile';b.setAttribute('aria-label',label);if(app)b.setAttribute('data-app',app);b.setAttribute('data-title',label);b.innerHTML='<span class="art"><svg viewBox="0 0 100 100"><use href="#'+icon+'" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'+icon+'"></use></svg></span><span class="label">'+label+'</span>';return b;}
for(var i=1;i<=4;i++)document.getElementById('inputs').appendChild(tile('input','HDMI '+i,'com.webos.app.hdmi'+i));
var extras=document.getElementById('essentials');extras.appendChild(tile('settings','Settings','com.palm.app.settings'));extras.appendChild(tile('homebrew','Homebrew','org.webosbrew.hbchannel'));var sleep=tile('power','Sleep TV');sleep.setAttribute('data-power','true');extras.appendChild(sleep);
var rowEls=document.querySelectorAll('.row');for(i=0;i<rowEls.length;i++)rows.push(Array.prototype.slice.call(rowEls[i].querySelectorAll('button')));
function resize(){var s=Math.min(window.innerWidth/1920,window.innerHeight/1080);var stage=document.getElementById('stage');stage.style.transform='scale('+s+')';stage.style.left=(window.innerWidth-1920*s)/2+'px';stage.style.top=(window.innerHeight-1080*s)/2+'px';}resize();window.addEventListener('resize',resize);
function clock(){document.getElementById('clock').textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});}clock();setInterval(clock,30000);
function toast(t){clearTimeout(toastTimer);var e=document.getElementById('toast');e.textContent=t;e.style.display='block';toastTimer=setTimeout(function(){e.style.display='none';},5000);}
function luna(uri,p,done){if(typeof PalmServiceBridge==='undefined'){toast('TV action: '+(p.id||'power off'));return;}var b=new PalmServiceBridge();bridges.push(b);var timeout=setTimeout(function(){toast('The TV did not respond. Please try again.');},8000);b.onservicecallback=function(raw){clearTimeout(timeout);var res;try{res=JSON.parse(raw);}catch(e){toast('Could not read the TV response.');return;}if(res.returnValue===false){toast(res.errorText||'This action is unavailable on your TV.');}else if(done)done(res);var pos=bridges.indexOf(b);if(pos>=0)bridges.splice(pos,1);};try{b.call(uri,JSON.stringify(p));}catch(e){clearTimeout(timeout);toast('Unable to open this item.');}}
function home(){luna('luna://com.webos.applicationManager/launch',{id:'com.webos.app.home'});}
function focus(){rows[r][c].focus();try{localStorage.setItem('pipers-focus',r+','+c);}catch(e){}}
function closeDialog(){dialog=false;document.getElementById('dialog').className='hidden';focus();}
function activate(b){if(b.getAttribute('data-power')){dialog=true;document.getElementById('dialog').className='';document.getElementById('cancel').focus();return;}luna('luna://com.webos.applicationManager/launch',{id:b.getAttribute('data-app')});}
rows.forEach(function(row,ri){row.forEach(function(b,ci){b.addEventListener('focus',function(){r=ri;c=ci;});b.addEventListener('click',function(){r=ri;c=ci;activate(b);});});});
document.getElementById('cancel').onclick=closeDialog;document.getElementById('confirm').onclick=function(){closeDialog();luna('luna://com.webos.service.tvpower/turnOff',{});};
document.addEventListener('keydown',function(e){var k=e.keyCode;if([13,27,37,38,39,40,461].indexOf(k)<0)return;e.preventDefault();if(dialog){if(k===27||k===461)closeDialog();else if(k===37||k===39){(document.activeElement.id==='cancel'?document.getElementById('confirm'):document.getElementById('cancel')).focus();}else if(k===13)document.activeElement.click();return;}
if(k===461||k===27){home();return;}if(k===13){activate(rows[r][c]);return;}
// HDMI and Essentials share a physical row; horizontal movement crosses their boundary.
if(k===39){if(c<rows[r].length-1)c++;else if(r===1){r=2;c=0;}}
if(k===37){if(c>0)c--;else if(r===2){r=1;c=rows[1].length-1;}}
if(k===40&&r===0){r=1;c=Math.min(c,rows[1].length-1);}
if(k===38&&r>0){r=0;c=Math.min(c,rows[0].length-1);}
focus();});
try{var saved=(localStorage.getItem('pipers-focus')||'0,0').split(',');r=+saved[0];c=+saved[1];if(!rows[r]||!rows[r][c]){r=0;c=0;}}catch(e){r=0;c=0;}focus();
})();
