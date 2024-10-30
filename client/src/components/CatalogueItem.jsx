import { useState } from "react";

const CatalogueItem = ({ id, item, onChange, onDelete, submitted, errors }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleChange = (field, value) => {
    onChange(id, { ...item, [field]: value });
  };

  return (
    <article className="mb-6 p-4 border rounded-lg shadow-md bg-white">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Item {id + 1}</h2>
        <div className="space-x-2">
          <button
            type="button"
            onClick={toggleOpen}
            className="text-sm text-blue-600 hover:underline"
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </header>

      {isOpen && (
        <form className="mt-4">
          <fieldset className="mb-4">
            <legend className="text-lg font-medium text-gray-700">
              Basic Information
            </legend>

            <label className="block text-gray-700 mt-2">Title</label>
            <input
              type="text"
              name="title"
              value={item.title}
              placeholder={`Item ${id + 1}`}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {submitted && errors?.item?.title && (
              <p className="text-red-500">{errors?.item?.title}</p>
            )}

            <label className="block text-gray-700 mt-2">Medium</label>
            <input
              type="text"
              name="medium"
              value={item.medium}
              placeholder="Medium"
              onChange={(e) => handleChange("medium", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {submitted && errors?.item?.medium && (
              <p className="text-red-500">{errors?.item?.medium}</p>
            )}

            <label className="block text-gray-700 mt-2">
              Dimensions (Width x Height x Length in cm)
            </label>
            <input
              type="text"
              name="dimensions"
              value={item.dimensions}
              placeholder="Dimensions"
              onChange={(e) => handleChange("dimensions", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {submitted && errors?.item?.dimensions && (
              <p className="text-red-500">{errors?.item?.dimensions}</p>
            )}
          </fieldset>

          <fieldset className="mb-4">
            <legend className="text-lg font-medium text-gray-700">
              Edition Information
            </legend>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="hasEdition"
                checked={item.hasEdition}
                onChange={(e) => handleChange("hasEdition", e.target.checked)}
                className="mr-2"
              />
              <label className="text-gray-700">
                Does your item have editions?
              </label>
            </div>

            {item.hasEdition && (
              <>
                <label className="block text-gray-700 mt-2">How many?</label>
                <input
                  type="number"
                  name="editions"
                  value={item.editions}
                  onChange={(e) => handleChange("editions", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                {submitted && errors?.item?.editions && (
                  <p className="text-red-500">{errors?.item?.editions}</p>
                )}
              </>
            )}
          </fieldset>

          <fieldset className="mb-4">
            <legend className="text-lg font-medium text-gray-700">
              Sale Information
            </legend>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="nfs"
                checked={item.nfs}
                onChange={(e) => handleChange("nfs", e.target.checked)}
                className="mr-2"
              />
              <label className="text-gray-700">Is your item for sale?</label>
            </div>

            {item.nfs && (
              <>
                <label className="block text-gray-700 mt-2">
                  Value (NZ Dollars)
                </label>
                <input
                  type="number"
                  name="value"
                  value={item.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                {submitted && submitted && errors?.item?.value && (
                  <p className="text-red-500">
                    {submitted && errors?.item?.value}
                  </p>
                )}
              </>
            )}
          </fieldset>
        </form>
      )}
    </article>
  );
};

export default CatalogueItem;
