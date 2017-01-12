import { state } from '../State';
import * as React from 'react';
import Toggle from 'material-ui/Toggle';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { Status } from './status';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: "2em",
    maxWidth: 280,
    position: "relative"
  },
  paper: {
    padding: "20px",
    display: 'inline-block',
  },
  toggle: {
    bottom: "10px",
    textAlign: 'left',
    marginBottom: 16,
  },
  canal: {
    lineHeight: '14px'
  },
  button: {
    bottom: "10px",
  },
};

export function Voluntario() {
  if (state.carregando)
    return <CircularProgress size={80} thickness={5} />
  var d=state.server_state.disponibilidade;
  if (d.conexao) {
    if (d.conexao.pendente)
      return <VoluntarioChamando />
    if (d.conexao.canal == 'texto')
      return <VoluntarioAtendimentoTexto />
    if (d.conexao.canal == 'audio')
      return <VoluntarioAtendimentoAudio />
    if (d.conexao.canal == 'video')
      return <VoluntarioAtendimentoVideo />
  }
  if (d.logado)
    return <VoluntarioDisponibilidade />
  return <VoluntarioLogin />
}

export class VoluntarioLogin extends React.Component<{}, { login: string, senha: string }> {
  constructor() {
    super();
    this.state = { login: state.server_state.disponibilidade.nome, senha: '' };
  }
  render() {
    var self = this;
    return <div style={styles.container}>
      <h1>Identifique-se</h1>
      <p style={{ margin: "2em" }}>(isto é apenas um teste, use qualquer nome e senha)</p>
      <TextField
        hintText="Nome do(a) voluntário(a)"
        id = "vlogin"
        value={this.state.login}
        onChange={(function (e) { self.setState({ login: arguments[1], senha: self.state.senha }); })}
        floatingLabelText="Seu nome"
        />
      <TextField
        hintText="senha do(a) voluntário(a)"
        floatingLabelText="sua senha"
        id = "vsenha"
        type="password"
        value={this.state.senha}
        onChange={(function (e) { self.setState({ login: self.state.login, senha: arguments[1] }); })}
        />
      <RaisedButton label="Acessar" tabIndex={2001} primary={true} onTouchTap={() => state.loginVoluntario(self.state.login, self.state.senha)} /> <br />
      <RaisedButton label="Usar Google" tabIndex={2001} primary={true} onTouchTap={() => state.loginVoluntario('@@@', 'g')} /> <br />
      <RaisedButton label="Usar Facebook" tabIndex={2001} primary={true} onTouchTap={() => state.loginVoluntario('@@@', 'f')} /> <br />
      <RaisedButton label="Retornar" onTouchTap={() => state.home()} />
      {<Status></Status>}
    </div>;
  }
}
 
export class VoluntarioDisponibilidade extends React.Component<{}, {}> {
  render() {
    var self = this;
    return <div style={styles.container}>
      {state.server_state.disponibilidade.enable ?
         <div> 
           <h1 id="vdisponivel">{state.server_state.disponibilidade.nome}</h1>
          <span>
            <p>Aguarde até que a OP nos procure</p>
          </span>
        </div>
        :
        <div>
        <h1 id="vpausado">{state.server_state.disponibilidade.nome}</h1>
          "Indisponível"
        </div>
      }
        <Toggle
          label="Pausar atendimentos"
          id="vpausar"
          style={styles.toggle}
          checked={!state.server_state.disponibilidade.enable}
          labelPosition="right"
          onToggle={(e, checked)=>{state.server_state.disponibilidade.enable = !checked}}
        />
        { state.server_state.disponibilidade.enable?
        <div>
          Canais <br /><br />
          { state.server_state.disponibilidade.can_audio?
          <Toggle
            label="Atender por voz" style={styles.toggle}
            checked={state.server_state.disponibilidade.enable && state.canal.audio}
            disabled={!(state.server_state.disponibilidade.can_audio && state.server_state.disponibilidade.enable)}
            labelPosition="right"
            onToggle={(e, checked)=>{state.canal.audio = checked}}
          />
            : null
          }
          { state.server_state.disponibilidade.can_texto?
          <Toggle
            label="Atender por chat" style={styles.toggle}
            checked={state.server_state.disponibilidade.enable && state.canal.texto}
            disabled={!(state.server_state.disponibilidade.can_texto && state.server_state.disponibilidade.enable)}
            labelPosition="right"
            onToggle={(e, checked)=>{state.canal.texto = checked}}
          />
            : null
          }
          { state.server_state.disponibilidade.can_video?
          <Toggle
            label="Atender por vídeo" style={styles.toggle}
            checked={state.server_state.disponibilidade.enable && state.canal.video}
            disabled={!(state.server_state.disponibilidade.can_audio && state.server_state.disponibilidade.enable)}
            labelPosition="right"
            onToggle={(e, checked)=>{state.canal.video = checked}}
          />
            : null
          }
          </div>
         : 
          <div className="pausado"> 

             <p>Atendimentos pausados</p>

          </div>
        }
      <RaisedButton label="Desconectar" tabIndex={2001} primary={true} onTouchTap={() => state.logout()} /> <br />
      {Status()}
    </div>;
  }
}

export function VoluntarioChamando() {
  return <div style={styles.container}>
       <div> 
         <h1 id="vchamando">Chamada de {state.server_state.disponibilidade.conexao.canal}</h1>
        <span>
          <p>CHAMANDO</p>
        </span>
      </div>
    <RaisedButton label="Atender" tabIndex={2001} primary={true} onTouchTap={() => state.iniciarAtendimento()} /> <br />
    {Status()}
  </div>;  
}

export function VoluntarioAtendimentoTexto() {
  return <div style={styles.container}>
       <div> 
         <h1 id="vatendimento">Chamada de {state.server_state.disponibilidade.conexao.canal}</h1>
        <span>
          <p>Atendendo -texto</p>
        </span>
      </div>
    <RaisedButton label="Desligar" tabIndex={2001} primary={true} onTouchTap={() => state.terminarAtendimento()} /> <br />
    {Status()}
  </div>;  
}
export function VoluntarioAtendimentoAudio() {
  return <div style={styles.container}>
       <div> 
         <h1 id="vatendimento">Chamada de {state.server_state.disponibilidade.conexao.canal}</h1>
        <span>
          <p>atendendo audio</p>
        </span>
      </div>
    <RaisedButton label="Desligar" tabIndex={2001} primary={true} onTouchTap={() => state.terminarAtendimento()} /> <br />
    {Status()}
  </div>;  
}
export function VoluntarioAtendimentoVideo() {
  return <div style={styles.container}>
       <div> 
         <h1 id="vatendimento">Chamada de {state.server_state.disponibilidade.conexao.canal}</h1>
        <span>
          <p>atendendo video</p>
        </span>
      </div>
    <RaisedButton label="Desligar" tabIndex={2001} primary={true} onTouchTap={() => state.terminarAtendimento()} /> <br />
    {Status()}
  </div>;  
}
