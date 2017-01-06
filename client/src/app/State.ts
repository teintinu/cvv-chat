
import { Status, Atendimento, Disponibilidade } from './api';
import { configure_server, Server, _server_state } from './peer';

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
      _server.login(login, senha, (err: Error) => {
        _carregando = false;
        if (err)
          state.showSnackbar(err.message);
        else {
          _view = 'Voluntario';
          saveConfig();
        }
      });
    }
  }
  solicitarAtendimento() {
    state.view = 'OP';
    state.carregando = true;

    _server.chamar(['audio'], (err) => {
      state.carregando = false;
    });
  }
};

class Canal<T> {
  constructor(private _change: boolean,
    private _save: boolean,
    private _texto?: T,
    private _audio?: T,
    private _video?: T
  ) {
  }
  get texto(): T {
    return this._texto;
  }
  set texto(value: T) {
    this._texto = value;
    if (this._change)
      dispatch("changed");
    if (this._save)
      saveConfig();
  }
  get audio(): T {
    return this._audio;
  }
  set audio(value: T) {
    this._audio = value;
    if (this._change)
      dispatch("changed");
    if (this._save)
      saveConfig();
  }
  get video(): T {
    return this._video;
  }
  set video(value: T) {
    this._video = value;
    if (this._change)
      dispatch("changed");
    if (this._save)
      saveConfig();
  }
}

var _canais = new Canal<boolean>(true, true, false, false, false);
export var state = new State();

function dispatch(evento: string) {
  if (_eventos_tm[evento]) clearTimeout(_eventos_tm[evento])
  _eventos_tm[evento] = setTimeout(function () {
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

var _server: Server;
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
    s.onload = function () {
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
