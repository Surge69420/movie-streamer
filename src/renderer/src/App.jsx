import { useState, useEffect } from 'react'
import LazyLoad from 'react-lazyload';
function App() {

  //vars
  const [movies, setmovies] = useState(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');

  //handle search queries
  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);

    // Send IPC message to main process with the new text
    window.electron.ipcRenderer.send('Query', newQuery);
  };

  //handle no search Query
  useEffect(() => {
    // Sending 'ping' message when component mounts
    window.electron.ipcRenderer.send('ping');

    // Setting up event listener to receive 'pong' message
    // Cleanup function to remove event listener when component unmounts
  }, []);

  //ipc receiving popular movies
  window.electron.ipcRenderer.on("pong", (event, message) => {
    const { data: { movies: { edges } } } = JSON.parse(message);

    const data = edges.map(edge => ({
      imageUrl: edge.node.primaryImage.url,
      title: edge.node.titleText.text,
      id: edge.node.id
    }));
    console.log(data);
    setmovies(data);
  });




  return (
    <center>
      <form action="">
        <div className='search'>
          <span class="search-icon material-symbols-outlined"> search
          </span>
          <input type="search" className='search-Input' placeholder='search' value={searchQuery} onChange={handleInputChange} />
        </div>
      </form>
      <div className='movie-container'>
        {movies.map((movie, index) => (
          <LazyLoad key={movie.id}>
            <div className='movie' style={{ backgroundImage: `url(${movie.imageUrl})` }}>
            </div>
          </LazyLoad>
        ))}

      </div>
    </center>
  )
}

export default App
