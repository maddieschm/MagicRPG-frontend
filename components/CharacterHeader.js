// components/CharacterHeader.js
import InputField from './InputField';
import SelectField from './SelectField';

export default function CharacterHeader({ character, updateCharacter }) {
  const pronounsOptions = [
    "", // Empty option for initial state
    "he/him",
    "she/her",
    "they/them",
    "he/they",
    "she/they",
    "ze/zir",
    "xe/xem",
    "ask me",
    "other"
  ];
  const heritageOptions = ["", "Non-Magic Blood", "Mixed Blood", "Magic Blood"]; 
  const yearOptions = ["1", "2", "3", "4", "5", "6", "7"];
  const houseOptions = ["", "House of Loyalty", "House of Valor", "House of Wit", "House of Ambition"];

  // Core Classes only for Favorite Subject #1
  const coreSubjectOptions = [
    "", // Empty option
    "Charms",
    "Defense Against the Dark Arts",
    "History of Magic",
    "Herbology",
    "Potion",
    "Transfiguration"
  ];

  // All Core and Elective Classes for Favorite Subject #2
  const allSubjectOptions = [
    "", // Empty option
    "Charms", "Defense Against the Dark Arts", "History of Magic", "Herbology", "Potion", "Transfiguration", // Core Classes
    "Astronomy", "Ancient Runes", "Arithmancy", "Care of Magical Creatures", "Divination", "Non-Magic Person Studies" 
  ];

  // Determine if Favorite Subject #2 should be shown
  const currentYearInt = parseInt(character.year) || 0;
  const isSecondSubjectEnabled = currentYearInt >= 3;
-  console.log("Character Year:", character.year, "Parsed Year:", currentYearInt, "Is Second Subject Enabled:", isSecondSubjectEnabled); 

  return (
    <div className="character-header-section section-card">
      <div className="header-row">
        <InputField
          label="Character Name"
          value={character.characterName}
          onChange={(e) => updateCharacter('characterName', e.target.value)}
        />
        <InputField
          label="Player Name"
          value={character.playerName}
          onChange={(e) => updateCharacter('playerName', e.target.value)}
        />
        <SelectField
          label="Pronouns"
          value={character.pronouns}
          options={pronounsOptions}
          onChange={(e) => updateCharacter('pronouns', e.target.value)}
        />
        {character.pronouns === "other" && (
          <InputField
            label="Custom Pronouns"
            value={character.customPronouns}
            onChange={(e) => updateCharacter('customPronouns', e.target.value)}
            placeholder="e.g., fae/faer"
          />
        )}
      </div>
      <div className="header-row">
        <SelectField
          label="Heritage"
          value={character.heritage}
          options={heritageOptions} /* Now uses updated options */
          onChange={(e) => updateCharacter('heritage', e.target.value)}
        />
        <SelectField
          label="Year"
          value={character.year.toString()}
          options={yearOptions}
          onChange={(e) => {
            const newYear = parseInt(e.target.value);
            updateCharacter('year', newYear);
            // If year drops below 3, clear Favorite Subject #2
            if (newYear < 3 && character.favoriteSubject2 !== "") {
              updateCharacter('favoriteSubject2', "");
            }
          }}
        />
        <SelectField
          label="Academy House"
          value={character.hogwartsHouse} /* Field name still hogwartsHouse in character.json for now */
          options={houseOptions}
          onChange={(e) => updateCharacter('hogwartsHouse', e.target.value)}
        />
      </div>
      <div className="header-row">
        <SelectField
          label="Favorite Subject #1"
          value={character.favoriteSubject1}
          options={coreSubjectOptions}
          onChange={(e) => updateCharacter('favoriteSubject1', e.target.value)}
        />
        {/* Conditional rendering for Favorite Subject #2 */}
        {isSecondSubjectEnabled && (
          <SelectField
            label="Favorite Subject #2"
            value={character.favoriteSubject2}
            options={allSubjectOptions} /* Now uses updated options */
            onChange={(e) => updateCharacter('favoriteSubject2', e.target.value)}
          />
        )}
        <InputField
          label="Wand"
          value={character.wand}
          onChange={(e) => updateCharacter('wand', e.target.value)}
          placeholder="e.g., Elderwood, Dragon Heartstring, 11 inches"
        />
      </div>
      <style jsx>{`
        .character-header-section {
          padding: 15px;
          border-radius: 6px;
        }
        .header-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
        }
        .header-row:last-child {
          margin-bottom: 0;
        }
        /* Styles for disabled select fields (if any other select fields use disabled) */
        .select-field-container select:disabled {
            background-color: rgba(30, 30, 40, 0.5);
            color: #888;
            cursor: not-allowed;
            border-color: rgba(100, 100, 150, 0.2);
        }
      `}</style>
    </div>
  );
}