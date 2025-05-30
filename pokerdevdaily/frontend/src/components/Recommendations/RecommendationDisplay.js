import React, { useState, useEffect, useCallback } from 'react';
import recommendationService from '../../services/recommendationService';
import './RecommendationDisplay.css';

function RecommendationDisplay() {
  const [recommendations, setRecommendations] = useState([]);
  const [currentRecommendation, setCurrentRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAndSetRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const fetchedRecommendations = await recommendationService.getRecommendations();
      if (fetchedRecommendations && fetchedRecommendations.length > 0) {
        if (fetchedRecommendations[0].error_message) {
            setError(fetchedRecommendations[0].error_message);
            setCurrentRecommendation('');
            setRecommendations([]);
        } else {
            setRecommendations(fetchedRecommendations);
            // Display a random recommendation initially
            setCurrentRecommendation(
              fetchedRecommendations[Math.floor(Math.random() * fetchedRecommendations.length)]
            );
        }
      } else {
        setError('No recommendations available at the moment.');
        setRecommendations([]);
        setCurrentRecommendation('');
      }
    } catch (err) {
      // This catch might be redundant if service handles it, but good for safety
      setError('Failed to load recommendations.');
      setRecommendations([]);
      setCurrentRecommendation('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetRecommendations();
  }, [fetchAndSetRecommendations]);

  const getAnotherRecommendation = () => {
    if (recommendations.length > 0) {
      let randomIndex = Math.floor(Math.random() * recommendations.length);
      let newRec = recommendations[randomIndex];
      // Ensure it's different from current, if possible and more than 1 recommendation exists
      if (recommendations.length > 1) {
        while (newRec === currentRecommendation) {
          randomIndex = Math.floor(Math.random() * recommendations.length);
          newRec = recommendations[randomIndex];
        }
      }
      setCurrentRecommendation(newRec);
    }
  };

  if (isLoading) {
    return <div className="recommendation-container"><p>Loading recommendation...</p></div>;
  }

  return (
    <div className="recommendation-container">
      <h4>Poker Tip / Recommendation</h4>
      {error && <p className="error-message">{error}</p>}
      {currentRecommendation && !error && (
        <p className="recommendation-text">"{currentRecommendation}"</p>
      )}
      {!error && recommendations.length > 1 && ( // Show button if no error and more than one rec available
        <button onClick={getAnotherRecommendation} className="another-rec-button">
          Get Another Tip
        </button>
      )}
       {!error && recommendations.length === 0 && !isLoading && (
         <p>No tips available right now. Check back later!</p>
       )}
    </div>
  );
}

export default RecommendationDisplay;
