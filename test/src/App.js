import './App.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import List from './Components/List';
import Item from './Components/Item';
import { useState } from 'react';

const client = new ApolloClient({
  uri: 'https://graphql-pokeapi.graphcdn.app/',
  cache: new InMemoryCache()
});

function App() {
  const [page, setPage] = useState(1);
    
  const routes = [
    {path: '/item/:id', Component: (props) => <Item {...props} page={page} />},
    {path: '/list/:page', Component: (props) => <List {...props} page={page} setPage={setPage} />},
    {path: '/', Component: () => <Redirect to='/list/1' />},
    {path: '', Component: () => <Redirect to='/list/1' />},
  ]
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Route render={({location}) => (
          <TransitionGroup>
            <CSSTransition key={location.key} timeout={300} classNames="page" unmountOnExit>
              <Switch location={location}>
                {routes.map(({path, Component}) => (
                  <Route key={path} exact path={path} >
                    {({ match }) => (
                        <div className="page flex flex-col items-stretch">
                          <Component match={match} />
                        </div>
                    )}
                  </Route>
                ))}
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )} />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;

