import React, { useState, useEffect } from 'react';
import CatalogueItem from './CatalogueItem';
// import repo from '../repo';

const ArtForm = () => {
  const [message, setMessage] = useState(null);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    section: '',
    siteMap: 1,
  });
  const [selectedItem, setSelectedItem] = useState(1);
  const [items, setItems] = useState([]); // State for catalogue items

  useEffect(() => {
    const load = async () => {
      try {
        const res = await repo.getInfo();
        setSections(res.data.sections);
        setMediums(res.data.mediums);
        setFormData((prevFormData) => ({
          ...prevFormData,
          section: res.data.sections[0],
        }));
      } catch (error) {
        onError(error);
      }
    };
    load();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSiteMapChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 100) value = 100;
    if (value < 1) value = 1;
    setFormData((prevFormData) => ({ ...prevFormData, siteMap: value }));
  };

  const addItem = () => {
    // Add a new item with default values
    const newItem = {
      id: items.length + 1,
      title: '',
      medium: '',
      dimensions: '',
      hasEdition: false,
      editions: '',
      nfs: false,
      value: '',
    };
    setItems([...items, newItem]);
    setSelectedItem(newItem.id);
  };

  const handleItemChange = (id, updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? updatedItem : item))
    );
  };

  const onError = (error) => {
    console.error(error);
    setMessage(
      error.response && error.response.data
        ? error.response.data
        : 'Unknown error, server may be down.'
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm('Press OK if your information is correct?')) {
      setMessage('Submitting...');
      try {
        await repo.submitForm({ ...formData, items });
        window.location.reload();
        console.log('Thing was saved to the database.');
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="art-form">
      <h1>Dunedin School of Art - SITE 2022</h1>

      <span className="page-info">
        You can find your entry information here -{' '}
        <a
          href="https://dunedin-school-of-art-site-22.herokuapp.com/entries"
          target="_blank"
          rel="noreferrer"
        >
          https://dunedin-school-of-art-site-22.herokuapp.com/entries
        </a>
      </span>

      <hr />

      <span className="page-info">
        Fill out the following form to add your art to the catalogue.
      </span>

      <p className="page-message">{message}</p>
      <form autoComplete="off" className="art-form-form" onSubmit={onSubmit}>
        {/* Form fields for personal information */}
        <div className="details-wrapper">
          <label>Entry Information</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        {/* Catalogue Items */}
        <label> Add Catalogue Items </label>
        <div className="catalogue-items-wrapper">
          <ul className="catalogue-item-list">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={selectedItem === item.id ? 'selected' : ''}
              >
                Item {item.id}
              </li>
            ))}
          </ul>
          {items.map((item) => (
            <CatalogueItem
              key={item.id}
              id={item.id}
              item={item}
              onChange={handleItemChange}
            />
          ))}
        </div>
        <button type="button" onClick={addItem} className="add-item-btn">
          Create Another Item
        </button>
        <hr />
        <div className="submit-wrapper">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default ArtForm;
