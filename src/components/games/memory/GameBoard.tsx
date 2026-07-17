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

                @media (prefers-reduced-motion: reduce) {
                    .card-matched, .card-no-match { animation: none; }
                    .card-inner { transition-duration: 0.01ms; }
                }
            `}</style>
            <div
                role="grid"
                aria-label="Memory card board"
                className="mx-auto grid max-w-[430px] gap-2 sm:gap-2.5"
                style={{ gridTemplateColumns: `repeat(${dimension}, 1fr)` }}
            >
                {cards.map((card) => {
                    const cardImage = cardImages.find(img => img.id === card.content)
                    return (
                        <div
                            key={card.id}
                            role="gridcell"
                            className="relative aspect-square w-full"
                        >
                            <button
                                type="button"
                                className={`
                                    relative h-full w-full cursor-pointer rounded-lg p-0 sm:rounded-xl
                                    transition-transform duration-200 ease-out
                                    hover:scale-105
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ec5f3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121a2d]
                                    perspective-[1000px]
                                    ${card.isFlipped ? 'card-flipped' : ''}
                                    ${card.isMatched ? 'card-matched cursor-default' : ''}
                                `}
                                onClick={() => onCardClick(card.id)}
                                aria-label={card.isMatched ? `Matched card ${card.content}` : card.isFlipped ? `Card ${card.content}` : 'Hidden card'}
                                aria-pressed={card.isFlipped || card.isMatched}
                                disabled={card.isMatched}
                            >
                                <div className="card-inner relative w-full h-full text-center transition-transform duration-600 rounded-xl">
                                    {/* Front face (face down) */}
                                    <div className="
                                        card-front
                                        absolute w-full h-full rounded-xl
                                        flex items-center justify-center
                                        text-2xl md:text-3xl font-bold text-white
                                        bg-linear-to-br from-[#277fbc] via-[#245da4] to-[#273364]
                                        border-[3px] border-[#6ec5f3]
                                        shadow-[0_8px_18px_rgba(3,11,29,0.45)]
                                        before:content-['?'] before:text-3xl before:md:text-4xl before:drop-shadow-md
                                    "/>
                                    {/* Back face (face up) */}
                                    <div className={`
                                        card-back
                                        absolute w-full h-full rounded-xl
                                        flex items-center justify-center
                                        text-xl md:text-2xl font-bold text-white
                                        border-[3px] shadow-[0_8px_18px_rgba(3,11,29,0.45)]
                                        overflow-hidden
                                        ${card.isMatched
                                            ? 'bg-[#214f45] border-[#68d2ae]'
                                            : 'bg-[#55243a] border-[#e34a7a]'
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
                            </button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default GameBoard
