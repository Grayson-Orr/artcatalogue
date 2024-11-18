import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Entry = () => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const { uuid } = useParams();

  const [message, setMessage] = useState("Loading entry...");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const res = await fetch(`${apiBaseURL}/catalogue-items/${uuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setEntries(data.data || []);
        setMessage(
          data.data && data.data.length > 0 ? "" : "No entries found."
        );
      } catch (error) {
        setMessage("Failed to load entry.");
      }
    };

    loadEntry();
  }, [apiBaseURL, uuid]);

  const hasEditions = entries.some(
    (entry) => entry.editions && entry.editions > 0
  );

  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white shadow-md rounded-md print:max-w-full print:my-0 print:p-4 print:shadow-none">
      <style>
        {`
          @media print {
            body {
              font-size: 14pt;
              line-height: 1.5;
            }
            .print-hidden {
              display: none !important;
            }
            th, td {
              padding: 8px;
              border: 1px solid #000;
            }
          }
        `}
      </style>

      <p className="text-gray-700 mb-6">{message}</p>
      {entries.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700">
              Dunedin School of Art - SITE 2024
            </h1>
          </div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold text-gray-700">
                {entries[0].firstName} {entries[0].lastName}
              </p>
              <p className="text-lg text-gray-600">{entries[0].section}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-semibold text-gray-700">SITE map:</p>
              <span className="ml-2 text-lg text-gray-600">
                {entries[0].siteMap}
              </span>
            </div>
          </div>
          <hr className="border-gray-300 my-6" />
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 border-collapse print:border-none">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4 text-lg">ID</th>
                  <th className="p-4 text-lg">Title</th>
                  <th className="p-4 text-lg">Medium</th>
                  <th className="p-4 text-lg">Price</th>
                  <th className="p-4 text-lg">Dimensions</th>
                  {hasEditions && <th className="p-4 text-lg">Editions</th>}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="text-gray-700 border-b">
                    <td className="p-4 text-center text-lg">{entry.id}</td>
                    <td className="p-4 text-center text-lg">{entry.title}</td>
                    <td className="p-4 text-center text-lg">{entry.medium}</td>
                    <td className="p-4 text-center text-lg">
                      {!entry.nfs ? "Not for sale." : `$${entry.value}`}
                    </td>
                    <td className="p-4 text-center text-lg">
                      {entry.dimensions}
                    </td>
                    {hasEditions && (
                      <td className="p-4 flex justify-center gap-2">
                        {[...Array(entry.editions || 0)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entry;
