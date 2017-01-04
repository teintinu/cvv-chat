import {state} from '../State';
import * as React from 'react';
import Toggle from 'material-ui/Toggle';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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
  button: {
    bottom: "10px",
  },
};

export class OP extends React.Component<{}, {}> {
  handleOP() {
    state.solicitarAtendimento();
  }
  render() {
    return  <div style={styles.container}>
        <h1>Canais de atendimento<br/> do CVV</h1>
        <p style={{margin: "2em"}}>Escolha como você prefire ser atendido(a) pelo CVV</p>
        <Toggle
          label="Aceito ser atendido(a) por voz"
          style={styles.toggle}
          checked={state.canal.audio}
          labelPosition="right"
          onToggle={(e, checked)=>{state.canal.audio = checked}}
        />
        <Toggle
          label="Aceito ser atendido(a) por chat"
          style={styles.toggle}
          checked={state.canal.texto}
          labelPosition="right"
          onToggle={(e, checked)=>{state.canal.texto = checked}}
        />

        <Toggle
          label="Aceito ser atendido(a) por video"
          style={styles.toggle}
          checked={state.canal.video}
          labelPosition="right"
          onToggle={(e, checked)=>{state.canal.video = checked}}
        />
        {
          state.carregando ?
            <div>
              conectando...
              <LinearProgress mode="indeterminate" />
            </div>
          :
            <div>
              procurando voluntário(a)...
              <LinearProgress mode="indeterminate" />
              <Card>
                <CardHeader
                  title="Atendimento do CVV"
                  subtitle="Todos voluntários estão ocupados"                  
                />
                <CardText >
                  {state.server_state.status.on} voluntários(as) trabalhando
                  {
                    state.canal.audio && state.server_state.atendimento.fila_audio > 0?
                    <div>fila de audio: {state.server_state.atendimento.fila_audio}</div>:
                    ""
                  }
                  {
                    state.canal.texto && state.server_state.atendimento.fila_texto > 0?
                    <div>fila de chat: {state.server_state.atendimento.fila_texto}</div>:
                    ""
                  }        {
                    state.canal.video && state.server_state.atendimento.fila_video > 0?
                    <div>fila de video: {state.server_state.atendimento.fila_video}</div>:
                    ""
                  }
                </CardText>
              </Card>
            </div>
        }
        <p style={{textAlign: "left", padding: "2em"}}>
          Você também pode falar com o CVV por telefone, 
          email ou pessoalmente. 
          Clique <a href="http://www.cvv.org.br/">aqui</a> para saber mais
        </p>
        <RaisedButton label="Retornar" onTouchTap={() => state.home()} />
    </div>;    
  }
}