import React from 'react';
import { Input } from 'antd';

const Textbox = ({
  name,
  value,
  type,
  placeholder,
  error,
  onChange,
  maxLength,
}) => {
  const checkError = (error, name) => {
    if (error && error.hasOwnProperty(name)) {
      return error[name];
    }
    return false;
  };

  return (
    <>
      <Input
        type={type}
        placeholder={placeholder}
        className={
          'text-input' + (checkError(error, name) ? ' is-invalid' : '')
        }
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
      {checkError(error, name) && (
        <div className="is-invalid-msg">{error[name]}</div>
      )}
    </>
  );
};

Textbox.defaultProps = {
  type: 'text',
  placeholder: '',
};

export default Textbox;
