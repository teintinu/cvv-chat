import * as React from 'react';
import {render} from 'react-dom';
import {loadConfig, init} from './State';
import Main from './Main'; // Our custom react component
import itep =require('react-tap-event-plugin');

itep();
  
loadConfig();
init();

render(<Main />, document.getElementById('app'));
