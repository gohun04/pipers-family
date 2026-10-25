// Run locally by the rooted Homebrew service. No network requests or telemetry.
var cp=require('child_process'),fs=require('fs'),path=require('path');
cp.exec("luna-send -n 1 luna://com.webos.applicationManager/listApps '{}'",{maxBuffer:2097152,timeout:10000},function(err,out){
 try{
  if(err)throw err;
  var data=JSON.parse(out),budget=110000;
  if(!data.returnValue||!Array.isArray(data.apps))throw Error('App list unavailable');
  var apps=data.apps.filter(function(a){return a.id!=='com.pipers.family'&&a.visible!==false&&a.defaultWindowType==='card'&&!(a.class&&a.class.hidden);}).map(function(a){
   var icon='';
   try{var file=path.resolve(a.folderPath,a.icon);if(file.indexOf(a.folderPath+'/')===0){var b=fs.readFileSync(file);if(b.length<18000&&b.length<budget){budget-=b.length;icon='data:image/'+(/\.jpe?g$/i.test(file)?'jpeg':'png')+';base64,'+b.toString('base64');}}}catch(e){}
   return {id:a.id,title:a.title||a.id,icon:icon,type:a.type};
  });
  console.log(JSON.stringify({apps:apps}));
 }catch(e){console.error(e.message);process.exitCode=1;}
});
