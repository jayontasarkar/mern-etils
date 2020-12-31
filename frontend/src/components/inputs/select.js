import React from 'react';
import { Select as SelectInput } from 'antd';
import './inputs.css';

const { Option } = SelectInput;

const Select = ({ name, placeholder, error, onChange, options }) => {
  const checkError = (error, name) => {
    if (error && error.hasOwnProperty(name)) {
      return error[name];
    }
    return false;
  };

  return (
    <>
      <SelectInput
        className="custom-select"
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        style={{ width: '100%' }}
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options &&
          options.map((opt, key) => (
            <Option value={opt.key} key={key}>
              {opt.value}
            </Option>
          ))}
      </SelectInput>
      {checkError(error, name) && (
        <div className="is-invalid-msg">{error[name]}</div>
      )}
    </>
  );
};

Select.defaultProps = {
  placeholder: '',
};

export default Select;
