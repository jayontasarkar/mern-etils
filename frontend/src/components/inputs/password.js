import React from "react";
import { Input } from 'antd';

const PasswordBox = ({
  name,
  value,
  type,
  placeholder,
  error,
  onChange
}) => {
  const checkError = (error, name) => {
    if (error && error.hasOwnProperty(name)) {
        return error[name];
    }
    return false;
  };

  return (
    <>
      <Input.Password
        type={type}
        placeholder={ placeholder }
        className={ 'text-input' + (checkError(error, name)  ? ' is-invalid' : '') }
        name={name}
        value={value}
        onChange={onChange}
      />
      { checkError(error, name) && <div className="is-invalid-msg">{ error[name] }</div> }
    </>
  );
};

PasswordBox.defaultProps = {
  type: "password",
  placeholder: "",
};

export default PasswordBox;