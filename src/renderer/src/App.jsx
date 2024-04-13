import { useState, useEffect } from 'react'
function App() {
  
  const [movies, setmovies] = useState({});
  
  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    window.electron.ipcRenderer.on("pong", (event, message) => {
      setmovies(JSON.parse(message));
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners("pong");
    };
  }, []);
  console.log(movies)
  return (
    <>

    </>
  )
}

export default App
