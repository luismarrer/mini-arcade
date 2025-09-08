# Two Dots Game

Este es un sencillo juego de habilidad "Two Dots" desarrollado con HTML, CSS y JavaScript. El objetivo del juego es conectar puntos del mismo color para conseguir la mayor puntuación posible en 60 segundos.

## Cómo jugar

1. **Configuración inicial**: Al abrir `index.html`, se te pedirá que introduzcas un apodo, selecciones el tamaño del tablero (4x4, 5x5 o 6x6) y elijas un avatar.
2. **Inicio del juego**: Una vez que hayas rellenado el formulario, haz clic en "JUGAR" para comenzar.
    * Haz clic en un punto y arrastra el ratón para conectar puntos adyacentes del mismo color.
    * Cuando sueltes el clic, los puntos conectados desaparecerán y se sumarán a tu puntuación.
    * Aparecerán nuevos puntos de colores aleatorios en su lugar.
3. **Fin del juego**: El juego termina cuando el temporizador de 60 segundos llega a cero. En ese momento, se mostrará tu puntuación final.

## Características

* **Pantalla de inicio personalizable**: Elige tu apodo, avatar y tamaño del tablero.
* **Juego cronometrado**: Tienes 60 segundos para conseguir la máxima puntuación.
* **Interfaz interactiva**: Conecta puntos con el ratón de forma intuitiva.
* **Almacenamiento de sesión**: Tus datos de jugador se guardan en `sessionStorage` para personalizar la partida.

## Tecnologías utilizadas

* **HTML5**: Para la estructura de las páginas.
* **CSS3**: Para los estilos y el diseño visual.
* **JavaScript (ES6+)**: Para la lógica del juego y la interactividad.

## Estructura del proyecto

```bash
/
|-- css/
|   |-- estilosjuego.css
|   |-- reset.css
|   |-- style.css
|-- images/
|   |-- avatars/
|   |   |-- avatar1.png
|   |   |-- ...
|   |-- favicon.png
|   |-- logo.png
|-- js/
|   |-- app.js
|   |-- datosUsuario.js
|   |-- juego.js
|-- index.html
|-- juego.html
|-- Readme.md
```

## Jugar

<https://luismarrer.github.io/mini-arcade/games/twodots/index.html>
