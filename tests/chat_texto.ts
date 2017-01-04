import {createMatrix} from './creatematrix'
import {ana, maria, joao} from './personas'

var cenario=createMatrix({
  voluntarios: {ana},
  OPs: {maria, joao}    
});

describe('chat-texto: Voluntária Ana, OP: Maria e Joao', function() {

    it('inicializar cenario', function() {
      cenario.init();
      return cenario.ana.login();
    });
    it('ana aguardando', function() {
      debugger
      return cenario.ana.pause(100);
    });
    it('maria chamando', function() {
      return cenario.maria.chamar();
    });
    // it('pause-joao', function() {
    //   return cenario.joao.pause(10000);
    // });
    it('ana aguardando', function() {
      return cenario.ana.pause(100);
    });
    it('finalizar cenario', function() {
      return cenario.end();
    });

});
