
import { Status, Atendimento, Disponibilidade } from './api';

var _eventos: {
  [index: string]: Array<() => void>
} = { changed: [] };
var _eventos_tm: {
  [index: string]: any
} = {};
var _active_snackbar: {
  open: boolean,
  message: string,
  action: string,
  autoHideDuration: number,
  handleActionTouchTap: () => void,
  handleRequestClose: () => void
} = {
    open: false, message: '', action: '',
    autoHideDuration: 4000,
    handleActionTouchTap: () => null,
    handleRequestClose: () => null
  };
var _snackbars: Array<{
  message: string,
  action: string,
  autoHideDuration: number,
  onAction: () => void,
  onClose: () => void
}> = []
var _carregando: boolean = true;
type View = 'home' | 'OP' | 'Voluntario' | 'Atendimento';
var _view: View = 'home';
var config = {
  apiKey: "AIzaSyDfaFK-b45-NlueU--RNUYTRqJV9w2wzyg",
  authDomain: "i-cvv-hoda5.firebaseapp.com",
  databaseURL: "https://i-cvv-hoda5.firebaseio.com",
  storageBucket: "i-cvv-hoda5.appspot.com",
  messagingSenderId: "912825779427"
};

export var _server_state: {
  status: Status,
  disponibilidade: Disponibilidade,
  atendimento: Atendimento
} = {
    status: {
      on: 0,
      onTexto: 0,
      onAudio: 0,
      onVideo: 0,
      idle: 0,
      idleTexto: 0,
      idleAudio: 0,
      idleVideo: 0,
      filaTexto: 0,
      filaAudio: 0,
      filaVideo: 0
    },
    disponibilidade: {
      id: '',
      nome: '',
      token: '',
      enable: false,
      atendendo: false,
      can_texto: false,
      can_audio: false,
      can_video: false,
      logado: false
    },
    atendimento: {
      tokenOP: '',
      fila_texto: 0,
      fila_audio: 0,
      fila_video: 0,
    }
  };

class State {
  get carregando() {
    return _carregando;
  }
  set carregando(value) {
    _carregando = value;
    dispatch('changed');
  }
  get view(): View {
    return _view;
  }
  set view(value: View) {
    _view = value;
    saveConfig();
    dispatch('changed');
  }
  get server_state() {
    return _server_state;
  }
  get canal() {
    return _canais;
  }
  on(evento: string, fn: () => void) {
    if (!_eventos[evento].some((f) => f == fn)) _eventos[evento].push((fn));
  }
  off(evento: string, fn: () => void) {
    var f = -1;
    _eventos[evento].some((e, i) => {
      if (e == fn) {
        f = i;
        return true;
      }
    });
    if (f >= -1) _eventos[evento].splice(f, 1);
  }
  showSnackbar(message: string, action?: string, onAction?: () => void, onClose?: () => void) {
    _snackbars.push({
      message,
      action,
      autoHideDuration: 4000,
      onAction,
      onClose,
    });
    snackbar_show();
  }
  get snackbar() {
    return _active_snackbar;
  }
  todo() {
    state.showSnackbar('Esta função ainda não foi implementada');
  }
  home() {
    _view = 'home';
    _server.disconnect();
  }
  loginVoluntario(login?: string, senha?: string) {
    if (state.view == 'home') {
      if (!login || _server_state.disponibilidade.id == login) {
        state.view = 'Voluntario';
        return;
      }
    }
    else if (login && senha) {
      if (!login || login.length < 3) {
        return state.showSnackbar("Login inválido");
      }
      state.carregando = true;
      _server.login(login, senha);
    }
  }
  logout() {
    _server.logout();
  }
  solicitarAtendimento() {
    state.view = 'OP';
    state.carregando = true;
    _server.chamar(['audio']);
  }
};

var __canais: any={};
var _canais = Object.defineProperties({}, {
  texto: { 
    get(): boolean {
      return __canais.texto;
    },
    set(value: boolean) {
      __canais.texto = value;
      if (_server_state.disponibilidade.logado) {
        _server.grava_disponibilidade();
        saveConfig();
        dispatch("changed");
      }
    }
  },
  audio: { 
    get(): boolean {
      return __canais.audio;
    },
    set(value: boolean) {
      __canais.audio = value;
      if (_server_state.disponibilidade.logado) {
        _server.grava_disponibilidade();
        saveConfig();
        dispatch("changed");
      }
    }
  },
  video: { 
    get(): boolean {
      return __canais.video;
    },
    set(value: boolean) {
      __canais.video = value;
      if (_server_state.disponibilidade.logado) {
        _server.grava_disponibilidade();
        saveConfig();
        dispatch("changed");
      }
    }
  }  
});

