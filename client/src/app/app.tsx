import * as React from 'react';
import {render} from 'react-dom';
import {init} from './State';
import Main from './Main'; // Our custom react component
import itep =require('react-tap-event-plugin');

itep();
  
init();

render(<Main />, document.getElementById('app'));
