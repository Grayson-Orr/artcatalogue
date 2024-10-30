import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Entries = () => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

  const [message, setMessage] = useState("Loading entries...");
  const [entries, setEntries] = useState([]);
  const [sortByLastName, setSortByLastName] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const res = await fetch(`${apiBaseURL}/catalogue-items/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        const entriesData = data.data || [];
        setEntries(entriesData);
        setMessage(
          entriesData.length > 0
            ? "Select an entry to view details."
            : "No entries found."
        );
      } catch (error) {
        setMessage("Failed to load entries.");
      }
    };
    loadEntries();
  }, []);

  const toggleSortBy = () => {
    setSortByLastName((prevSortByLastName) => !prevSortByLastName);
    const sortedEntries = [...entries].sort((a, b) => {
      if (sortByLastName) {
        return a.items[0]?.lastName?.localeCompare(b.items[0]?.lastName);
      } else {
        return (a.items[0]?.siteMap || 0) - (b.items[0]?.siteMap || 0);
      }
    });
    setEntries(sortedEntries);
  };

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <header>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Entries</h1>
      </header>

      <section>
        <p className="text-gray-700 mb-4">{message}</p>
      </section>

      {entries.length > 0 && (
        <input
          onClick={toggleSortBy}
          type="button"
          value={`Sort By ${sortByLastName ? "SITE Map Number" : "Last Name"}`}
          className="w-full py-2 px-4 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
        />
      )}

      <ul>
        {entries.map((entry) => (
          <Link
            key={entry.uuid}
            title={entry.items[0]?.title}
            to={`/entries/${entry.uuid}`}
          >
            <li className="mb-2 p-4 border border-gray-300 rounded-md transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              <p className="text-gray-700">
                {entry.items[0]?.firstName} {entry.items[0]?.lastName}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">SITE map number:</span>{" "}
                {entry.items[0]?.siteMap}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Section:</span>{" "}
                {entry.items[0]?.section}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Number of items:</span>{" "}
                {entry.count}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </article>
  );
};

export default Entries;
