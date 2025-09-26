# Hexapawn - Mini Arcade

Un juego de mini-ajedrez en un tablero de 3x3 con peones únicamente. Hexapawn es un juego de estrategia clásico que combina simplicidad con profundidad táctica.

## TODO

- [ ] Mover los peones
  - [X] Usar click para seleccionar el peón
  - [X] Arrastrar y soltar para mover el peón
  - [ ] Usar `Esc` para cancelar la selección
- [ ] Hacer que el turno cambie
  - [ ] Que el movimiento de la computadora se haga con un delay de 500ms
- [ ] Hacer que el nombre del jugador se muestre en la interfaz

## 🎮 Descripción del Juego

Hexapawn es una variante simplificada del ajedrez jugada en un tablero de 3x3 con tres peones por jugador. A pesar de su simplicidad aparente, ofrece decisiones estratégicas interesantes y partidas rápidas.

## 📋 Reglas del Juego

### Movimientos de los Peones

- **Avance**: Los peones avanzan 1 casilla hacia adelante (solo si la casilla está vacía)
- **Captura**: Los peones capturan en diagonal (solo si hay una pieza enemiga)
- **Dirección**:
  - Jugador (peones blancos ♙): Se mueven hacia arriba (fila 2 → 1 → 0)
  - Computadora (peones negros ♟): Se mueven hacia abajo (fila 0 → 1 → 2)

### Condiciones de Victoria

1. **Victoria por promoción**: Llegar con un peón a la última fila
2. **Victoria por bloqueo**: El oponente no tiene movimientos legales

## 🕹️ Cómo Jugar

### Controles

- **Drag & Drop**: Arrastra los peones para moverlos
- **Validación visual**: Las casillas válidas se iluminan cuando le das click a uno de tus peones
- **Teclado**: Presiona `Escape` para cancelar la selección

### Interfaz

- **Estado del juego**: Muestra el turno actual y estadísticas
- **Nombre del jugador**: Muestra el nombre del jugador
- **Tablero interactivo**: Grid 3x3 con retroalimentación visual
- **Controles**: Botones para nueva partida y reiniciar estadísticas
- **Reglas**: Recordatorio de las reglas del juego

## 💾 Características

### Persistencia de Datos

- **Estado del juego**: Se guarda automáticamente en LocalStorage
- **Nombre del jugador**: Se guarda en LocalStorage
- **Estadísticas**: Contador de victorias y derrotas persistente
- **Reanudación**: Continúa la partida al recargar la página

### Inteligencia Artificial

- **IA Simple**: La computadora prioriza capturas y luego movimientos aleatorios
- **Respuesta rápida**: Movimientos con delay de 500ms para mejor UX

### Diseño Responsive

- **Tema arcade**: Colores neón y tipografía monoespaciada
- **Adaptable**: Funciona en desktop y móviles
- **Accesibilidad**: Soporte para navegación por teclado y lectores de pantalla

## 🛠️ Estructura del Proyecto

```bash
hexapawn/
├── css/
│   ├── reset.css      # Reset de estilos CSS
│   └── styles.css     # Estilos principales con tema arcade
├── images/
│   ├── favicon.png    # Icono del sitio (placeholder)
│   └── logo.png       # Logo del Mini Arcade (placeholder)
├── js/
│   └── app.js         # Lógica principal del juego
│   └── click.js       # Lógica de clics
│   └── dragAndDrop.js # Lógica de arrastrar y soltar
│   └── gameLogic.js   # Lógica del juego
│   └── myjquery.js    # jQuery personalizado
│   └── state.js       # Estado del juego
│   └── storage.js     # Persistencia de datos
│   └── ui.js          # Interfaz de usuario
├── game.html          # Página del juego
├── index.html         # Formulario de nombre del jugador
└── README.md          # Este archivo
```

### Organización

- `game.html`: Página del juego
- `index.html`: Formulario de nombre del jugador
- `css/`: Contiene los archivos de estilos CSS
- `images/`: Contiene los archivos de imágenes
- `js/`: Contiene los archivos de JavaScript

#### JavaScript

- `app.js`: Lógica principal del juego
- `click.js`: Lógica de clics
- `dragAndDrop.js`: Lógica de arrastrar y soltar
- `gameLogic.js`: Lógica del juego
- `myjquery.js`: jQuery personalizado
- `state.js`: Estado del juego
- `storage.js`: Persistencia de datos
- `ui.js`: Interfaz de usuario

## 🔧 Tecnologías Utilizadas

### Frontend

- **HTML5**: Estructura semántica con elementos apropiados
- **CSS3**: Grid, Flexbox, Custom Properties
- **JavaScript**: Módulos, arrow functions

### APIs del Navegador

- **Drag & Drop API**: Para la interacción con los peones
- **LocalStorage**: Para persistencia de datos
- **DOM API**: Manipulación dinámica del tablero

## 📈 Futuras Mejoras

- [ ] IA más inteligente con algoritmo minimax
- [ ] Modo multijugador local
- [ ] Animaciones de movimiento más fluidas
- [ ] Sonidos y efectos de audio
- [ ] Temas visuales alternativos
- [ ] Historial de partidas
- [ ] Análisis de movimientos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue para discutir los cambios
2. Haz fork del proyecto
3. Crea una rama para tu feature
4. Envía un pull request

---

**¡Disfruta jugando Hexapawn!** 🎮♟️