export var state = new State();

function dispatch(evento: string) {
  if (_eventos_tm[evento]) clearTimeout(_eventos_tm[evento])
  _eventos_tm[evento] = setTimeout(function() {
    delete _eventos_tm[evento];
    _eventos[evento].forEach((fn) => {
      try {
        fn();
      }
      catch (e) { }
    });
  }, 1);
}

function snackbar_show() {
  if (_active_snackbar.open) return;
  var active = _snackbars.shift();
  if (active)
    _active_snackbar = {
      open: true,
      message: active.message,
      action: active.action,
      autoHideDuration: active.autoHideDuration,
      handleActionTouchTap() {
        if (active.onAction) active.onAction();
      },
      handleRequestClose() {
        _active_snackbar.open = false;
        setTimeout(snackbar_show, 1);
        if (active.onClose) active.onClose();
      }
    };
  dispatch('changed');
}

var _server: {
  disconnect(): void
  status(): void
  chamar(canais: string[]): void
  login(name: string, password: string): void
  logout(): void  
  vfila(canal: string, id: string, b: boolean): void  
  grava_disponibilidade(): void
};

export function configure_server(server: any, changed: () => void): typeof _server {
  server.initializeApp(config);
  var auth = server.auth();
  var database = server.database();
  var storage = server.storage();
  type DbFila = {ts: number};
  type DbDisp = {atendendo: boolean, pausado: boolean, texto: boolean, audio: boolean, video: boolean};
  events();
  return {
    disconnect() {
      _server_state.atendimento.connection = null;
      _server_state.disponibilidade.id = '';
      changed();
    },
    status() {
      // var status: {
      //   on: 0,
      //   onTexto: 0,
      //   onAudio: 0,
      //   onVideo: 0,
      //   idle: 0,
      //   idleTexto: 0,
      //   idleAudio: 0,
      //   idleVideo: 0,
      //   filaTexto: 0,
      //   filaAudio: 0,
      //   filaVideo: 0
      // }
      // _server_state.status = status;
      // db_o.all( (v: any) => {
      //   if (v.filaTexto) status.filaTexto++;
      //   if (v.filaAudio) status.filaAudio++;
      //   if (v.filaVideo) status.filaVideo++;
      // });
      // db_v.all( (v: any) => {
      //   status.on++;
      //   if (v.onTexto) status.onTexto++;
      //   if (v.onAudio) status.onAudio++;
      //   if (v.onVideo) status.onVideo++;
      //   if (v.idle) {
      //     status.idle++;
      //     if (v.onTexto) status.idleTexto++;
      //     if (v.onAudio) status.idleAudio++;
      //     if (v.onVideo) status.idleVideo++;
      //   }
      // });
    },
    chamar(canais: string[]) {
      // db_o
      // callback(new Error('x'));
    },
    login(name: string, password: string) {
      var p;
      if (name == '@@@' && password == 'g') {
        var provider = new server.auth.GoogleAuthProvider();
        p = auth.signInWithPopup(provider)
      }
      else if (name == '@@@' && password == 'f') {
        var provider = new server.auth.FacebookAuthProvider();
        p = auth.signInWithPopup(provider);
      }
      if (p)
        p.then((res: any) => {
          if (!res.user)
            state.showSnackbar('Credenciais inválidas');
        })
      else
        state.showSnackbar('não é possível logar assim');
    },
    logout() {  
      _view = 'home';
      indisponivel()
      auth.signOut();
      saveConfig();
    },
    vfila(canal: string, id: string, b: boolean)  {
      var key='vfila/'+canal+'/'+id;
      if (b)
        database.ref(key).set(<DbFila>{ts: new Date().getTime()})
      else 
        database.ref(key).remove()
     database.ref('disp/'+id).update({
       [canal]: b
     });       
    },
    grava_disponibilidade() {
      var d=_server_state.disponibilidade;
      if (!d.id) 
        throw new Error('grava_disponibilidade id?')
      var e=d.id && d.logado && d.enable && (!d.atendendo);
      _server.vfila('texto', d.id, e && d.can_texto && _canais.texto);
      _server.vfila('audio', d.id, e && d.can_audio && _canais.audio);
      _server.vfila('video', d.id, e && d.can_video && _canais.video);        
      if (d.logado)
        database.ref('disp/'+d.id).set(<DbDisp>{
          atendendo: d.atendendo,
          pausado: !d.enable,
          texto: _canais.texto,
          audio: _canais.audio,
          video: _canais.video,
        });
      else
        database.ref('disp/'+d.id).remove()       
    }    
  }
  function events() {
    auth.onAuthStateChanged((user:any)=>{
      if (user) {
        disponivel(
          user.uid,
          // TODO
          /([^\s]*)\s.*/g.exec(user.displayName + ' ? ?')[1], 
          true,
          true,
          false
        )
      } else indisponivel();
      dispatch('changed');    
    });
    database.ref('disp').on('value', function(snapshot: any) {
      var s=_server_state.status;
      s.on = 0;
      s.onTexto = 0;
      s.onAudio = 0;
      s.onVideo = 0;
      s.idle = 0;
      s.idleTexto = 0;
      s.idleAudio = 0;
      s.idleVideo = 0;
      var disp: { [s: string]: DbDisp } = snapshot.val();
      if (disp)
        Object.keys(disp).forEach( (id) => {
          var v = disp[id];
          s.on++;
          if (v.texto) s.onTexto++;
          if (v.audio) s.onAudio++;
          if (v.video) s.onVideo++;          
          if (!v.atendendo) {
            s.idle++;
            if (v.texto) s.idleTexto++;
            if (v.audio) s.idleAudio++;
            if (v.video) s.idleVideo++;
          } 
        });
      dispatch('changed');
    });    
  }


      // filaTexto: 0,
      // filaAudio: 0,
      // filaVideo: 0

}

