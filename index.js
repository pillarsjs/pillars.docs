// Pillars.js load
var project = require('pillars').configure({
  renderReload: true,
  debug: true
});



// HTTP service start
project.services.get('http').configure({port:3000}).start();


// Internacionalization config
var i18n = global.textualization;
i18n.languages = ['es','en'];


// Log manager config
var crier = global.crier.addGroup('pillarsdocs');
crier.constructor.console.language = 'es';


// Setup Templated .jade support.
var templated = global.templated;
var jade = require('jade');
var marked = require('marked');
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
marked.setOptions({
  highlight: function (code,lang) {
    return hljsFix(code,lang);
  }
});
templated.addEngine('jade',function compiler(source,path){
  return jade.compile(source,{filename:path,pretty:true,debug:false,compileDebug:true});
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




