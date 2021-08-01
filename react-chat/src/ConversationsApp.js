import React from "react";
import { Layout, Typography } from "antd";
import { Client as ConversationsClient } from "@twilio/conversations";


import "./assets/Conversation.css";
import "./assets/ConversationSection.css";


import Conversation from "./Conversation";
import { ConversationsList } from "./ConversationsList";
import { HeaderItem } from "./HeaderItem";
import axios from 'axios';



let DEV_URL = '';
if (process.env.NODE_ENV === 'development') {
  DEV_URL = 'http://localhost:3000';
 }


const { Content, Sider, Header } = Layout;
const { Text } = Typography;



class ConversationsApp extends React.Component {
  constructor(props) {
    super(props);

    const name =  localStorage.getItem("name") || "";
    

    this.state = {
      name,
      loggedIn: true,
      token: null,
      conversationsReady: false,
      conversations: [],
      selectedConversationSid: null,
      newMessage: "",
      username: null
    };
  }

  componentDidMount = () => {
    if (this.state.loggedIn) {
      this.getToken();
    }
  };

  

  logIn = (name) => {
    if (name !== "") {
      localStorage.setItem("name", name);
      this.setState({ name, loggedIn: true }, this.getToken);
    }
  };

  getUsername = async () => {
    const username=axios.get(`${DEV_URL}/users`)
            // .then((response) => this.setState({ token: (response.data.token) }))
                      .then((response) => {return response.data})
    return username;
  }

  getToken = async () => {
      var usrname=await this.getUsername();
       axios.get('https://sunglow-dotterel-5846.twil.io/chat-token?identity='+usrname)
            // .then((response) => this.setState({ token: (response.data.token) }))
          .then((response) => {this.setState({ token: response.data.token}, this.initConversations)})
          // .then((response) => console.log(response.data.token))

  };

  initConversations = async () => {
    window.conversationsClient = ConversationsClient;
    this.conversationsClient = await ConversationsClient.create(
      this.state.token
    );
    

    this.conversationsClient.on("connectionStateChanged", (state) => {
      if (state === "connecting")
        this.setState({
          status: "default"
        });
      if (state === "connected") {
        this.setState({
          status: "success"
        });
      }
      if (state === "disconnecting")
        this.setState({
          conversationsReady: false,
          status: "default"
        });
      if (state === "disconnected")
        this.setState({
          conversationsReady: false,
          status: "warning"
        });
      if (state === "denied")
        this.setState({
          conversationsReady: false,
          status: "error"
        });
    });
    this.conversationsClient.on("conversationJoined", (conversation) => {
      this.setState({
        conversations: [...this.state.conversations, conversation]
      });
    });
    this.conversationsClient.on("conversationLeft", (thisConversation) => {
      this.setState({
        conversations: [
          ...this.state.conversations.filter((it) => it !== thisConversation)
        ]
      });
    });
  };

  render() {
    
    const { conversations, selectedConversationSid, status } = this.state;
    const selectedConversation = conversations.find(
      (it) => it.sid === selectedConversationSid
    );
    console.log(selectedConversationSid)

    let conversationContent;
    if (selectedConversation) {
      conversationContent = (
        <Conversation
          conversationProxy={selectedConversation}
          myIdentity={this.state.name}
        />
      );
    } else if (status !== "success") {
      conversationContent = "Loading your conversation!";
    } else {
      conversationContent = "";
    }

    if (this.state.loggedIn) {
      return (
        <div className="conversations-window-wrapper">
          <Header
              style={{ display: "flex", padding: 0, background: "black" }}
            >
              <div
                style={{
                  maxWidth: "250px",
                  width: "100%",
                  display: "flex",
                  
                }}
                
              >
                <HeaderItem style={{ float: "left" }}>
                    <a href="/">
                      <button style={{ float: "left", background: "transparent", color: "white" }}>HOME</button>
                    </a>
                   
                   </HeaderItem>
                   <HeaderItem style={{ float: "right", marginLeft: "auto"}}>
                  
                </HeaderItem>
              </div>
          
              <div
                style={{
                  maxWidth: "250px",
                  width: "100%",
                  display: "flex",
                  float: "right",
                  marginLeft: "50%"
                  
                }}
                
              >
                <HeaderItem >
                  <a href="/dashboard">
                      <button style={{  background: "transparent", color: "white" }}>DASHBOARD</button>
                    </a>
                </HeaderItem>
                <HeaderItem >
                  <a href="/app">
                      <button style={{  background: "transparent", color: "white" }}>INBOX</button>
                    </a>
                </HeaderItem> 
                <HeaderItem >
                  <a href="/logout">
                      <button style={{  background: "transparent", color: "white" }}>LOGOUT</button>
                    </a>
                </HeaderItem>
                
                
                </div>
                </Header>
          <Layout className="conversations-window-container">
          
            <Layout>
              <Sider theme={"light"} width={250}>
                <ConversationsList
                  conversations={conversations}
                  selectedConversationSid={selectedConversationSid}
                  onConversationClick={(item) => {
                    this.setState({ selectedConversationSid: item.sid });
                  }}
                />
              </Sider>
              <Content className="conversation-section">
              
                <div id="SelectedConversation">
                <Header
              style={{ display: "flex", padding: 0, background: "#222222" }}
            >
              <div
                style={{
                  maxWidth: "250px",
                  width: "100%",
                  display: "flex",
                  float: "right",
                  marginLeft: "auto"
                  
                }}
                
              >
              <Text strong style={{ color: "white", float: "right"}}>
                    {selectedConversation &&
                      (selectedConversation.friendlyName ||
                        selectedConversation.sid)}
                  </Text>
                  </div>
                  <HeaderItem >
                  
                  <a href="/report">
                      <button style={{  background: "transparent", color: "white" }}>REPORT</button>
                    </a>
                    
                </HeaderItem>
                <HeaderItem >
                  <a href="/review">
                      <button style={{  background: "transparent", color: "white" }}>REVIEW</button>
                    </a>
                </HeaderItem>
                  </Header>
                  {conversationContent}
                  
                  </div>
                
              </Content>
            </Layout>
          </Layout>
        </div>
      );
    }

    
  }
}

export default ConversationsApp;
