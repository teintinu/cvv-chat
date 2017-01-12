import {createMatrix} from './creatematrix'
import {ana, maria, joao} from './personas'

var cenario=createMatrix({
  voluntarios: {ana},
  OPs: {maria, joao}    
});

describe('chat-texto: Voluntária Ana, OP: Maria e Joao', function() {

    it('inicializar cenario', function() {
      return cenario.init();
    });
    it('init - status', function() {
      return cenario.ana.checkText('#tableStatus', 
`Voz Chat Video
Demanda neste momento
Em atendimento 0 0 0
Tamanho da fila 0 0 0
Disponibilidade neste momento
Voluntários logados 0 0 0
Voluntários disponíveis 0 0 0`        
);
    });
    it('ana aguardando', function() {
      return cenario.ana.login();
    }),
    it('ana - status', function() {
      return cenario.ana.checkText('#tableStatus', 
`Voz Chat Video
Demanda neste momento
Em atendimento 0 0 0
Tamanho da fila 0 0 0
Disponibilidade neste momento
Voluntários logados 1 0 0
Voluntários disponíveis 1 0 0`        
);
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
