// components/CharacterSheet.js
import React, { useEffect } from 'react';
import CharacterHeader from './CharacterHeader';
import TraitsSection from './TraitsSection';
import AbilitiesSection from './AbilitiesSection';
import HealthCurrencySection from './HealthCurrencySection';
import SpellsSection from './SpellsSection';
import InventorySection from './InventorySection';
import BackstorySection from './BackstorySection';
import PetStatsSection from './PetStatsSection';
import allSpells from '../data/spells.json';
import CollapsibleSectionWrapper from './CollapsibleSectionWrapper';

export default function CharacterSheet({ character, onCharacterChange }) {
  // Helper functions (updateCharacter, updateNestedField, updateDeepNestedField, updateArrayOfObjects)
  const updateCharacter = (field, value) => {
    onCharacterChange(prevCharacter => ({ ...prevCharacter, [field]: value }));
  };

  const updateNestedField = (section, field, value) => {
    onCharacterChange(prevCharacter => ({
      ...prevCharacter,
      [section]: {
        ...prevCharacter[section],
        [field]: value,
      },
    }));
  };

  const updateDeepNestedField = (section1, section2, field, value) => {
    onCharacterChange(prevCharacter => ({
      ...prevCharacter,
      [section1]: {
        ...prevCharacter[section1],
        [section2]: {
          ...prevCharacter[section1][section2],
          [field]: value,
        },
      },
    }));
  };

  const updateArrayOfObjects = (arrayName, index, field, value) => {
    onCharacterChange(prevCharacter => {
      const newArray = [...prevCharacter[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prevCharacter, [arrayName]: newArray };
    });
  };

  // List of standard starting inventory items
  const starterInventoryItems = [
    { item: "Bottle of black ink", quantity: 1 },
    { item: "Writing quills", quantity: 2 },
    { item: "Durable Beast-Hide Gloves", quantity: 1 },
    { item: "Scales [weights] for measuring", quantity: 1 },
    { item: "Cauldron", quantity: 1 }
  ];

  // EFFECT TO AUTO-POPULATE 1ST YEAR SPELLS
  useEffect(() => {
    const characterYearInt = parseInt(character.year) || 0;
    if (characterYearInt === 1 && character.spells.length === 0) {
      const firstYearSpells = allSpells.filter(spell => spell.year === "1st");
      if (firstYearSpells.length > 0) {
        onCharacterChange(prevCharacter => ({
          ...prevCharacter,
          spells: firstYearSpells
        }));
      }
    }
  }, [character.year, character.spells.length, onCharacterChange]);

  // EFFECT TO AUTO-POPULATE STARTING INVENTORY ITEMS
  useEffect(() => {
    if (character.inventory.length === 0) {
      if (starterInventoryItems.length > 0) {
        onCharacterChange(prevCharacter => ({
          ...prevCharacter,
          inventory: starterInventoryItems
        }));
      }
    }
  }, [character.inventory.length, onCharacterChange]);

  // Determine the house class for styling the headings
  const houseClass = character.academyHouse ? character.academyHouse.toLowerCase() : '';

  return (
    <div className={`character-sheet ${houseClass}`}>
      {/* Character Header Section */}
      <CollapsibleSectionWrapper title="Character Header" defaultOpen={true}>
        <CharacterHeader
          character={character}
          updateCharacter={updateCharacter}
          updateNestedField={updateNestedField}
        />
      </CollapsibleSectionWrapper>

      {/* Main Stats Grid: Traits, Abilities, Health/Currency, Pet Stats */}
      {/* This grid is explicitly set to 2 columns in the CSS below */}
      <div className="main-stats-grid">
        {/* Row 1: Traits and Abilities */}
        <CollapsibleSectionWrapper title="Traits" defaultOpen={true}>
          <TraitsSection
            character={character}
            onCharacterChange={onCharacterChange}
          />
        </CollapsibleSectionWrapper>

        <CollapsibleSectionWrapper title="Abilities" defaultOpen={false}>
          <AbilitiesSection
            traits={character.traits}
          />
        </CollapsibleSectionWrapper>

        {/* Row 2: Health & Currency and Pet Stats */}
        <CollapsibleSectionWrapper title="Health & Currency" defaultOpen={false}>
          <HealthCurrencySection
            healthPoints={character.healthPoints}
            turnOrder={character.turnOrder}
            currency={character.currency}
            updateNestedField={updateNestedField}
            updateDeepNestedField={updateDeepNestedField}
          />
        </CollapsibleSectionWrapper>

        <CollapsibleSectionWrapper title="Pet Stats" defaultOpen={false}>
          <PetStatsSection
            petStats={character.petStats}
            updateNestedField={(field, value) => updateNestedField('petStats', field, value)}
            updateDeepNestedField={updateDeepNestedField}
          />
        </CollapsibleSectionWrapper>
      </div>

      {/* Spells Section */}
      <CollapsibleSectionWrapper title="Spells" defaultOpen={false}>
        <SpellsSection
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </CollapsibleSectionWrapper>

      {/* Inventory Section */}
      <CollapsibleSectionWrapper title="Inventory" defaultOpen={false}>
        <InventorySection
          inventory={character.inventory}
          onCharacterChange={onCharacterChange}
        />
      </CollapsibleSectionWrapper>

      {/* Character Backstory Section */}
      <CollapsibleSectionWrapper title="Character Backstory" defaultOpen={false}>
        <BackstorySection
          backstory={character.characterBackstory}
          onCharacterChange={onCharacterChange}
        />
      </CollapsibleSectionWrapper>

      {/* Global Styles for House-Themed Headings and Dark Mode Components */}
      <style jsx global>{`
        /* IMPORTANT: Adjust .section-card and .character-sheet styles.
           The CollapsibleSectionWrapper will now provide the outer box and padding for each section. */
        .character-sheet .section-card {
           padding: 0;
           border: none;
           background-color: transparent;
           box-shadow: none;
           border-radius: 0;
        }
        .character-sheet .section-card h3,
        .character-sheet .section-card h4 {
           border-bottom: none;
           padding-bottom: 0;
           margin-bottom: 10px;
        }
        /* Restore default h4 margin for nested h4s inside sections */
        .character-sheet .section-card h4 {
            margin-top: 20px;
        }

        /* --- Existing global CharacterSheet styles --- */
        .character-sheet {
          display: flex;
          flex-direction: column;
          gap: 0px;
          padding: 0px;
          border: none;
          background-color: transparent;
          border-radius: 0;
          box-shadow: none;
        }
        .main-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* This forces 2 columns */
          gap: 20px;
          margin-bottom: 20px;
        }

        /* --- House-specific heading colors (now apply to CollapsibleSectionWrapper h3) --- */
        .character-sheet.house\\ of\\ valor .collapsible-header h3 { color: #CE3333; }
        .character-sheet.house\\ of\\ loyalty .collapsible-header h3 { color: #FFD700; }
        .character-sheet.house\\ of\\ wit .collapsible-header h3 { color: #4A90E2; }
        .character-sheet.house\\ of\\ ambition .collapsible-header h3 { color: #6DC26F; }

        /* --- Input Field & Select Field Styling (Already mostly global) --- */
        .input-field-container label,
        .select-field-container label { color: #c0c0c0; }
        .input-field-container input,
        .select-field-container select,
        textarea { background-color: rgba(20, 20, 30, 0.8); color: #e0e0e0; }
        .input-field-container input:focus, .select-field-container select:focus, textarea:focus { border-color: #6a5acd; box-shadow: 0 0 8px rgba(106, 90, 205, 0.6); }

        /* --- Button Styling (Already mostly global) --- */
        .add-item-button, .add-parent-button { background-color: #6a5acd; color: #e0e0e0; }
        .add-item-button:hover:not(:disabled), .add-parent-button:hover { background-color: #7b68ee; }
        .add-item-button:disabled { background-color: rgba(100, 100, 150, 0.3); color: rgba(224, 224, 224, 0.5); }
        .remove-button { background-color: #b33939; color: #e0e0e0; }
        .remove-button:hover { background-color: #cc5c5c; }

        /* --- Specific section styles that remain --- */
        /* Traits Section */
        .traits-section .year-bonus-info { background-color: rgba(60, 60, 100, 0.4); border-left: 5px solid #6a5acd; }
        .traits-section .year-bonus-info h4 { color: #b0b0ff; border-bottom: none; }
        .traits-section .trait-instructions p { color: #c0c0c0; }
        .traits-section .house-bonus-indicator { color: #7FFF00; }
        .traits-section .trait-warning { color: #FF6347; }
        .traits-section .trait-item { background-color: rgba(60, 60, 90, 0.6); border: 1px solid rgba(120, 120, 180, 0.3); box-shadow: 0 1px 5px rgba(0,0,0,0.2), inset 0 0 2px rgba(255,255,255,0.03); }

        /* Health Checkboxes */
        .health-section .health-box { border: 2px solid #a0a0a0; background-color: rgba(20, 20, 30, 0.8); }
        .health-section .health-box.checked { background-color: #4CAF50; border-color: #4CAF50; }
        .health-section .health-box:hover { background-color: rgba(80, 80, 120, 0.5); }
        .health-section .health-box.checked:hover { background-color: #45a049; }

        /* Backstory Section */
        .backstory-parent-card { background-color: rgba(40, 40, 70, 0.8); border: 1px solid rgba(120, 120, 180, 0.3); box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05); }
        .additional-info-field { margin-top: 20px; }

        /* Inventory Section */
        .inventory-item-card { background-color: rgba(40, 40, 70, 0.8); border: 1px solid rgba(120, 120, 180, 0.3); box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05); }
        .empty-inventory-message { color: #888; }
        .add-item-controls { border-bottom: 1px dashed rgba(100, 100, 150, 0.2); }
        .item-preview { background-color: rgba(60, 60, 90, 0.5); border: 1px solid rgba(120, 120, 180, 0.3); color: #c0c0c0; }

        /* Spells Section */
        .spell-item-card { background-color: rgba(40, 40, 70, 0.8); border: 1px solid rgba(120, 120, 180, 0.3); box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
}