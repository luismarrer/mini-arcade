import type { FC } from 'react'
import type { Card } from './hooks/useMemoryGame'
import type { CardImage } from './MemoryGameClient'

interface GameBoardProps {
    cards: Card[]
    onCardClick: (cardId: number) => void
    cardImages: CardImage[]
}

const GameBoard: FC<GameBoardProps> = ({ cards, onCardClick, cardImages }) => {
    const dimension = Math.round(Math.sqrt(cards.length))

    return (
        <>
            <style>{`
                @keyframes matchPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .card-matched { animation: matchPulse 0.6s ease-in-out; }
                .card-no-match { animation: shake 0.5s ease-in-out; }
                .card-flipped .card-inner { transform: rotateY(180deg); }
                .card-inner { transform-style: preserve-3d; }
                .card-front, .card-back { backface-visibility: hidden; }
                .card-back { transform: rotateY(180deg); }
            `}</style>
            <div
                role="grid"
                aria-label="Memory card board"
                className="grid gap-2.5 max-w-[400px] mx-auto"
                style={{ gridTemplateColumns: `repeat(${dimension}, 1fr)` }}
            >
                {cards.map((card) => {
                    const cardImage = cardImages.find(img => img.id === card.content)
                    return (
                        <div
                            key={card.id}
                            className={`
                                relative w-full aspect-square cursor-pointer rounded-xl
                                transition-transform duration-200 ease-out
                                hover:scale-105
                                perspective-[1000px]
                                ${card.isFlipped ? 'card-flipped' : ''}
                                ${card.isMatched ? 'card-matched pointer-events-none' : ''}
                            `}
                            onClick={() => onCardClick(card.id)}
                            role="gridcell"
                            aria-label={card.isMatched ? `Matched card ${card.content}` : 'Hidden card'}
                        >
                            <div className="card-inner relative w-full h-full text-center transition-transform duration-600 rounded-xl">
                                {/* Cara frontal (boca abajo) */}
                                <div className="
                                    card-front
                                    absolute w-full h-full rounded-xl
                                    flex items-center justify-center
                                    text-2xl md:text-3xl font-bold text-white
                                    bg-linear-to-br from-blue-500 to-blue-600
                                    border-[3px] border-slate-700
                                    shadow-lg
                                    before:content-['?'] before:text-3xl before:md:text-4xl before:drop-shadow-md
                                "/>
                                {/* Cara trasera (boca arriba) */}
                                <div className={`
                                    card-back
                                    absolute w-full h-full rounded-xl
                                    flex items-center justify-center
                                    text-xl md:text-2xl font-bold text-white
                                    border-[3px] shadow-lg
                                    overflow-hidden
                                    ${card.isMatched 
                                        ? 'bg-linear-to-br from-green-500 to-green-600 border-green-700' 
                                        : 'bg-linear-to-br from-red-500 to-red-600 border-slate-700'
                                    }
                                `}>
                                    {cardImage && (
                                        <img
                                            src={cardImage.src}
                                            srcSet={cardImage.srcSet}
                                            sizes={cardImage.sizes}
                                            width={cardImage.width}
                                            height={cardImage.height}
                                            alt={cardImage.alt}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default GameBoard
