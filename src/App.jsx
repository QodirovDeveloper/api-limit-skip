import { useEffect, useState } from "react";

const REGIONS = [
  "all",
  "Asia",
  "Canada",
  "France",
  "Germany",
  "Japan",
  "Italy",
  "USA",
  "UK",
];

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [skip, setSkip] = useState(0);
  const limit = 7;
  const [filter, setFilter] = useState("all");

  const page = skip / limit + 1;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Agar "all" bo‘lsa region qo‘shilmaydi
    const url =
      filter === "all"
        ? `https://68bfdfe30b196b9ce1c24ea2.mockapi.io/users?page=${page}&limit=${limit}`
        : `https://68bfdfe30b196b9ce1c24ea2.mockapi.io/users?page=${page}&limit=${limit}&region=${filter}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((res) => {
        setUsers((prev) => [...prev, ...res]);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [skip, filter]);

  function handleChange(e) {
    setFilter(e.target.value);
    setUsers([]); // yangi filterda eski userlarni tozalash
    setSkip(0); // qaytadan page=1 dan boshlash
  }

  function handleClick() {
    setSkip((prev) => prev + limit);
  }

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-end navbar bg-base-300 mb-2">
        <select onChange={handleChange} value={filter} className="select">
          <option value="all">Filter by region</option>
          {REGIONS.map((region) => (
            <option key={region} value={region} className="capitalize">
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Users grid */}
      <div className="grid lg:grid-cols-7 md:grid-cols-4 grid-cols-2 gap-3">
        {users.map(({ id, name, avatar, region }) => (
          <div
            key={id}
            className="rounded-md shadow-2xl text-center bg-base-100 relative"
          >
            <img
              className="w-full object-cover flex rounded-md"
              src={avatar}
              alt={name}
            />
            <div className="absolute left-0 bottom-0 rounded-b-md text-base-100 bg-[#0000006a] w-full">
              <h2 className="font-semibold">{name}</h2>
              <p className="text-sm">Region: {region}</p>
            </div>
          </div>
        ))}

        {loading && (
          <h2 className="col-span-full text-3xl font-light text-center">
            Loading . . .
          </h2>
        )}

        {error && (
          <h2 className="col-span-full text-red-500 text-xl text-center">
            {error}
          </h2>
        )}
      </div>

      {/* Load more */}
      <div className="flex justify-center my-6">
        <button
          className="btn btn-primary"
          aria-label="Load More"
          onClick={handleClick}
          disabled={loading}
        >
          Load More
        </button>
      </div>
    </div>
  );
}

export default App;
