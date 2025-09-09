import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 7; // har safar 5 ta olish

  useEffect(() => {
    setLoading(true);

    // skip'ni page'ga aylantirish
    const page = skip / limit + 1;

    fetch(
      `https://68ade1bfa0b85b2f2cf4f75a.mockapi.io/movies/MovieApp?page=${page}&limit=${limit}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setMovies((prev) => [...prev, ...res]);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [skip]);

  function handleClick() {
    setSkip((prev) => prev + limit); // skip oshirib boramiz
  }

  return (
    <>
      <div className="grid lg:grid-cols-7 gap-1 md:grid-cols-4 grid-cols-2 p-2">
        {movies.map(({ id, title, poster, description, rating }, index) => (
          <div className="w-full rounded-md border border-gray-400" key={`${id}-${index}`}>
            <img className="w-full rounded-t-md" src={poster} alt={title} width="150" />
            <h2>{title}</h2>
            <p>{description}</p>
            <p>⭐ Rating: {rating}</p>
          </div>
        ))}

        {loading && <h2>Loading...</h2>}
      </div>
      <button className="sticky left-4 bottom-4 border py-0.5 px-4 rounded-md font-bold bg-[#0e6dfc75]" onClick={handleClick} disabled={loading}>
        Load More
      </button>
    </>
  );
}

export default App;
