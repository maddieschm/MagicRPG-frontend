// components/InputField.js
import React from 'react';

export default function InputField({ label, value, onChange, type = "text", placeholder = "", readOnly = false, min, max, as = "input", rows = 3 }) {
  const InputElement = as === "textarea" ? "textarea" : "input";

  return (
    <div className="input-field-container">
      <label>{label}</label>
      <InputElement
        type={as === "input" ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        max={max}
        rows={as === "textarea" ? rows : undefined}
      />
      <style jsx>{`
        .input-field-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 150px;
        }
        label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #c0c0c0;
          font-size: 0.9em;
        }
        input, select, textarea {
          padding: 8px 10px;
          border: 1px solid rgba(150, 150, 200, 0.4);
          border-radius: 4px;
          font-size: 1em;
          width: 100%;
          box-sizing: border-box;
          background-color: rgba(20, 20, 30, 0.8);
          color: #e0e0e0;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          resize: vertical;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #6a5acd;
          box-shadow: 0 0 8px rgba(106, 90, 205, 0.6);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}