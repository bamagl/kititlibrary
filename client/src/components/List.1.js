import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_BOOKS = gql`
query book($searchId: String){
    books(filter:$searchId) {
      _id
      title
      author
    }
  }
`;


class List extends Component {
  state = {
    query: '',
  }
 
  handleInputChange = () => {
    this.setState({
      query: this.search.value
    })
    
  }

  render() {
    return (
      <Query query={GET_BOOKS} variables={{ searchId: this.state.query }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
    
          return (
           
            <div className="container">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">
                  <input
         placeholder="Search for..."
         ref={input => this.search = input}
         onKeyPress={this.handleInputChange}
       />
                    LIST OF BOOKS
       
                  </h3>
                  
                </div>
                <div className="panel-body">
                  <table className="table table-stripe">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.books.map((book, index) => (
                        <tr key={index}>
                          <td><Link to={`/show/${book._id}`}>{book.title}</Link></td>
                          <td>{book.author}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default List;