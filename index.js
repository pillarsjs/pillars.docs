
// Get argv > args
var arvRegexp = /^([\w]+)\=(.*)$/;
var args = {
  port: 3000,
  debug: true,
  timeout: 10000
};
for(var i=0,l=process.argv.length;i<l;i++){
  if(arvRegexp.test(process.argv[i])){
    var m = arvRegexp.exec(process.argv[i]);
    args[m[1]]=m[2];
  }
}
console.log(args);

// Pillars.js load
var project = require('pillars').configure({
  renderReload: args.debug,
  debug: args.debug
});

// HTTP service start
project.services.get('http').configure({
  timeout: args.timeout,
  port: args.port
}).start();

// Internacionalization config
var i18n = global.textualization;
i18n.languages = ['es'];

// Log manager config
var crier = global.crier.addGroup('pillarsdocs');

// Setup Templated .jade support.

var marked = require('marked');
marked.setOptions({
  highlight: function (code,lang) {
    return hljsFix(code,lang);
  }
});

var hljs = require('highlight.js');
function hljsFix(str,lang){
  var result;
  if(lang){
    result = hljs.highlight(lang,str,true).value;
  } else {
    result = hljs.highlightAuto(str).value;
  }
  result = result.replace(/^((<[^>]+>|\s{4}|\t)+)/gm, function(match, r) {
    return r.replace(/\s{4}|\t/g, '  ');
  });
  result = result.replace(/\n/g, '<br>');
  return '<pre class="highlight"><code>'+result+'</pre></code>';
}

var jade = require('jade');
jade.filters.highlight = function(str,opts){
  return hljsFix(str,opts.lang);
};
jade.filters.marked = function(str,opts){
  return marked(str,opts);
};
jade.filters.codesyntax = function(str,opts){
  str = str.replace(/^((<[^>]+>|\s{4}|\t)+)/gm, function(match, r) {
    return r.replace(/\s{4}|\t/g, '  ');
  });
  return '<pre class="codesyntax"><code>'+str+'</pre></code>';
};

var templated = global.templated;
templated.addEngine('jade',function compiler(source,path){
  return jade.compile(source,{filename:path,pretty:false,debug:false,compileDebug:false});
});


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




