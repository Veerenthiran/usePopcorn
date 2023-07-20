import { useEffect, useState } from "react";

const KEY = "4c88865a";

export function useMovies(query, Callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  useEffect(
    function () {
      //   Callback?.();
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
          if (err.name !== "AbortError") {
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
      //   handleClose();
      movie();
      return function () {
        Controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, isError };
}
