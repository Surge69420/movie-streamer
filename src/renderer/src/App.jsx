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
    if(newQuery === ''){
      console.log("null")
    }
    // Send IPC message to main process with the new text
    window.electron.ipcRenderer.send(newQuery !== '' ? 'Query' : 'ping', newQuery);
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
  window.electron.ipcRenderer.on("QueryResults", (event, message) => {
    let data = JSON.parse(message);
    data = data.d;
    const moviesOnly = data.filter(item => item.qid === "movie");
    data = moviesOnly.map(movie => ({
      imageUrl: movie.i.imageUrl,
      title: movie.l,
      id: movie.id
    }));
    setmovies(data);
    console.log(data)
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
