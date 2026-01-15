import type { FC } from 'react'
import HexapawnGame from './HexapawnGame'

/**
 * Client wrapper component for Hexapawn game.
 * This component is used by Astro to hydrate the React component on the client side.
 */
const HexapawnGameClient: FC = () => {
    return <HexapawnGame />
}

export default HexapawnGameClient
