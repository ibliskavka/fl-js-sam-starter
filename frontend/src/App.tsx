import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./components/base/Header";
import ProtectedRoute from "./components/base/ProtectedRoute";
import Logout from "./components/Logout";
import { Home } from "./components/Home";
import { AppContextProvider } from "./contexts/AppContextProvider";

export default class App extends React.Component {
  render() {
    return (
      <AppContextProvider>
        <div className="App">
          <Router>
            <Header />
            <Switch>
              <Route path="/logout" component={Logout} />
              <ProtectedRoute path="/" component={Home} />
            </Switch>
          </Router>
        </div>
      </AppContextProvider>
    );
  }
}
