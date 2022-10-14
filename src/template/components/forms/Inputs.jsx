export const TextInput = ({
  multiline = 0,
  label = "",
  name = "",
  type = "text",
  value,
  onChange,
  size = "",
  placeholder = "",
}) => {
  return (
    <div className="form-group">
      {multiline < 1 ? (
        <>
          {label !== "" && (
            <label className="label-font" htmlFor={name}>
              {label}
            </label>
          )}
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`form-control ${size === "lg" && "form-control-lg"}`}
            placeholder={placeholder}
          />
        </>
      ) : (
        <>
          {label !== "" && (
            <label className="label-font" htmlFor={name}>
              {label}
            </label>
          )}
          <textarea
            name={name}
            rows={multiline}
            value={value}
            onChange={onChange}
            className="form-control"
            placeholder={placeholder}
          />
        </>
      )}
    </div>
  );
};
export const CustomSelect = ({
  label = "",
  name = "",
  value,
  onChange,
  children,
  size = "",
}) => {
  return (
    <div className="form-group">
      {label !== "" && (
        <label className="label-font" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control ${size === "lg" && "form-control-lg"}`}
      >
        {children}
      </select>
    </div>
  );
};
export const CustomSelectOptions = ({
  value = "",
  label,
  disabled = false,
}) => {
  return (
    <option value={value} disabled={disabled}>
      {label}
    </option>
  );
};
export const Boxes = ({
  label = "",
  value,
  onChange,
  type = "checkbox",
  name = "",
}) => {
  return (
    <div className="form-check">
      <input
        id={name}
        className="form-check-input"
        type={type}
        value={value}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};
export const ImageBox = () => {};
