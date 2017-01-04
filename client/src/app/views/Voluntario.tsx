import { state } from '../State';
import * as React from 'react';
import Toggle from 'material-ui/Toggle';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

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
  if (state.server_state.disponibilidade.logado())
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
      <RaisedButton label="Acessar" tabIndex={2001} primary={true} onTouchTap={() => state.loginVoluntario(self.state.login, self.state.senha)} />
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
           <h1 id="vdisponivel">{state.server_state.disponibilidade.nome}x</h1>
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
          { state.server_state.disponibilidade.can_voz?
          <Toggle
            label="Atender por voz" style={styles.toggle}
            checked={state.server_state.disponibilidade.enable && state.canal.voz}
            disabled={!(state.server_state.disponibilidade.can_voz && state.server_state.disponibilidade.enable)}
            labelPosition="right"
            onToggle={(e, checked)=>{state.canal.voz = checked}}
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
            disabled={!(state.server_state.disponibilidade.can_voz && state.server_state.disponibilidade.enable)}
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
      {Status()}
    </div>;
  }
}

function Status() {
 return <div style={{border: "dotted black 1px", marginTop: "1em"}}>
    <table width="100%">
    <tbody>
      <tr>
        <th></th>
        <th>Voz</th>
        <th>Chat</th>
        <th>Video</th>
      </tr>
      <tr>
        <th colSpan={4}>Demanda neste momento</th>
      </tr>
      <tr>
        <td>Em atendimento</td>
        <td>{state.server_state.status.onVoz-state.server_state.status.idleVoz}</td>
        <td>{state.server_state.status.onTexto-state.server_state.status.idleTexto}</td>
        <td>{state.server_state.status.onVideo-state.server_state.status.idleVideo}</td>
      </tr>
      <tr>
        <td>Tamanho da fila</td>
        <td>{state.server_state.status.filaVoz}</td>
        <td>{state.server_state.status.filaTexto}</td>
        <td>{state.server_state.status.filaVideo}</td>
      </tr>
      <tr>
        <th colSpan={4}>Disponibilidade neste momento</th>
      </tr>
      <tr>
        <td>Voluntários logados</td>
        <td>{state.server_state.status.onVoz}</td>
        <td>{state.server_state.status.onTexto}</td>
        <td>{state.server_state.status.onVideo}</td>
      </tr>
      <tr>
        <td>Voluntários disponíveis</td>
        <td>{state.server_state.status.idleVoz}</td>
        <td>{state.server_state.status.idleTexto}</td>
        <td>{state.server_state.status.idleVideo}</td>
      </tr>
    </tbody>
  </table>
  </div>
}