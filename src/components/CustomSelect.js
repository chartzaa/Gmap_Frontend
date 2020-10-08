import React from "react";
import AsyncSelect from "react-select/async";

const CustomSelect = ({ options, onChange, defaultValue }) => {

  return (
    <>
      <AsyncSelect
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        name="select-name"
      />
    </>
  );
};

export default CustomSelect;
