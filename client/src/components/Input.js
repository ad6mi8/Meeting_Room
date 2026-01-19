import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
