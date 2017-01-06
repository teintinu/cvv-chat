
import { Status, Atendimento, Disponibilidade } from './api';

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
    can_texto: false,
    can_audio: false,
    can_video: false,
    logado() {
      return false;
    }
  },
  atendimento: {
    tokenOP: '',
    fila_texto: 0,
    fila_audio: 0,
    fila_video: 0,
  }
};

export type Server = {
  disconnect(): void,
  status(callback: (err: Error, state: typeof _server_state)=>void): void,
  chamar(canais: string[], callback: (err: Error)=>void): void,
  login(name: string, password: string, callback: (err: Error)=>void): void,
};

export function configure_server(server: any, changed: ()=> void): Server {
  server.initializeApp(config);
  // var db_o = server.sync('filaO');
  // var db_v = server.sync('filaV');
  return {
    disconnect() {
      _server_state.atendimento.connection = null;
      _server_state.disponibilidade.id = '';
      changed();      
    },
    status(callback: (err: Error, state: typeof _server_state)=>void) {
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
    chamar(canais: string[], callback: (err: Error)=>void) {
      // db_o
      // callback(new Error('x'));
    },
    login(name: string, password: string, callback: (err: Error)=>void) {
      // if (name+password=='')
      //   callback(new Error('x'));
    }
  }
}
// db.all(function (item: any) {       /* -- render all items  -- */ });

// // Register All Callback Events
// db.on.create(function (item:any) { /* -- new item          -- */ });
// db.on.update(function (item:any) { /* -- updated item      -- */ });
// db.on.delete(function (item:any) { /* -- removed item      -- */ });

// // Create Item
// var item = db.create({ headline: "Hello!" });

// // Update Item
// item.update({ headline: "Hello Update!" });

// // Delete Item
// item.delete();

          // var _enable = disponibilidade.enable;
          // Object.defineProperty(_server_state.disponibilidade, 'enable', {
          //   get() {
          //     return _enable;
          //   },
          //   set(value) {
          //     _enable = value;
          //     dispatch('changed');
          //   }
          // });
 