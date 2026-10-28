import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({
  value = 0,
  onChange = null,
  readonly = false,
  size = 18,
  showValue = false,
  maxStars = 5
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const currentRating = hoverValue > 0 ? hoverValue : Number(value) || 0;

  const handleClick = (ratingIndex) => {
    if (!readonly && onChange) {
      // Toggle off if clicked on same rating
      const newValue = ratingIndex === value ? 0 : ratingIndex;
      onChange(newValue);
    }
  };

  const handleMouseEnter = (ratingIndex) => {
    if (!readonly) {
      setHoverValue(ratingIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  return (
    <div
      className={`star-rating ${readonly ? 'readonly' : 'interactive'}`}
      onMouseLeave={handleMouseLeave}
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= currentRating;

        return (
          <button
            key={starNumber}
            type="button"
            className={`star-button ${readonly ? 'readonly' : ''} ${isFilled ? 'active' : ''}`}
            onClick={() => handleClick(starNumber)}
            onMouseEnter={() => handleMouseEnter(starNumber)}
            disabled={readonly}
            tabIndex={readonly ? -1 : 0}
            aria-label={`${starNumber} Star${starNumber > 1 ? 's' : ''}`}
            aria-checked={value === starNumber}
            role={readonly ? 'presentation' : 'radio'}
          >
            <Star
              size={size}
              className="star-svg"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFilled ? 1.5 : 2}
            />
          </button>
        );
      })}

      {showValue && value > 0 && (
        <span className="star-score-text">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
