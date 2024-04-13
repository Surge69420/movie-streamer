import { useState, useEffect } from 'react'
function App() {
  


  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    window.electron.ipcRenderer.on("pong", (event, message) => {
      console.log(message);
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners("pong");
    };
  }, []);

  return (
    <>

    </>
  )
}

export default App
