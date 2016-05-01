// init.js

// define fork-n-play

var fnp = {
  url: {
    get array() {return window.location.host.split( '.' );},
    get slash() {return window.location.pathname.split( '/' );},
    get hash() {return window.location.hash.substring( 1 );},
    get page() {return this.slash[2] ? this.slash[2]: false;},
    get setup() {return this.slash[3] ? this.slash[3]: false;},
    get script() {return this.page ? (this.setup ? this.page + '.' + this.setup : this.page) : 'home';},
    get masterHash() {return this.hash && this.hash.slice(0,7) === 'master=' ? this.hash.slice(7) : 'master';},
    get dataHash() {return this.hash && this.hash.slice(0,5) === 'data=' ? this.hash.slice(5) : 'data';}
  },
  repo: {
    get owner() {return fnp.url.array[0];},
    get name() {return fnp.url.slash[1];},
    get home() {return 'http://' + this.owner + '.github.io/' + this.name;},
    get API() {return 'https://api.github.com/repos/' + this.owner + '/' + this.name;},
    get static() {return 'https://rawgit.com/' + this.owner + '/' + this.name;},
    get cdn() {return 'https://cdn.rawgit.com/' + this.owner + '/' + this.name;},
    get rawgit() {return this.master === 'master' ? this.static + '/master' : this.cdn + '/' + this.master;},
    data: {}
  },
  load: function(){
    fnp.repo.master = fnp.url.masterHash;
    fnp.repo.data.sha = fnp.url.dataHash;
    document.body.appendChild(fnp.appendScript('scripts/loader.js'));
    document.head.appendChild(fnp.appendStyle('styles/style.css'));
    if((fnp.url.page && fnp.url.page == 'setup') || (fnp.url.page && fnp.url.setup)){
      document.body.appendChild(fnp.create('script', 'scripts/jsoneditor.js', 'text/javascript'));
    }
  },
  appendScript: function(file) {
    var element = document.createElement('script');
    element.src = fnp.repo.rawgit + '/' + file;
    element.type = 'text/javascript';
    return element;
  },
  appendStyle: function(file) {
    var element = document.createElement('link');
    element.src = fnp.repo.rawgit + '/' + file;
    element.rel = 'stylesheet';
    return element;
  },
  init: function(){
    if (window.addEventListener)
      window.addEventListener('load', this.load, false);
    else if (window.attachEvent)
      window.attachEvent('onload', this.load);
    else window.onload = this.load;
  }
};

// init

fnp.init();
