let words = ['COMPUTER', 'JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'ANGULAR', 'VUE', 'PYTHON', 'JAVA', 'CSHARP', 'CPLUSPLUS', 'NODEJS', 'EXPRESS', 'AVOCADO', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO', 'KIWI', 'BERRY', 'BLUEBERRY', 'BLACKBERRY', 'GRAPEFRUIT', 'LEMON', 'LIME', 'LULO', 'MELON', 'MULBERRY', 'PAPAYA', 'PASSIONFRUIT', 'POMEGRANATE', 'POMELO', 'PUMPKIN', 'QUIESCO', 'RASPBERRY', 'STARFRUIT', 'TANGERINE', 'TOMATO', 'UGLI', 'VIOLET', 'WATERMELON', 'XIGUA', 'YAM', 'ZUCCHINI', 'VEHICLE', 'ANIMAL', 'TELEPHONE', 'CELLPHONE', 'VETERINARY',]



export function getRandomWord() {
    words.forEach(word => {
        word.toUpperCase()
    })
    return words[Math.floor(Math.random() * words.length)]
}
