import React, { forwardRef } from 'react';

interface TarotCardProps {
  isFlipped: boolean;
  onClick: () => void;
  isSelectable: boolean;
  isSelected: boolean;
  image: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const cardBackUrl = 'https://i.imgur.com/3Yd5b1z.jpeg';

export const TarotCard = forwardRef<HTMLDivElement, TarotCardProps>(
  ({ isFlipped, onClick, isSelectable, isSelected, image, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-container absolute ${isSelectable ? 'cursor-pointer' : ''} ${isSelected ? 'is-selected' : ''}`}
        onClick={isSelectable ? onClick : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face card-face-front">
            <img src={image} alt="Tarot Card" className="w-full h-full object-cover" />
          </div>
          <div className="card-face card-face-back">
            <img src={cardBackUrl} alt="Card Back" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }
);

TarotCard.displayName = 'TarotCard';
