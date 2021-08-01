import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import ConversationsApp from './ConversationsApp';
import './assets/App.css';
import 'antd/dist/antd.css';



class App extends Component {
  constructor(props) {
   super(props);
   this.state = {
     
   };
  }
  // async compon() {
  //  // Call self-hosted API to get users response
   
  //  axios.get(`${DEV_URL}/users`)
  //           // .then((response) => this.setState({ token: (response.data.token) }))
  //         .then((response) => {this.setState({ user: response.data})})
  //         // .then((response) => console.log(response.data))
   
  // // console.log(this.state.user)
  //   // return this.state.user
  // }
  render() {
    
    return <ConversationsApp />
  }
 }
 export default App;
