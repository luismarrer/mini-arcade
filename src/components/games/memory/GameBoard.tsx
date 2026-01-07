import type { FC } from 'react'
import type { Card } from './hooks/useMemoryGame'

interface GameBoardProps {
    cards: Card[]
    onCardClick: (cardId: number) => void
}

const GameBoard: FC<GameBoardProps> = ({ cards, onCardClick }) => {
    const dimension = Math.round(Math.sqrt(cards.length))

    return (
        <div
            role="grid"
            aria-label="Memory card board"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dimension}, 1fr)`,
                gap: '10px',
                maxWidth: '400px',
                margin: '0 auto',
            }}
        >
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={`tarjeta ${card.isFlipped ? 'volteada' : ''} ${card.isMatched ? 'matched' : ''}`}
                    onClick={() => onCardClick(card.id)}
                    role="gridcell"
                    aria-label={card.isMatched ? `Matched card ${card.content}` : 'Hidden card'}
                >
                    <div className="tarjeta-inner">
                        <div className="tarjeta-front" />
                        <div className="tarjeta-back">
                            <img
                                src={`/images/memory/cards/${card.content}.avif`}
                                alt={card.content}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GameBoard
