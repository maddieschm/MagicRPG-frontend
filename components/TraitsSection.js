// components/TraitsSection.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SelectField from './SelectField';
import InputField from './InputField';

const initialBaseScorePool = [-1, 0, 1, 1, 2];
const traitNames = ["bravery", "mischief", "knowledge", "loyalty", "magic"];

export default function TraitsSection({ character, onCharacterChange }) {
  const { traits, academyHouse, year, yearBonusAllocations } = character;

  const calculateGloballyAvailableScores = useCallback(() => {
    let currentPool = [...initialBaseScorePool];
    Object.values(traits).forEach(score => {
      if (score !== null) {
        const index = currentPool.indexOf(score);
        if (index > -1) {
          currentPool.splice(index, 1);
        }
      }
    });
    return currentPool.sort((a, b) => a - b);
  }, [traits]);

  const [globallyAvailableBaseScores, setGloballyAvailableBaseScores] = useState(calculateGloballyAvailableScores);

  useEffect(() => {
    setGloballyAvailableBaseScores(calculateGloballyAvailableScores());
  }, [traits, calculateGloballyAvailableScores]);


  const houseBonuses = {
      'house of valor': 'bravery',
      'house of ambition': 'mischief',
      'house of wit': 'knowledge',
      'house of loyalty': 'loyalty',
  };

  const getMaxTraitScore = (charYear) => {
    if (charYear <= 5) return 3;
    if (charYear === 6) return 4;
    if (charYear >= 7) return 5;
    return 3;
  };

  const maxTraitScore = getMaxTraitScore(year);

  const totalYearBonusPoints = year > 1 ? (year - 1) : 0;
  const allocatedYearBonusPoints = useMemo(() =>
    Object.values(yearBonusAllocations).reduce((sum, val) => sum + val, 0),
    [yearBonusAllocations]
  );
  const remainingYearBonusPoints = totalYearBonusPoints - allocatedYearBonusPoints;

  const effectiveTraits = useMemo(() => {
    const calculated = {};
    const lowerCaseHouse = academyHouse ? academyHouse.toLowerCase() : '';
    const bonusTrait = houseBonuses[lowerCaseHouse];

    traitNames.forEach(traitName => {
      let score = traits[traitName] || 0;
      let yearBonus = yearBonusAllocations[traitName] || 0;

      if (traitName === bonusTrait) {
        score += 1;
      }
      score += yearBonus;
      calculated[traitName] = Math.min(score, maxTraitScore);
    });
    return calculated;
  }, [traits, academyHouse, yearBonusAllocations, maxTraitScore]);


  const handleBaseTraitChange = useCallback((traitName, selectedValueString) => {
    const selectedValue = selectedValueString === "" ? null : parseInt(selectedValueString);
    const newTraits = { ...traits, [traitName]: selectedValue };
    onCharacterChange(prevChar => ({ ...prevChar, traits: newTraits }));
  }, [traits, onCharacterChange]);


  const handleYearBonusChange = useCallback((traitName, value) => {
    const newAllocatedPoints = parseInt(value) || 0;

    let currentBase = traits[traitName] || 0;
    const lowerCaseHouse = academyHouse ? academyHouse.toLowerCase() : '';
    const bonusTrait = houseBonuses[lowerCaseHouse];
    if (traitName === bonusTrait) {
      currentBase += 1;
    }
    const scoreBeforeYearBonus = currentBase;

    let pointsToAdd = newAllocatedPoints;
    if (newAllocatedPoints < (yearBonusAllocations[traitName] || 0)) {
        // If decreasing, no additional checks needed
    } else { // If increasing
        const potentialEffectiveScore = scoreBeforeYearBonus + newAllocatedPoints;
        const currentBonusDelta = newAllocatedPoints - (yearBonusAllocations[traitName] || 0);

        if (remainingYearBonusPoints < currentBonusDelta && currentBonusDelta > 0) {
            pointsToAdd = (yearBonusAllocations[traitName] || 0) + remainingYearBonusPoints;
            alert(`Not enough year bonus points remaining! Only ${remainingYearBonusPoints} points left.`);
        } else if (potentialEffectiveScore > maxTraitScore) {
            pointsToAdd = maxTraitScore - scoreBeforeYearBonus;
            if (pointsToAdd < 0) pointsToAdd = 0;
            alert(`Allocating ${newAllocatedPoints} points would exceed the max trait score of ${maxTraitScore}. Capped to ${pointsToAdd}.`);
        }
    }

    const newYearBonusAllocations = { ...yearBonusAllocations, [traitName]: pointsToAdd };
    onCharacterChange(prevChar => ({ ...prevChar, yearBonusAllocations: newYearBonusAllocations }));

  }, [traits, academyHouse, maxTraitScore, onCharacterChange, remainingYearBonusPoints, yearBonusAllocations]);


  return (
    <div className="section-card traits-section">
      <h3>Traits</h3>

      {totalYearBonusPoints > 0 && (
        <div className="year-bonus-info">
          <h4>Year Bonus Points:</h4>
          {remainingYearBonusPoints !== 0 || allocatedYearBonusPoints > 0 ? (
            <p>{remainingYearBonusPoints} available / {totalYearBonusPoints} total</p>
          ) : (
            <p style={{color: '#7FFF00'}}>All {totalYearBonusPoints} points utilized!</p>
          )}

          {remainingYearBonusPoints < 0 && (
              <p className="trait-warning">You have allocated {Math.abs(remainingYearBonusPoints)} points more than available!</p>
          )}
        </div>
      )}

      <div className="traits-grid">
        {traitNames.map((traitName) => {
          const baseScoreForTrait = traits[traitName];
          const houseBonusApplied = (academyHouse && houseBonuses[academyHouse.toLowerCase()] === traitName) ? 1 : 0;
          const yearBonusForTrait = yearBonusAllocations[traitName] || 0;

          // --- REVISED DYNAMIC DROPDOWN OPTIONS GENERATION ---
          // 1. Get all scores assigned to *other* traits
          const assignedScoresByOthers = traitNames
            .filter(tn => tn !== traitName)
            .map(tn => traits[tn])
            .filter(s => s !== null);

          // 2. Build the pool of options available for THIS specific dropdown
          let currentDropdownPool = [...initialBaseScorePool];
          assignedScoresByOthers.forEach(assignedScore => {
            const index = currentDropdownPool.indexOf(assignedScore);
            if (index > -1) {
              currentDropdownPool.splice(index, 1);
            }
          });

          // 3. Add back the current trait's own assigned score to its options, if it has one.
          if (baseScoreForTrait !== null) {
            if (!currentDropdownPool.includes(baseScoreForTrait)) {
              currentDropdownPool.push(baseScoreForTrait);
            }
          }

          // 4. Sort numerically and convert to strings, add the empty option first.
          const dropdownOptions = ["", ...currentDropdownPool.sort((a,b) => a - b).map(String)];

          return (
            <div key={traitName} className="trait-item">
              {/* Base Score Dropdown */}
              <SelectField
                label={`${traitName.charAt(0).toUpperCase() + traitName.slice(1)} (Base)`}
                value={baseScoreForTrait !== null ? baseScoreForTrait.toString() : ""}
                options={dropdownOptions}
                onChange={(e) => handleBaseTraitChange(traitName, e.target.value)}
              />

              {/* Year Bonus Allocation */}
              {totalYearBonusPoints > 0 && (
                <InputField
                  label="Year Bonus"
                  value={yearBonusForTrait}
                  type="number"
                  min="0"
                  max={totalYearBonusPoints}
                  onChange={(e) => handleYearBonusChange(traitName, e.target.value)}
                />
              )}

              {/* Effective Score Display */}
              <InputField
                label="Effective Score"
                value={effectiveTraits[traitName]}
                type="number"
                readOnly
              />
              {houseBonusApplied > 0 && (
                <span className="house-bonus-indicator">+1 (House)</span>
              )}
              {effectiveTraits[traitName] > maxTraitScore && (
                <span className="trait-warning">Exceeds Max ({maxTraitScore})</span>
              )}
            </div>
          );
        })}
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
          color: #b0b0b0;
          border-bottom: 1px solid rgba(100, 100, 150, 0.1);
          padding-bottom: 5px;
          margin-bottom: 10px;
          font-size: 1.1em;
        }
        .year-bonus-info {
          background-color: rgba(60, 60, 100, 0.4);
          border-left: 5px solid #6a5acd;
          padding: 10px 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .year-bonus-info h4 {
            color: #b0b0ff;
            border-bottom: none;
            margin-bottom: 5px;
        }
        .traits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .trait-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          position: relative;
          padding: 10px;
          border: 1px solid rgba(120, 120, 180, 0.3);
          border-radius: 4px;
          background-color: rgba(60, 60, 90, 0.6);
          box-shadow: 0 1px 5px rgba(0,0,0,0.2), inset 0 0 2px rgba(255,255,255,0.03);
        }
        .house-bonus-indicator {
          font-size: 0.8em;
          color: #7FFF00;
          font-weight: bold;
          margin-left: 5px;
        }
        .trait-warning {
          font-size: 0.8em;
          color: #FF6347;
          font-weight: bold;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}