
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

<nav className="navbar navbar-primary sticky-top flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#west">IT Library</a>

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
                  <Link to="/create" className="nav-link">Add Book</Link>
                </li>
                <div>
          {!authenticated ? (
            <h1>Welcome!</h1>
          ) : (
            <div>
              <h1>You have login succcessfully!</h1>
              <h2>Welcome {this.state.user.user.role}!</h2>
            </div>
          )}
        </div>
              </ul>
              <div>
        
        </div>

            <Route path="/" exact/>
    
            
            <Route path='/edit/:id' />
            <Route path='/create'  />
            <Route path='/show/:id' />
      
              
              
              
    
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <Route path="/" exact component={List}/> 
   
<Route path='/show/:id' component={Show} />
  {authenticated && (this.state.user.user.role ==="teacher")?(<Route path='/edit/:id' component={Edit} />):(null)
  
}

<Route path='/create' render={() => (
  authenticated && (this.state.user.user.role ==="teacher")? (
    <Create />
  ) : (
    
    <Redirect to="/"/>
  )
)} />
       
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