function disponivel(id: string, nome: string, can_texto: boolean, can_audio: boolean, can_video: boolean) {
  var _enable = true, _atendendo=false;
  _server_state.disponibilidade.id = id;
  _server_state.disponibilidade.nome = nome;
  _server_state.disponibilidade.logado = !!id;
  _carregando = false;
  if (id) {
    _view = 'Voluntario';
    Object.defineProperties(_server_state.disponibilidade, {
      enable: {
        get() {
          return _enable;
        },
        set(value: boolean) {
          _enable = !!value;
          _server.grava_disponibilidade();
        }
      },
      atendendo: {
        get() {
          return _atendendo;
        },
        set(value: boolean) {
          _atendendo = !!value;
          _server.grava_disponibilidade();
        }
      },
      can_texto: {
        get() {
          return can_texto;
        }
      },
      can_audio: {
        get() {
          return can_audio;
        }
      },
      can_video: {
        get() {
          return can_video;
        }
      },
    });
    saveConfig();
    _server.grava_disponibilidade();
  }
  else indisponivel();
}

function indisponivel() {
  var d=_server_state.disponibilidade;
  if (d.enable && d.id) {
    d.logado=false;
    _server.grava_disponibilidade();
    d.id=''
  }
  dispatch('changed');
}

function calcStatus(value: any) {
  _server_state.status = {
    on: 0,
    onTexto: 0,
    onAudio: 0,
    onVideo: 0,
    idle: 0,
    idleTexto: 0,
    idleAudio: 0,
    idleVideo: 0,
    filaTexto: 0,
    filaAudio: 0,
    filaVideo: 0
  };
  // value && value.forEach( ())
}

declare var firebase: any;

export function init() {
  var js = [
    'https://www.gstatic.com/firebasejs/3.6.4/firebase.js',
    // 'https://cdn.pubnub.com/pubnub.min.js', 
    // 'http://cdn.pubnub.com/pubnub-crypto.min.js', 
    // 'https://cdn.rawgit.com/thr0w/webrtc-sdk/gh-pages/js/webrtc.js',
    // 'https://cdn.rawgit.com/thr0w/bootstrap-content-curator/gh-pages/dist/js/pubnub-sync.js'
  ];
  load();
  function load() {
    var s = document.createElement('script');
    s.setAttribute('src', js.shift());
    s.onload = function() {
      if (js.length) load()
      else {
        _server = configure_server(firebase, () => dispatch('changed'));
        loadConfig();
        if (_view == 'OP') state.solicitarAtendimento();
        else if (_view == 'Voluntario') state.loginVoluntario();
        else _view = 'home';
        _carregando = false;
        dispatch('changed')
      }
    };
    document.head.appendChild(s);
  }
}

export function loadConfig() {
  try {
    var s = localStorage.getItem("CVV");
    if (s) {
      var cfg = JSON.parse(s);
      _view = cfg.view || 'home';
      _canais.texto = cfg.canal.texto;
      _canais.audio = cfg.canal.audio;
      _canais.video = cfg.canal.video;
      _server_state.disponibilidade.nome == cfg.voluntario
    }
  }
  catch (e) { }
  finally {
    dispatch("changed");
  }
}

export function saveConfig() {
  var cfg = {
    view: _view,
    canal: {
      texto: _canais.texto,
      audio: _canais.audio,
      video: _canais.video,
    },
    voluntario: _server_state.disponibilidade.nome
  };
  localStorage.setItem("CVV", JSON.stringify(cfg));
}



