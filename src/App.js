import { useEffect, useRef, useState } from "react";
import StarComponent from "./Star";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";
const KEY = "4c88865a";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // const [watched, setWatched] = useState();

  // const [watched, setWatched] = useState(function () {
  //   const ShowingInUI = localStorage.getItem("Watchedmovie");
  //   return JSON.parse(ShowingInUI);
  // });

  // useEffect(function () {
  //   console.log("after intial render");
  // }, []);

  // useEffect(function () {
  //   console.log("after every render");
  // });
  // useEffect(
  //   function () {
  //     console.log("once a query a update then");
  //   },
  //   [query]
  // );

  // console.log("during render");
  function handleClick(id) {
    setSelectedId((selectedid) => (id === selectedid ? null : id));
  }
  function handleClose() {
    setSelectedId(null);
  }
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);

    // how to store watched movie in local storage
    // localStorage.setItem("watched movie", JSON.stringify([...watched, movie]));
    //JSon.stringify is convert number into string
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  const [watched, setWatched] = useLocalStorage([], "Watched");

  const { movies, isError, isLoading } = useMovies(query, handleClose);

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumofSearch onMovies={movies} />
      </Nav>
      <Box>
        {/* element props */}
        {/* <Main element={<LeftOfTheBody onMovies={movies} />} />
         <Main
          element={
            <>
              <RightNavOfTheBody watched={watched} />

              <RightOfTheBody watched={watched} />
            </>
          }
        />  */}
        {/* //children props */}
        <Main>
          {/* {isLoading ? <Loader /> : <LeftOfTheBody onMovies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <LeftOfTheBody onMovies={movies} onhandleClick={handleClick} />
          )}
          {isError && <Errormessage message={isError} />}
        </Main>
        <Main>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onhandleClose={handleClose}
              onHandleAddWatcheMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <RightNavOfTheBody watched={watched} />

              <RightOfTheBody
                watched={watched}
                onHandleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Main>
      </Box>
    </>
  );
}
function Loader() {
  return (
    <div className="loader">
      <p>Loading....</p>
    </div>
  );
}
function Errormessage({ message }) {
  return (
    <div className="error">
      <p>
        <span>🐫</span>
      </p>
      {message}
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🌽</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const refel = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === refel.current) return;
    refel.current.focus();
    setQuery("");
  });

  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={refel}
    />
  );
}
function NumofSearch({ onMovies }) {
  return (
    <p className="num-results">
      Found <strong>{onMovies.length}</strong> results
    </p>
  );
}
function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Box({ children }) {
  return <main className="main">{children}</main>;
}
function Main({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// function WithoutChildren() {
//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
//         {isOpen ? "–" : "+"}
//       </button>
//       {isOpen && children}
//     </div>
//   );
// }

function LeftOfTheBody({ onMovies, onhandleClick }) {
  return (
    <ul className="list list-movies">
      {onMovies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onhandleClick(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🍞</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
function MovieDetails({
  selectedId,
  onhandleClose,
  onHandleAddWatcheMovie,
  watched,
}) {
  const [movieRightDetail, setMovieRightDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  // const [isFalse, setIsFalse] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieRightDetail;

  // console.log(isFalse);
  // useEffect(
  //   function () {
  //     setIsFalse(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  // const isFalse = imdbRating > 8;
  // console.log(isFalse);

  // const [avgRating, setAvgRating] = useState(0);

  const countclick = useRef(0);

  useEffect(
    function () {
      if (userRating) countclick.current = countclick.current + 1;
    },
    [userRating]
  );

  function handlewatchedmovie() {
    const WatchMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime,
      userRating,
      countclickmovie: countclick.current,
    };
    onHandleAddWatcheMovie(WatchMovie);
    onhandleClose();
    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  //includes() method to check if a old word exists in an array
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  //find method returns the value of the first element that passes a test

  useKey("Escape", onhandleClose);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      async function MoviesDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovieRightDetail(data);
        console.log(data);
        setIsLoading(false);
      }
      MoviesDetails();
    },
    [selectedId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onhandleClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movieRightDetail} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          {/* {avgRating} */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarComponent
                    maxstar={10}
                    size={22}
                    color="yellow"
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handlewatchedmovie}>
                      + Add a watch
                    </button>
                  )}
                </>
              ) : (
                <p>You rated the movie 🌟 {watchedUserRating} </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function RightNavOfTheBody({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime}</span>
        </p>
      </div>
    </div>
  );
}
function RightOfTheBody({ watched, onHandleDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime}</span>
              </p>
              <button
                className="btn-delete"
                onClick={() => onHandleDeleteWatched(movie.imdbID)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
