import { useState, useEffect } from 'react'
import LazyLoad from 'react-lazyload';
function App() {
  const [movies, setmovies] = useState(
    []
  );

  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    window.electron.ipcRenderer.on("pong", (event, message) => {
      const { data: { movies : { edges } } } = JSON.parse(message);

      const data = edges.map(edge => ({
        imageUrl: edge.node.primaryImage.url,
        title: edge.node.titleText.text,
        id: edge.node.id
      }));
      console.log(data);
      setmovies(data);
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners("pong");
    };
  }, []);

 
  

  return (
    <>
      <div className='movie-container'>
        {movies.map((movie, index) => (
          <LazyLoad key={movie.id}>
            <div className='movie' style={{ backgroundImage: `url(${movie.imageUrl})` }}>
            </div>
          </LazyLoad>
        ))}
        
      </div>
    </>
  )
}

export default App
