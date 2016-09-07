
// Get argv > args
var arvRegexp = /^([\w]+)\=(.*)$/;
var args = {
  port: 3000,
  debug: true,
  timeout: 10000,
  renderReload: true
};
for(var i=0,l=process.argv.length;i<l;i++){
  if(arvRegexp.test(process.argv[i])){
    var m = arvRegexp.exec(process.argv[i]);
    args[m[1]]=m[2];
  }
}

// Pillars.js load
var project = require('pillars').configure({
  renderReload: args.debug,
  debug: args.debug
});

// HTTP service start
project.services.get('http').configure({
  timeout: parseInt(args.timeout,10),
  port: parseInt(args.port,10)
}).start();

// Internacionalization config
i18n.languages = ['es'];

// Log manager config
var crier = global.crier.addGroup('pillarsdocs');


// Static service
var pillarsDocsStatic = new Route({
  id:'pillarsDocsStatic',
  path:'/*:path',
  directory:{
    path:'./static',
    listing:true
  }
});
project.routes.add(pillarsDocsStatic);




