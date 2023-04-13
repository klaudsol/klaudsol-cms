const AppRadioButton = ({ className, title, name, disabled, value, onChange, checked }) => {
    return (
        <label className="general-input-checkbox">
            <input
                type="radio"
                name={name}
                disabled={disabled}
                value={value}
                checked={checked}
                onChange={onChange}
                className="general-input-checkbox__checkbox"
            />
            <span className="general-input-checkbox__text">
                {title}
            </span>
        </label>
    )
};

export default AppRadioButton;
