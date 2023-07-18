import { toBeRequired } from "@testing-library/jest-dom/matchers";
import { useEffect, useState } from "react";
import StarComponent from "./Star";
const KEY = "4c88865a";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
    return setSelectedId((selectedid) => (id === selectedid ? null : id));
  }
  function handleClose() {
    return setSelectedId(null);
  }
  function handleAddWatchedMovie(movie) {
    return setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      const Controller = new AbortController();
      async function movie() {
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query},`,
            { signal: Controller.signal }
          );
          if (!res.ok) throw new Error("something went wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setIsError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortEError") {
            setIsError(err.message);
          }
          // setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }
      handleClose();
      movie();
      return function () {
        Controller.abort();
      };
    },
    [query]
  );

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
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
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

  function handlewatchedmovie() {
    const WatchMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime,
      userRating,
    };
    onHandleAddWatcheMovie(WatchMovie);
    onhandleClose();
  }
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  //includes() method to check if a old word exists in an array
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  //find method returns the value of the first element that passes a test

  useEffect(
    function () {
      function Callback(e) {
        if (e.code === "Escape") {
          onhandleClose();
        }
      }

      document.addEventListener("keydown", Callback);

      return function () {
        document.removeEventListener("keydown", Callback);
      };
    },
    [onhandleClose]
  );

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
