import type { FC } from 'react'
import type { Card } from './hooks/useMemoryGame'
import type { CardImage } from './MemoryGameClient'

interface GameBoardProps {
    cards: Card[]
    onCardClick: (cardId: number) => void
    cardImages: CardImage[]
}

const GameBoard: FC<GameBoardProps> = ({ cards, onCardClick, cardImages }) => {
    const columns = cards.length === 20 ? 5 : 4

    return (
        <div
            role="grid"
            aria-label="Memory card board"
            className="mx-auto grid max-w-[430px] gap-2 sm:gap-2.5 short-landscape:max-w-[var(--short-game-board-size)] short-landscape:gap-1.5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {cards.map((card) => {
                const cardImage = cardImages.find(img => img.id === card.content)
                return (
                    <div
                        key={card.id}
                        role="gridcell"
                        className="relative aspect-square w-full min-w-0"
                    >
                        <button
                            type="button"
                            className={`
                                absolute inset-0 rounded-lg p-0 sm:rounded-xl
                                transition-transform duration-200 ease-out
                                hover:scale-105 disabled:hover:scale-100
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ec5f3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121a2d]
                                [perspective:1000px]
                                ${card.isMatched ? 'animate-memory-match motion-reduce:animate-none cursor-default' : 'cursor-pointer'}
                            `}
                            onClick={() => onCardClick(card.id)}
                            aria-label={card.isMatched ? `Matched card ${card.content}` : card.isFlipped ? `Card ${card.content}` : 'Hidden card'}
                            aria-pressed={card.isFlipped || card.isMatched}
                            disabled={card.isMatched}
                        >
                            <div className={`relative w-full h-full text-center transition-transform duration-600 motion-reduce:duration-[0.01ms] rounded-xl [transform-style:preserve-3d] ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}`}>
                                {/* Front face (face down) */}
                                <div className="
                                    absolute w-full h-full rounded-xl
                                    flex items-center justify-center
                                    text-2xl md:text-3xl font-bold text-white
                                    bg-linear-to-br from-[#277fbc] via-[#245da4] to-[#273364]
                                    border-[3px] border-[#6ec5f3]
                                    shadow-[0_8px_18px_rgba(3,11,29,0.45)]
                                    [backface-visibility:hidden]
                                    before:content-['?'] before:text-3xl before:md:text-4xl before:drop-shadow-md
                                "/>
                                {/* Back face (face up) */}
                                <div className={`
                                    absolute w-full h-full rounded-xl
                                    flex items-center justify-center
                                    text-xl md:text-2xl font-bold text-white
                                    border-[3px] shadow-[0_8px_18px_rgba(3,11,29,0.45)]
                                    overflow-hidden
                                    [backface-visibility:hidden] [transform:rotateY(180deg)]
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
    )
}

export default GameBoard
