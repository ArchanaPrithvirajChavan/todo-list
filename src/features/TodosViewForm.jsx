import React, { useState, useEffect } from "react";
import styled from "styled-components"

const StyledForm = styled.form`
  background-color: brown;
  padding: 5%;
  text-align: center;
`;
const StyledButton =styled.button`
margin-left:10px;
color:blue;
padding:2%`;   

const StyledLabel= styled.label`
text-align: end;
    color: rgb(236, 234, 238);
    padding: 1%;`
    const SearchSection = styled.div`
  margin-bottom: 15px;
`;

const SortSection = styled.div`
  margin-top: 10px;
`;



function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  //  Local state for debounce
  const [localQueryString, setLocalQueryString] = useState(queryString);

  // Prevent page refresh if user presses Enter
  function preventRefresh(event) {
    event.preventDefault();
  }

  //  Debounce effect
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    // Cleanup previous timeout
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    
    <StyledForm onSubmit={preventRefresh}>
      {/* --- Search Todos --- */}
      <SearchSection>
        <StyledLabel htmlFor="search">
          Search todos:
        </StyledLabel>

        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
          placeholder="Type to search..."
        />

        <StyledButton
          type="button"
          onClick={() => setLocalQueryString("")}
          >
         Clear
        </StyledButton>
       </SearchSection>
      <SortSection>
        <StyledLabel htmlFor="sortField" >
          Sort by:
        </StyledLabel>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="createdTime">Created Time</option>
          <option value="title">Title</option>
          <option value="isCompleted">Completed</option>
        </select>

        <StyledLabel
          htmlFor="sortDirection"
        >
          Direction:
        </StyledLabel>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </SortSection>
    </StyledForm>
  );
}

export default TodosViewForm;
