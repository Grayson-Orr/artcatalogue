const CatalogueItem = ({ id, item, onChange }) => (
  <div className="catalogue-item">
    <form className="catalogue-item-form" onChange={onChange}>
      <label className="little-label"> Title * </label>
      <div className="title-wrapper">
        <input
          type="text"
          required
          name="title"
          value={item.title}
          placeholder={`Item ${id}`}
          onChange={(e) => onChange(id, { ...item, title: e.target.value })}
        />
      </div>

      <label className="little-label"> Medium * </label>
      <div className="title-wrapper">
        <input
          type="text"
          required
          name="medium"
          value={item.medium}
          placeholder="Medium"
          onChange={(e) => onChange(id, { ...item, medium: e.target.value })}
        />
      </div>

      <label className="little-label"> Dimensions (Optional) </label>
      <div className="dimensions-wrapper">
        <input
          type="text"
          name="dimensions"
          value={item.dimensions}
          placeholder="Dimensions"
          onChange={(e) => onChange(id, { ...item, dimensions: e.target.value })}
        />
        <label className="little-label">
          (Width x Height x Length) Centimetres
        </label>
      </div>

      <input
        type="checkbox"
        name="hasEdition"
        checked={item.hasEdition}
        onChange={(e) => onChange(id, { ...item, hasEdition: e.target.checked })}
      />
      <label className="little-label"> Does your item have editions? (Optional)</label>
      {item.hasEdition && (
        <div className="edition-wrapper">
          <label className="little-label"> How many? </label>
          <input
            type="number"
            name="editions"
            value={item.editions}
            onChange={(e) => onChange(id, { ...item, editions: e.target.value })}
          />
        </div>
      )}

      <input
        type="checkbox"
        name="nfs"
        checked={item.nfs}
        onChange={(e) => onChange(id, { ...item, nfs: e.target.checked })}
      />
      <label className="little-label"> Is your item for sale? * </label>
      {item.nfs && (
        <div className="dollars-wrapper">
          <label className="little-label"> NZ Dollars (NZD) </label>
          <input
            type="number"
            name="value"
            value={item.value}
            onChange={(e) => onChange(id, { ...item, value: e.target.value })}
          />
        </div>
      )}

      <span className="page-info">
        <strong>
          Please note that Otago Polytechnic takes a 25% commission.
        </strong>
      </span>
    </form>
  </div>
);

export default CatalogueItem;
