import {state} from '../State';
import * as React from 'react';
import Paper from 'material-ui/Paper';
// import Dialog from 'material-ui/Dialog';
// import {deepOrange500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import EnhancedButton from 'material-ui/internal/EnhancedButton';
import {white, green700} from 'material-ui/styles/colors';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: "2em",
  },
  paper: {
    height: "6em",
    width: "10em",
    fontSize: "200%",
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
    overflow: 'clip'
  },
  button: {
    padding: "0px",
    height: "6em",
    width: "10em",
    backgroundColor: green700,
    borderRadius: '50%'
  },
  label: {
    height: "6em",
    width: "10em"
  },
  serVoluntario: {
  },
  sobre: {
  },
  areaDoVoluntario: {
  }
};

export class Home extends React.Component<{}, {}> {
  render() {
    return <div style={styles.container}>
      <p style={{height: '2em'}}></p>
      <Paper style={styles.paper} zDepth={1} circle={true} 
        >
        <EnhancedButton 
          key="solicitarAtendimento"          
          onTouchTap={()=>state.solicitarAtendimento()}
          tabIndex={1001}
          focusRippleColor={white}
          touchRippleColor={white}
          focusRippleOpacity={0.16}
          touchRippleOpacity={0.16}
          style={styles.button}
        >       
          <span style={styles.label}>
              Fale com o CVV
          </span>        
        </EnhancedButton>        
      </Paper>
      <p style={{height: '2em'}}></p>
      <RaisedButton
        label={<span>Quero me tornar voluntário(a)</span>}
        tabIndex={1002}
        primary={true}
        style={styles.serVoluntario}
        onTouchTap={state.todo} />
      <p></p>
      <RaisedButton
        label="Sobre o CVV"
        tabIndex={1003}
        primary={true}
        style={styles.sobre}
        onTouchTap={state.todo} />
      <p style={{height: '2em'}}></p>
      <RaisedButton
        label="Área de voluntários"
        tabIndex={1004}
        style={styles.areaDoVoluntario}
        key="loginVoluntario"          
        onTouchTap={()=>state.loginVoluntario()} />
    </div>;    
  }
}