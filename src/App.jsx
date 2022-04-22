import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Install from "./components/Install";
import Home from "./components/Home";

function App() {

  //Check if Metamask is installed in the browser
  //Metamask provide a global object called 'ethereum'
  if(window.ethereum){
    return <Home/>
  } else {
    return <Install/>
  }
}

export default App
