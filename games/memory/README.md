# Memory Game

Este es un clásico juego de memoria con temática de superhéroes de DC Comics. El objetivo es encontrar todas las parejas de cartas iguales antes de que se agoten los movimientos disponibles.

## Cómo Jugar

1. **Configuración Inicial**: En la pantalla principal, deberás configurar tu partida:
   * **Nick**: Ingresa un nombre de usuario de entre 3 y 15 caracteres.
   * **Dificultad**: Elige entre Baja, Media y Alta. Esto afectará el número de movimientos iniciales.
   * **Número de tarjetas**: Selecciona la cantidad de cartas para el tablero (12, 16 o 20).
   * **Avatar**: Escoge tu superhéroe favorito como avatar.
   * **Artefactos**: Puedes seleccionar un artefacto para usar durante el juego, como `Destapar todas` o `Más turnos`.

2. **Inicio del Juego**: Una vez configurada la partida, haz clic en `Jugar` para comenzar.

3. **Mecánica del Juego**:
   * Haz clic en las cartas para voltearlas y revelar el personaje oculto.
   * Intenta encontrar las parejas de cartas con el mismo personaje.
   * Si las cartas coinciden, permanecerán visibles y sumarás puntos. Si no, se volverán a ocultar.
   * Cada vez que volteas una carta, se resta un movimiento.

4. **Fin del Juego**: El juego termina cuando encuentras todas las parejas o cuando te quedas sin movimientos.

## Features

* **Niveles de Dificultad**: Tres niveles que ajustan la cantidad de movimientos disponibles.
* **Tablero Configurable**: Elige entre 12, 16 o 20 cartas.
* **Sistema de Puntuación**: Gana puntos por cada pareja encontrada.
* **Artefactos**: Utiliza habilidades especiales para obtener ventajas, como revelar todas las cartas temporalmente o conseguir más turnos.
* **Avatares Personalizables**: Elige entre varios superhéroes de DC Comics.
* **Controles de Juego**: Opciones para reiniciar la partida o volver al menú principal.

## Tecnologías Utilizadas

* **HTML5**: Para la estructura del juego.
* **CSS3**: Para el diseño y las animaciones de las cartas.
* **JavaScript (ES Modules)**: Para toda la lógica del juego, incluyendo la manipulación del DOM, el manejo de eventos y el estado del juego.

## Estructura del Proyecto

```bash
/memory
├── css/
│   ├── card.css
│   ├── game.css
│   ├── reset.css
│   └── style.css
├── images/
│   ├── avatars/
│   └── cards/
├── js/
│   ├── app.js
│   ├── artefactos.js
│   ├── game.js
│   ├── gameInfo.js
│   ├── myjquery.js
│   ├── promises.js
│   └── userData.js
├── game.html
├── index.html
└── README.md
```
