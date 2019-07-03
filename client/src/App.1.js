
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import React, { Component } from 'react';
import Header from "./components/Header";
import List from "./components/List"
import Edit from "./components/Edit"
import Create from "./components/Create"
import Show from "./components/Show"
import './utils/bootstrap.min.css'
import './utils/dashboard.css'
// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>Books</div>,
    main: List
  },
  {
    path: "/bubblegum",
    sidebar: () => <div>Add Book</div>,
    main: Create
  }
];



class App extends Component{


  state = {
    user: {},
    error: null,
    authenticated: false
  };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    fetch("http://localhost:8080/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          authenticated: true,
          user: responseJson.user
        });
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }
 
    render() {
      const { authenticated } = this.state;
  return (
    <Router>

<nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">IT Library</a>
      <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"/>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={this._handleNotAuthenticated}
        />
      
		
		
		</li>
      </ul>
    </nav>


      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/" className="nav-link">List</Link>
                </li>
                <li className="nav-item">
                  <Link to="/bubblegum" className="nav-link">Add Book</Link>
                </li>
                <li className="nav-item">
                  <Link to="/shoelaces" className="nav-link">edit Book</Link>
                </li>
              </ul>
              <div>
        
        </div>


              {routes.map((route, index) => (
                // You can render a <Route> in as many places
                // as you want in your app. It will render along
                // with any other <Route>s that also match the URL.
                // So, a sidebar or breadcrumbs or anything else
                // that requires you to render multiple things
                // in multiple places at the same URL is nothing
                // more than multiple <Route>s.
               
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  
                />
                
              ))}
              <Route path="/shoelaces"/>
    
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
            <Route path="/shoelaces" render={() => (
  authenticated ? (
    <Welcome name="Sara" />
  ) : (
    <Redirect to="/"/>
  )
)}  />
<Route path='/show/:id' component={Show} />
          </main>
        </div>
      </div>
    </Router>
  );}

  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}

export default App;