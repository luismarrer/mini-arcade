# Reto Final

## Descripción

Utilizando los contenidos vistos en el curso te proponemos crear un proyecto de dos páginas al igual que el programado en las clases. La primera debe presentar los datos necesarios de entrada del jugador y la segunda un juego sobre el que os damos una idea (Héroes y Villanos de Dragon Ball, Marvel, DC, etcétera).  Puedes llevar más allá tu imaginación e inventarte el tuyo.

### Mínimos a desarrollar

1. [ ] Documentar el código.
   1. [ ] Documentar el código HTML.
   2. [ ] Documentar el código CSS.
   3. [ ] Documentar el código JS.
      1. [ ] Usar JSdoc para documentar el código.
2. [ ] Validar con W3C Validator de VSCode.
    1. [ ] Validar HTML.
    2. [ ] Validar CSS.
3. [X] Definir una página de entrada del jugador. - ya está es index.html
    1. [ ] Logo
    2. [ ] Formulario con los siguientes campos:
        1. [ ] Nick de juego
        2. [ ] Dificultad del juego: baja, media o alta
        3. [ ] Número de tarjetas: 9, 16 o 25 (3x3, 4x4, 5x5)
        4. [ ] Avatar del jugador relacionada con la temática elegida
4. [ ] Página de juego en el que se intentará emparejar tarjetas de personajes que correspondan a villanos y superhéroes:
    1. En un primer momento todas las tarjetas están boca-abajo
    2. El jugador hace clic sobre dos tarjetas y se dan la vuelta. Dependiendo de la dificultad, el tiempo que las tarjetas estén visibles será mayor o menor
    3. Contador de tiradas que debe ser limitado dependiendo de la dificultad
    4. Las tarjetas que se emparejen quedarán al descubierto y se añadirá la puntuación
    5. El juego finaliza bien cuando el usuario empareja todas las cartas o bien cuando se acaban las tiradas
5. [ ] Se debe usar en el proyecto como mínimo:
    1. DOM + Eventos
    2. API Drag&Drop
    3. API LocalStorage
6. [X] Publicación en Github - ya está en un repo.
7. [ ] Publicar en GitHub Pages.

Por supuesto no te olvides de las buenas prácticas:

- Uso de los comentarios
- Uso de las tabulaciones
- Uso del buen nombrado de las clases y ids

### Conviértete en un superhéroe. Modificación del proyecto

Añade a tu proyecto artefactos y bombas:

- En la página de entrada incluye la posibilidad de que el jugador pueda elegir 1 o 2 artefactos que le pueda ayudar en el juego. Como posibles artefactos entiende destapar todas las cartas un instante, destapar una pareja, añadir más turnos, ...

- En el juego se pueden añadir bombas o dificultades como: calaveras que te hagan perder el juego directamente si se emparejan, elementos que barajen todo el panel, ...
