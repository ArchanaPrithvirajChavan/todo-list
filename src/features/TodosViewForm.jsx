import React, { useState, useEffect } from "react";

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
    <form style={{ marginBottom: "20px" }} onSubmit={preventRefresh}>
      {/* --- Search Todos --- */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="search" style={{ marginRight: "10px" }}>
          Search todos:
        </label>

        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
          placeholder="Type to search..."
        />

        <button
          type="button"
          onClick={() => setLocalQueryString("")}
          style={{ marginLeft: "10px" }}
        >
          Clear
        </button>
      </div>

      {/* --- Sort Controls --- */}
      <div>
        <label htmlFor="sortField" style={{ marginRight: "10px" }}>
          Sort by:
        </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="createdTime">Created Time</option>
          <option value="title">Title</option>
          <option value="isCompleted">Completed</option>
        </select>

        <label
          htmlFor="sortDirection"
          style={{ marginLeft: "20px", marginRight: "10px" }}
        >
          Direction:
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
