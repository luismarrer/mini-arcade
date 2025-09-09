# Hexapawn - Mini Arcade

Un juego de mini-ajedrez en un tablero de 3x3 con peones únicamente. Hexapawn es un juego de estrategia clásico que combina simplicidad con profundidad táctica.

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
- **Validación visual**: Las casillas válidas se iluminan durante el arrastre
- **Teclado**: Presiona `Escape` para cancelar la selección

### Interfaz

- **Estado del juego**: Muestra el turno actual y estadísticas
- **Tablero interactivo**: Grid 3x3 con retroalimentación visual
- **Controles**: Botones para nueva partida y reiniciar estadísticas
- **Reglas**: Recordatorio de las reglas del juego

## 💾 Características

### Persistencia de Datos

- **Estado del juego**: Se guarda automáticamente en LocalStorage
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
├── index.html         # Página principal
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos

- Navegador web moderno con soporte para:
  - ES6+ (módulos, arrow functions, const/let)
  - Drag & Drop API
  - LocalStorage
  - CSS Grid y Flexbox

### Ejecución

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. ¡Comienza a jugar!

No se requiere servidor web ni instalación adicional.

## 🎯 Estrategias y Consejos

### Para el Jugador

1. **Controla el centro**: Los peones centrales tienen más opciones de captura
2. **Avanza con cuidado**: Cada movimiento hacia adelante es irreversible
3. **Busca capturas**: Eliminar peones enemigos reduce sus opciones
4. **Planifica la promoción**: Intenta crear un peón pasado

### Patrones Comunes

- **Apertura central**: Mover el peón del medio primero
- **Defensa lateral**: Usar los peones laterales para bloquear
- **Sacrificio táctico**: A veces vale la pena perder un peón para ganar posición

## 🔧 Tecnologías Utilizadas

### Frontend

- **HTML5**: Estructura semántica con elementos apropiados
- **CSS3**: Grid, Flexbox, Custom Properties, animaciones
- **JavaScript ES6+**: Módulos, clases, arrow functions

### APIs del Navegador

- **Drag & Drop API**: Para la interacción con los peones
- **LocalStorage**: Para persistencia de datos
- **DOM API**: Manipulación dinámica del tablero

### Características Técnicas

- **Programación orientada a objetos**: Clase principal `HexapawnGame`
- **Gestión de estado**: Estado centralizado del juego
- **Validación de movimientos**: Lógica robusta de reglas
- **Detección de victoria**: Algoritmos para condiciones de fin de juego

## 🎨 Personalización

### Colores del Tema

```css
:root {
  --primary-color: #00ff41;    /* Verde neón */
  --secondary-color: #ff6b35;  /* Naranja */
  --background-dark: #0a0a0a;  /* Negro profundo */
}
```

### Modificar la IA

La lógica de la computadora está en el método `makeComputerMove()`. Puedes:

- Cambiar la priorización de movimientos
- Implementar algoritmos más sofisticados (minimax, etc.)
- Ajustar el delay de respuesta

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Los peones no se mueven**: Verifica que sea tu turno y el juego no haya terminado
2. **Estadísticas no se guardan**: Comprueba que LocalStorage esté habilitado
3. **Estilos no se cargan**: Verifica las rutas de los archivos CSS

### Compatibilidad

- **Chrome/Edge**: Totalmente compatible
- **Firefox**: Totalmente compatible  
- **Safari**: Compatible (iOS 10+)
- **Internet Explorer**: No compatible (requiere ES6+)

## 📈 Futuras Mejoras

### Posibles Características

- [ ] IA más inteligente con algoritmo minimax
- [ ] Modo multijugador local
- [ ] Diferentes niveles de dificultad
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
