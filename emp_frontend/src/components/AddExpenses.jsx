import { useState } from "react";
import Button from "@mui/material/Button";

const AddExpenses = () => {
  const [label, setLabel] = useState("");
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handlePlaceholderChange = (e) => {
    setPlaceholder(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Add your expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex">
          <label htmlFor="label" className="w-20">
            label
          </label>
          <input
            type="text"
            id="label"
            value={label}
            onChange={handleLabelChange}
            className="flex-1 border rounded-md px-3 py-2"
          />
          <span className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <div className="flex">
          <label htmlFor="placeholder1  " className="w-20">
            label
          </label>
          <input
            type="text"
            id="placeholder1"
            value={placeholder}
            onChange={handlePlaceholderChange}
            className="flex-1 border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex">
          <label htmlFor="input" className="w-20">
            label
          </label>
          <input
            type="text"
            id="input"
            value={input}
            onChange={handleInputChange}
            className="flex-1 border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex">
          <label htmlFor="placeholder2" className="w-20">
            label
          </label>
          <input
            type="text"
            id="placeholder2"
            value={placeholder}
            onChange={handlePlaceholderChange}
            className="flex-1 border rounded-md px-3 py-2"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddExpenses;
