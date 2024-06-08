import React, { useEffect, useRef, useState, ChangeEvent } from "react";

interface AutocompleteProps {
  suggestions: string[];
}

const Autocomplete: React.FC<AutocompleteProps> = ({ suggestions }) => {
  const [query, setQuery] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (resultsRef.current) {
      setDropdownHeight(resultsRef.current.scrollHeight);
    }
  }, [filteredSuggestions]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Search..."
      />
      <div
        className={`absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg overflow-hidden transition-all duration-300`}
        style={{
          maxHeight:
            filteredSuggestions.length > 0 ? `${dropdownHeight}px` : "0",
          transitionProperty: "max-height",
        }}
      >
        <ul ref={resultsRef} className="divide-y divide-gray-200">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Lab = () => {
  const suggestions = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
  ];

  return (
    <div className="flex w-screen h-screen justify-center items-center flex-col">
      <h1 className="text-xl mb-4">Autocomplete Search Box</h1>
      <Autocomplete suggestions={suggestions} />
    </div>
  );
};

export default Lab;
