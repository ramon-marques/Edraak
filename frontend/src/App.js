import './App.css';
import Programs from './Components/Programs';
import Program from './Components/ProgramApplication';

import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Route path="/" component={Programs} exact />
      <Route path="/programs/:id" component={Program} />
    </Router>
  );
}

export default App;
