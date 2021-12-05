import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navigation from './components/Navigation';
import Subredits from './components/Subredits';
import Comments from './view/Comments';
import Subreddit from './view/Subredit';

const App = () => {
  const [state, setState] = useState({
    current_menu: 'home',
    isLoggedIn: false,
    user: null,
  });

  return (
    <BrowserRouter>
      <Navigation state={state} setState={setState} />
      <Switch>
        <Route exact path="/">
          <Subredits />
        </Route>
        <Route exact path="/r/:subredditName">
          <Subreddit state={state} />
        </Route>
        <Route path="/r/:subredditName/comments/:docId">
          <Comments state={state} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
