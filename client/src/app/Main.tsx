import {state} from './State';
import {Home} from './views/Home';
import {OP} from './views/OP';
import {Voluntario} from './views/Voluntario';
import * as React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';

// const styles = {
//   container: {
//     textAlign: 'center',
//     paddingTop: 200,
//   },
// };

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component<{},{}> {
  constructor(props: {}, context: any) {
    super(props, context);

    state.on('changed', ()=> this.setState( { }));
  }

  render() {
    var e: React.ReactElement<any>;
    switch (state.view) {
      case "home":
        e= <Home/>;
        break;
      case "OP":
        e= <OP/>;
        break;
      case "Voluntario":
        e= <Voluntario/>;
        break;
    }    
    return <MuiThemeProvider muiTheme={muiTheme}>
      <div style={{textAlign: "center"}}>
        {e} 
        <Snackbar
          open={state.snackbar.open}
          message={state.snackbar.message}
          action={state.snackbar.action}
          autoHideDuration={state.snackbar.autoHideDuration}
          onActionTouchTap={state.snackbar.handleActionTouchTap}
          onRequestClose={state.snackbar.handleRequestClose}
        />           
      </div>
    </MuiThemeProvider>;
    // return 
    //      {function() {
    //      }()}
    // return (
    //     <div style={styles.container}>
    //       <Dialog
    //         open={this.state.open}
    //         title="Super Secret Password"
    //         actions={standardActions}
    //         onRequestClose={this.handleRequestClose}
    //       >
    //         1-2-3-4-5
    //       </Dialog>
    //       <h1>Material-UI</h1>
    //       <h2>example project</h2>
    //       <RaisedButton
    //         label="Super Secret Password"
    //         secondary={true}
    //         onTouchTap={this.handleTouchTap}
    //       />
    //     </div>
    //   </MuiThemeProvider>
    // );
  }
}

export default Main;
