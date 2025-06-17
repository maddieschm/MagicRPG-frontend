// pages/index.js
import { useState, useEffect } from 'react';
import CharacterSheet from '../components/CharacterSheet';
import Layout from '../components/Layout';
import initialCharacters from '../data/characters.json';

export default function Home() {
  const [character, setCharacter] = useState(null);

  // Log 1: Check initial state and whenever component re-renders
  console.log("Home component rendering. Current character state:", character);

  useEffect(() => {
    // Log 2: Confirm useEffect is running
    console.log("useEffect triggered.");
    // Log 3: See what initialCharacters.json actually holds
    console.log("Content of initialCharacters.json:", initialCharacters);

    const savedCharacter = localStorage.getItem('magicrpgMagicCharacter');
    // Log 4: See what's retrieved from localStorage
    console.log("Saved character from localStorage:", savedCharacter);

    if (savedCharacter && savedCharacter !== 'undefined') {
      try {
        // Attempt to parse the saved data
        const parsedCharacter = JSON.parse(savedCharacter);
        // Log 5: See if parsing was successful
        console.log("Parsed character from localStorage:", parsedCharacter);
        setCharacter(parsedCharacter);
      } catch (error) {
        // Log 6: Catch any parsing errors from localStorage
        console.error("Error parsing saved character from localStorage, falling back:", error);
        if (initialCharacters && initialCharacters.length > 0) {
          // Log 7: Falling back to initial data due to parse error
          console.log("Falling back to initialCharacters[0] due to localStorage parse error.");
          setCharacter(initialCharacters[0]);
        } else {
          // Log 8: No initial characters to fall back to
          console.warn("initialCharacters.json is also empty or missing, cannot fall back.");
        }
      }
    } else if (initialCharacters && initialCharacters.length > 0) {
      // Log 9: No saved data, loading initial characters
      console.log("No saved character found. Loading first character from initialCharacters.json.");
      setCharacter(initialCharacters[0]);
    } else {
      // Log 10: No data found anywhere
      console.warn("No character data found in localStorage or initialCharacters.json.");
    }
  }, []);

  // This function is passed down to CharacterSheet and its children
  // It updates the main character state and saves it to localStorage
  const handleCharacterChange = (updatedCharacter) => {
    setCharacter(updatedCharacter);
    localStorage.setItem('magicrpgMagicCharacter', JSON.stringify(updatedCharacter));
  };

  // Log 11: Check character state right before conditional render
  console.log("Before conditional render. Character state:", character);

  if (!character) {
    // Log 12: If character is still null, this block runs
    console.log("Character is null. Displaying loading message.");
    return (
      <Layout title="Magic RPG - Loading Character..."> {/* UPDATED TITLE */}
        <div className="loading-message">Loading character sheet...</div>
        <style jsx>{`
          .loading-message {
            text-align: center;
            font-size: 1.2em;
            color: #c0c0c0;
            margin-top: 50px;
          }
        `}</style>
      </Layout>
    );
  }

  // Log 13: If character is NOT null, this block runs
  console.log("Character is loaded. Attempting to render CharacterSheet.");

  // Determine the house class for styling the main title and background
  const houseClass = character.hogwartsHouse ? character.hogwartsHouse.toLowerCase() : '';

  return (
    <Layout title={`Magic RPG - ${character.characterName}'s Sheet`}> {/* UPDATED TITLE */}
      {/* Apply the houseClass to the page-content div */}
      <div className={`page-content ${houseClass}`}>
        <h1>Magic RPG Character Creator</h1> {/* UPDATED H1 TEXT */}
        <CharacterSheet character={character} onCharacterChange={handleCharacterChange} />
      </div>

      <style jsx>{`
        /* Base page-content styling */
        .page-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 30px;
          border-radius: 8px;
          position: relative;
          z-index: 10;
          transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        /* Default H1 color */
        h1 {
          color: #b0b0ff;
          text-shadow: 0 0 8px rgba(176, 176, 255, 0.6);
          text-align: center;
          margin-bottom: 30px;
          font-size: 2.5em;
          transition: color 0.3s ease-in-out;
        }

        /* House-specific H1 colors */
        .page-content.house\\ of\\ valor h1 { color: #CE3333; }
        .page-content.house\\ of\\ loyalty h1 { color: #FFD700; }
        .page-content.house\\ of\\ wit h1 { color: #4A90E2; }
        .page-content.house\\ of\\ ambition h1 { color: #6DC26F; }

        /* House-specific background and shadow for .page-content */
        .page-content.house\\ of\\ valor {
          background-color: rgba(60, 20, 20, 0.9);
          box-shadow: 0 0 20px rgba(60, 20, 20, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.1);
        }
        .page-content.house\\ of\\ loyalty {
          background-color: rgba(60, 60, 20, 0.9);
          box-shadow: 0 0 20px rgba(60, 60, 20, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.1);
        }
        .page-content.house\\ of\\ wit {
          background-color: rgba(20, 20, 60, 0.9);
          box-shadow: 0 0 20px rgba(20, 20, 60, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.1);
        }
        .page-content.house\\ of\\ ambition {
          background-color: rgba(20, 60, 20, 0.9);
          box-shadow: 0 0 20px rgba(20, 60, 20, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.1);
        }
        /* Fallback for no house selected or invalid house */
        .page-content:not(.house\\ of\\ valor):not(.house\\ of\\ loyalty):not(.house\\ of\\ wit):not(.house\\ of\\ ambition) {
            background-color: rgba(30, 30, 50, 0.9);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </Layout>
  );
}