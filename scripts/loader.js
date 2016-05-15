// loader.js

fnp.user = {
  get token() { if(localStorage.getItem( 'fnp.user.token')) return atob( localStorage.getItem( 'fnp.user.token' ) ); else return false; }
};

fnp.apiFirstCall = function(obj){
  obj.method = 'GET';
  obj.accept = 'application/vnd.github.v3.full+json';
  obj.etag = 'fnp.etag.' + obj.url.replace(/\W+/g, "");
  var xhr = new XMLHttpRequest();
  xhr.open ( obj.method, obj.url, true );
  xhr.setRequestHeader( 'Accept', obj.accept );
  if(fnp.user.token) xhr.setRequestHeader( 'Authorization', 'token ' + fnp.user.token );
  if(localStorage.getItem(obj.etag)) xhr.setRequestHeader('If-None-Match', localStorage.getItem(obj.etag));
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4){
      document.querySelector('body').style.backgroundColor = "white";
      if(xhr.getResponseHeader('ETag') && obj.url.indexOf('ref=') == -1 ){
        var etag = RegExp(/W\/"(.*?)"/).exec(xhr.getResponseHeader('ETag'));
        if(etag) localStorage.setItem(obj.etag, etag[1]);
      }
      if ( xhr.status == 200 ||  xhr.status == 201 ||  xhr.status == 204 ) {
        if (typeof obj.cb == 'function') {
          if (xhr.getResponseHeader('X-RateLimit-Remaining') < 5) fnp.appendi({ tag: 'li', parent: fnp.dom.ul, innerHTML: 'rate limit: exceeded' });
          if (xhr.getResponseHeader('X-RateLimit-Remaining') < 2) window.location = fnp.repo.home + '/login/';
          var xrate = document.querySelector('footer > small');
          xrate.innerHTML = 'X-RateLimit-Remaining: ' + xhr.getResponseHeader( 'X-RateLimit-Remaining' );
          obj.cb.apply(JSON.parse(xhr.responseText));
        }
      }
      if ( xhr.status >= 400 ) {
        obj.err.apply( xhr );
      }
    }
  };
  document.querySelector('body').style.backgroundColor = 'whitesmoke';
  xhr.send();
};

fnp.getMasterHead = function(){
  fnp.apiFirstCall({
    url: fnp.repo.API + "/git/refs/heads/master",
    cb: function(){
      fnp.repo.master = (fnp.repo.master != 'master') ? fnp.repo.master : this.object.sha;
      fnp.appendi({ tag: 'script', parent: 'body', attributes: { src: fnp.repo.rawgit + '/scripts/updater.js', type: 'text/javascript' } });
    }
  });
};

// loader

fnp.getMasterHead();
