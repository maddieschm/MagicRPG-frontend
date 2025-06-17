// components/BackstorySection.js
import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

export default function BackstorySection({ backstory, onCharacterChange }) {
  const heritageOptions = ["Magic Blood", "Mixed Blood", "Non-Magic Born", "Unknown"];
  const houseOptions = ["", "House of Valor", "House of Loyalty", "House of Wit", "House of Ambition", "No house", "Unknown"];
  const statusOptions = ["Alive", "Deceased", "Unknown"];

  const maxParentsAllowed = 8;

  const updateBackstory = (updatedBackstory) => {
    onCharacterChange(prevCharacter => ({
      ...prevCharacter,
      characterBackstory: updatedBackstory,
    }));
  };

  const handleParentFieldChange = (index, field, value) => {
    const updatedParents = backstory.parents.map((parent, i) =>
      i === index ? { ...parent, [field]: value } : parent
    );
    updateBackstory({ ...backstory, parents: updatedParents });
  };

  const handleAddParent = () => {
    if (backstory.parents.length >= maxParentsAllowed) {
      alert(`You cannot add more than ${maxParentsAllowed} parents.`);
      return;
    }

    const newParent = {
      label: `New Parent ${backstory.parents.length + 1}`,
      gender: "",
      name: "",
      heritage: "Unknown",
      house: "Unknown",
      status: "Unknown",
    };
    updateBackstory({
      ...backstory,
      parents: [...backstory.parents, newParent],
    });
  };

  const handleRemoveParent = (indexToRemove) => {
    const updatedParents = backstory.parents.filter((_, i) => i !== indexToRemove);
    const relabeledParents = updatedParents.map((parent, index) => {
        if (parent.label.startsWith("New Parent")) {
            return { ...parent, label: `New Parent ${index + 1}` };
        }
        return parent;
    });
    updateBackstory({ ...backstory, parents: relabeledParents });
  };

  const handleAdditionalInfoChange = (e) => {
    updateBackstory({ ...backstory, additionalInfo: e.target.value });
  };

  return (
    <div className="section-card backstory-section">
      <h3>Character Backstory ({backstory.parents.length} parents / {maxParentsAllowed} max)</h3>

      <div className="backstory-parents-container">
        {backstory.parents.map((parent, index) => (
          <div key={index} className="backstory-parent-card">
            <InputField
              label="Birth Parent"
              value={parent.label || `Parent ${index + 1}`}
              onChange={(e) => handleParentFieldChange(index, 'label', e.target.value)}
              placeholder={`Parent ${index + 1}`}
            />
            <InputField
              label="Name"
              value={parent.name}
              onChange={(e) => handleParentFieldChange(index, 'name', e.target.value)}
            />
            <InputField
              label="Gender"
              value={parent.gender}
              onChange={(e) => handleParentFieldChange(index, 'gender', e.target.value)}
              placeholder="e.g., Male, Female, Non-binary"
            />
            <SelectField
              label="Heritage"
              value={parent.heritage}
              options={heritageOptions}
              onChange={(e) => handleParentFieldChange(index, 'heritage', e.target.value)}
            />
            <SelectField
              label="House"
              value={parent.house}
              options={houseOptions}
              onChange={(e) => handleParentFieldChange(index, 'house', e.target.value)}
            />
            <SelectField
              label="Status"
              value={parent.status}
              options={statusOptions}
              onChange={(e) => handleParentFieldChange(index, 'status', e.target.value)}
            />
            {(index >= 2 || parent.label.startsWith("New Parent")) && (
                <button onClick={() => handleRemoveParent(index)} className="remove-button">
                    Remove Parent
                </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddParent}
        className="add-parent-button"
        disabled={backstory.parents.length >= maxParentsAllowed}
      >
        Add Parent
      </button>

      {/* Additional Info / Detailed Backstory */}
      <div className="additional-info-field">
        <label>Additional Backstory Details</label>
        <textarea
          value={backstory.additionalInfo}
          onChange={handleAdditionalInfoChange}
          rows="10"
          placeholder="e.g., Family: Shadow cultists attacked; grew up in the alleys and had to resort to petty thievery to survive... Companion: Loyal dog; rescued from neglectful mundane owners... Distinctive Mark: Lightning-bolt scar."
        ></textarea>
      </div>

      <style jsx>{`
        .section-card {
          background-color: rgba(50, 50, 80, 0.6);
          padding: 15px;
          border-radius: 6px;
          border: 1px solid rgba(100, 100, 150, 0.3);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), inset 0 0 3px rgba(255, 255, 255, 0.05);
        }
        h3 {
          margin-top: 0;
          color: #b0b0b0;
          border-bottom: 1px solid rgba(100, 100, 150, 0.2);
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #b0b0b0;
          font-size: 1.1em;
          grid-column: 1 / -1;
        }
        .backstory-parents-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        .backstory-parent-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 15px;
          border: 1px solid rgba(120, 120, 180, 0.3);
          border-radius: 4px;
          background-color: rgba(40, 40, 70, 0.8);
          box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
        }
        .additional-info-field {
            margin-top: 20px;
        }
        .additional-info-field label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #c0c0c0;
          font-size: 0.9em;
          display: block;
        }
        .add-parent-button {
          background-color: #6a5acd;
          color: #e0e0e0;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .add-parent-button:hover:not(:disabled) {
          background-color: #7b68ee;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }
        .add-parent-button:disabled {
            background-color: rgba(100, 100, 150, 0.3);
            cursor: not-allowed;
            color: rgba(224, 224, 224, 0.5);
        }
        .remove-button {
          background-color: #b33939;
          color: #e0e0e0;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
          margin-top: 10px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .remove-button:hover {
          background-color: #cc5c5c;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}