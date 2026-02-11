import React from "react";
import styled from "styled-components";

/* Styled Components */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const StyledLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 600;
`;

const StyledInput = styled.input`
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

/* Component */
const TextInputWithLabel = React.forwardRef(
  ({ elementId, labelText, value, onChange }, ref) => {
    return (
      <Wrapper>
        <StyledLabel htmlFor={elementId}>
          {labelText}
        </StyledLabel>

        <StyledInput
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
      </Wrapper>
    );
  }
);

export default TextInputWithLabel;
