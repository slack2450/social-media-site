import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { ProvideAuth } from './use-auth';

import { BrowserRouter as Router } from 'react-router-dom';

import axios from 'axios';

const theme = createTheme({});

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://flaskisbad.com/api/v1' : 'http://localhost:5000/api/v1'
axios.defaults.withCredentials = process.env.NODE_ENV !== 'production';

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline>
      <ProvideAuth>
        <Router>
          <App />
        </Router>
      </ProvideAuth>
    </CssBaseline>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
