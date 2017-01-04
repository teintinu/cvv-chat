import {createMatrix} from './creatematrix'
import {ana, maria, joao} from './personas'

var m1=createMatrix({
  voluntarios: {ana},
  OPs: {}    
});
var m2=createMatrix({
  voluntarios: {maria},
  OPs: {}    
});
var m3=createMatrix({
  voluntarios: {joao},
  OPs: {}    
});

describe('Login de voluntário', function() {

    it('Logar como voluntária Ana / Navegador Chrome - iPhone5', function() {
      m1.init();
      return m1.ana.login().end();
    });

    it('Logar como voluntária Maria / Navegador Firefox - Galaxy S6', function() {
      m2.init();
      return m2.maria.login().end();
    });

    it('Logar como voluntário Joao  / Navegador Chrome - Desktop', function() {
      m3.init();
      return m3.joao.login().end();
    });

});
