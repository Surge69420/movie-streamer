import { useState, useEffect } from 'react'
function App() {

  const [movies, setmovies] = useState(
    [
      {
        "i": {
          "imageUrl": "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg"
        },
        "l": "Game of Thrones",
      }
    ]
  );

  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    window.electron.ipcRenderer.on("pong", (event, message) => {
      let data = JSON.parse(message);
      setmovies(data.d);
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.electron.ipcRenderer.removeAllListeners("pong");
    };
  }, []);
  console.log(movies)
  const extractedData = movies.map(movie => {
    return {
        imageUrl: movie.i ? movie.i.imageUrl : '',
        title: movie.l
    };
});
  return (
    <>
      <div>
        {extractedData.map((movie, index) => (
          <div key={index}>
            <img src={movie.imageUrl} alt={movie.l} style={{ width: '100px' }} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
