import React from "react";


const TextInputWithLabel = React.forwardRef(
  ({ elementId, labelText, value, onChange }, ref) => {
    return (
      <>
        <label htmlFor={elementId}>{labelText}</label>
        <input
          type="text"
          id={elementId}
          ref={ref}  
          value={value}
          onChange={onChange}
        />
      </>
    );
  }
);

export default TextInputWithLabel;
