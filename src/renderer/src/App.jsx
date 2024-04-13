import { useState, useEffect } from 'react'
function App() {
  const [movies, setmovies] = useState(
    []
  );

  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    window.electron.ipcRenderer.on("pong", (event, message) => {
      let data = JSON.parse(message);
      data = data.data;
      data = data.movies;
      data = data.edges
      Object.keys(data).forEach(key => {
        data[key] = data[key].node;
      });
      setmovies(data);
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners("pong");
    };
  }, []);

  console.log(movies)
  const extractedData = movies.map(movie => {
    return {
      imageUrl: movie.primaryImage.url,
      title: movie.titleText.text,
      id: movie.id
    };
  });
  return (
    <>
      <div className='movie-container'>
        {extractedData.map((movie, index) => (
          <div key={movie.id} className='movie'>
            <img src={movie.imageUrl} alt={movie.l} style={{ width: '100px' }} />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
