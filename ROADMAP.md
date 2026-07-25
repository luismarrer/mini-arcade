# Mini Arcade — Roadmap 🕹️

> Última actualización: 17 de julio de 2026.

Mini Arcade será una colección pequeña y cuidada de juegos web: rápida, accesible y divertida sin exigir una cuenta. Las cuentas añadirán identidad, progreso y puntuaciones, pero el modo invitado seguirá siendo una experiencia completa.

## Dirección del producto

- **Experiencia visual:** una cabina común para toda la web y una identidad propia para cada juego. Se compartirán navegación, estructura, HUD, controles, estados y calidad; cada juego conservará su paleta, ilustración, sonido y personalidad.
- **Arquitectura:** Astro para rutas, layouts, contenido y SEO; React para juegos y otras islas interactivas; TypeScript estricto; Tailwind para componentes, manteniendo en CSS global únicamente tokens, fuentes, resets y primitivas realmente compartidas.
- **Cuentas opcionales:** todos los juegos deben funcionar como invitado. Iniciar sesión servirá para conservar avatar, nickname, mejores resultados y puntos.
- **Calidad antes que cantidad:** no añadir juegos nuevos hasta que los juegos existentes cumplan la definición de `Playable`.

## Estado actual

- ✅ Astro, React, TypeScript y Tailwind están instalados y en uso.
- ✅ Cuatro juegos figuran como jugables: Pair Memory, Two Dots, Hexapawn y Hangman.
- ✅ Stack, MonkeyType y Tetris tienen páginas de progreso.
- 🟡 Supabase, registro, login y perfil tienen una implementación parcial en el cliente.
- 🟡 La migración a Tailwind y el responsive son parciales.
- 🟡 Cada ruta tiene título y descripción básicos para SEO.
- ⬜ No existe todavía un backend reproducible, persistencia común de partidas, sistema global de puntos, PWA ni suite de pruebas.

## Orden de trabajo

| Prioridad | Hito | Resultado |
| --- | --- | --- |
| P0 | Decisiones y quick wins | Backend y dirección visual decididos; estados del catálogo fiables |
| P0 | Backend y cuentas | Perfiles reproducibles, seguros y utilizables de principio a fin |
| P0 | Resultados y puntos | Contrato común de partida, mejores marcas y puntos persistentes |
| P1 | Sistema de experiencia de juego | Componentes, responsive y criterios de calidad compartidos |
| P1 | Pulido de juegos existentes | Los cuatro juegos actuales se sienten terminados |
| P1 | Juegos pendientes | MonkeyType, Stack y Tetris llegan a `Playable` uno por uno |
| P2 | Descubrimiento y distribución | SEO, PWA, rendimiento, QA y despliegue listos para v1 |
| Backlog | Próximos juegos | Rompebloques, 3 en raya, plataformas y Buscaminas |
| Más adelante | Expansión | Leaderboards públicos, multijugador y más juegos |

## P0 — Decisiones y quick wins

### 1. Decidir el backend

- [ ] Escribir una decisión técnica corta comparando Supabase Cloud, otra alternativa administrada y self-hosting según coste en reposo, Auth, SQL, RLS, backups, portabilidad y mantenimiento.
- [ ] Confirmar si el producto necesita disponibilidad permanente durante la beta o si puede tolerar que las cuentas se desactiven temporalmente mientras los juegos siguen funcionando como invitado.
- [ ] Definir qué datos se recopilarán, cuánto tiempo se conservarán y si el producto se presenta como dirigido a menores o como una web de público general.

**Propuesta inicial:** continuar con Supabase Cloud Free durante desarrollo y beta. El código ya usa Supabase y Postgres facilita migrar los datos en el futuro. El plan gratuito puede pausar proyectos con poca actividad después de una semana, permite restaurarlos desde el dashboard durante 90 días y no incluye backups automáticos; por eso el proyecto debe tener migraciones versionadas, exportaciones periódicas y degradación elegante. El salto a Pro se hará cuando se prometa disponibilidad permanente, haya datos reales que proteger o la actividad justifique los USD 25 al mes, no antes.

- [Documentación de pausa de proyectos](https://supabase.com/docs/guides/platform/free-project-pausing)
- [Precios de Supabase](https://supabase.com/pricing)
- [Backups de base de datos](https://supabase.com/docs/guides/platform/backups)

No se recomienda self-hosting solo para evitar la tarifa: actualizaciones, seguridad, correo, backups y monitoreo pasarían a ser trabajo propio.

### 2. Fijar la dirección visual

- [ ] Crear una referencia breve de la “cabina Mini Arcade”: tipografía, tokens, espaciado, superficies, botones, HUD, diálogos y motion.
- [ ] Definir qué elementos son constantes y cuáles puede personalizar cada juego.
- [ ] Probar la dirección con un juego antes de aplicarla a los demás.

### 3. Arreglar los estados del catálogo

- [x] Definir tres estados claros: `playable`, `in-development` y `planned`.
- [x] Reparar los tags `Playable` e `In development` y convertirlos en un componente reutilizable.
- [x] Asegurar copy, contraste, icono, alineación y comportamiento correcto desde 320 px, sin depender únicamente del color.
- [x] Usar `src/constants/games.ts` como única fuente para badges, grupos, cantidades, CTA y rutas.
- [x] Revisar que cada afirmación del catálogo coincida con el juego real. En especial, implementar aprendizaje en Hexapawn o dejar de describir su computadora como una que aprende.

## P0 — Backend y cuentas

### 1. Backend reproducible

- [ ] Añadir Supabase CLI, configuración local, migraciones y seeds al repositorio.
- [ ] Corregir y documentar las variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Eliminar el cliente Supabase duplicado y mantener una sola integración tipada.
- [ ] Crear el esquema inicial: `profiles`, `game_sessions` y un ledger de puntos; derivar mejores marcas mediante consulta o vista.
- [ ] Crear constraints para `user_id`, nickname único sin distinguir mayúsculas y claves válidas de avatar.
- [ ] Crear el perfil automáticamente y de forma atómica al registrarse un usuario.
- [ ] Implementar RLS y probar que un jugador no pueda leer o modificar datos privados de otro.
- [ ] Generar los tipos TypeScript desde el esquema, en vez de mantenerlos a mano.
- [ ] Versionar el procedimiento de exportación, restauración y migración a otro Postgres.
- [ ] Mostrar un estado de servicio comprensible cuando Supabase no esté configurado, esté pausado o no responda.

### 2. Flujo de cuenta completo

- [ ] Registro con validación y manejo correcto de nickname duplicado.
- [ ] Confirmación y reenvío de email, si se decide exigir email.
- [ ] Login, logout y persistencia de sesión.
- [ ] Recuperación y cambio de contraseña.
- [ ] Perfil editable: nickname y uno de los avatares estáticos existentes.
- [ ] Eliminación de cuenta y datos asociados.
- [ ] Distinguir en la UI entre “sin sesión”, “perfil incompleto” y “error de servicio”.
- [ ] Crear un `PlayerProvider` compartido y retirar nombres o avatares hardcodeados dentro de los juegos.
- [ ] Mantener el modo invitado con progreso local aunque el backend no esté disponible.

### Criterios de salida

- Una instalación limpia puede recrear el backend únicamente desde el repositorio.
- Registro → confirmación → login → edición → logout → recuperación funciona en móvil y escritorio.
- Las políticas de base de datos niegan escrituras no autorizadas.
- Ninguna caída o pausa de Supabase impide jugar como invitado.

## P0 — Resultados, mejores marcas y puntos

- [ ] Definir un contrato `GameResult` común con `gameId`, versión de reglas, modo/dificultad, resultado, score nativo, duración y metadata permitida.
- [ ] Separar tres conceptos:
    - **Score:** resultado propio de cada juego.
    - **Mejor marca:** mejor score del jugador por juego, modo y versión.
    - **Puntos/XP:** progreso global comparable, calculado con reglas del servidor.
- [ ] Emitir el resultado una sola vez al terminar una partida y hacerlo idempotente.
- [ ] Persistir sesiones y mejores marcas para usuarios autenticados.
- [ ] Calcular los puntos mediante una función/RPC controlada; el navegador nunca enviará un total de puntos arbitrario.
- [ ] Mostrar puntos totales, historial básico y mejores marcas en el perfil.
- [ ] Guardar resultados de invitado localmente. En la primera versión, las partidas offline no entrarán en rankings públicos.
- [ ] Añadir pruebas para duplicados, versiones de reglas, permisos y manipulación básica del cliente.

El sistema de puntos depende de cerrar las reglas y el scoring de cada juego. No se asignarán equivalencias globales hasta que esas specs estén definidas.

## P1 — Sistema compartido de experiencia de juego

- [ ] Crear componentes comunes: `GameShell`, tutorial/instrucciones, configuración, HUD, pausa, resultado, replay y controles de sonido.
- [ ] Unificar estados de carga, listo, jugando, pausado, ganado, perdido y error.
- [ ] Unificar el registro y la resolución de rutas para que ningún juego pueda publicar una página vacía por un wrapper ausente o una excepción hardcodeada.
- [ ] Definir tokens de color, tipografía, espacio, elevación, focus y motion; permitir un accent por juego.
- [ ] Completar la migración a Tailwind componente por componente y retirar CSS específico obsoleto. `global.css` conservará solo la base compartida.
- [ ] Mantener Astro para páginas estáticas y React para interacción; “completar la migración” no significa convertir toda la web en una SPA.
- [ ] Diseñar primero para touch y viewport pequeño, añadiendo teclado y layouts amplios progresivamente.
- [ ] Validar 320, 375, 768, 1024 y 1440 px, orientación horizontal y dispositivos con hover/no-hover.
- [ ] Asegurar foco visible, navegación por teclado, labels, live regions, contraste y `prefers-reduced-motion`.
- [ ] Añadir tests unitarios para lógica pura/hooks y smoke tests de rutas; conservar una checklist manual para interacción y responsive.

### Definición de `Playable`

Un juego solo puede llevar este tag cuando:

- Tiene un loop completo y reglas explicadas dentro de la experiencia.
- Sus estados de inicio, juego, victoria/derrota y replay funcionan sin recargar la página.
- Los controles de touch y/o teclado son claros, no se bloquean y evitan input accidental.
- La puntuación es comprensible y emite un `GameResult` válido.
- Funciona como invitado y mejora de forma no bloqueante al iniciar sesión.
- Es usable desde 320 px, en orientación horizontal y con zoom de texto razonable.
- Cumple la revisión básica de accesibilidad, rendimiento y movimiento reducido.
- No tiene errores conocidos que rompan el loop principal.
- Tiene título, descripción, instrucciones y preview coherentes con la implementación real.

## P1 — Iterar los juegos existentes

Antes de tocar cada juego, escribir una spec de una página: fantasía, loop, reglas, controles, scoring, estados, dirección visual, sonido, accesibilidad y criterios de aceptación.

### Pair Memory

- [ ] Decidir si un “movimiento” es una carta o un intento de pareja y hacer que HUD, límites y scoring coincidan.
- [ ] Retirar el polling legacy de `window.MemoryGame` y cancelar timers pendientes al reiniciar o desmontar.
- [ ] Corregir el bloqueo que puede dejar una sola carta abierta cuando queda un número impar de movimientos.
- [ ] Pulir selección de dificultad, distribución responsive, giro de cartas, bloqueo de input y resultado.
- [ ] Revisar balance de número de cartas, tiempo visible y movimientos disponibles.
- [ ] Integrar perfil opcional, `GameResult`, mejor marca y replay.

### Two Dots

- [ ] Afinar drag/touch, adyacencia, feedback de la ruta y cancelación al salir del tablero.
- [ ] Convertir los dots en controles accesibles y ampliar sus targets táctiles sin alterar la cuadrícula.
- [ ] Decidir reglas definitivas de reposición, combos y scoring.
- [ ] Hacer claro cuándo comienza el reloj y asegurar que pausa/background no produzca resultados incorrectos.
- [ ] Integrar perfil opcional, `GameResult`, mejor marca y replay.

### Hexapawn

- [ ] Decidir entre IA simple honesta o IA que aprende y alinear nombre, descripción y comportamiento.
- [ ] Mejorar explicación de reglas, selección, movimientos válidos, turno de la computadora y resultado.
- [ ] Revisar hidratación del estado local, persistencia, reinicio, temporizadores y controles touch/teclado.
- [ ] Integrar perfil opcional, `GameResult`, estadísticas y replay.

### Hangman

- [ ] Definir idioma, fuente de palabras, dificultad, categorías y tratamiento de acentos.
- [ ] Revisar teclado físico/virtual, letras repetidas, feedback accesible y todas las condiciones de final.
- [ ] Aumentar los targets del teclado móvil y alinear el alfabeto disponible con el diccionario real.
- [ ] Diseñar scoring y progresión sin depender solo de la ilustración del ahorcado.
- [ ] Integrar perfil opcional, `GameResult`, mejor marca y replay.

Cada juego se trabaja y se valida por separado. No se hará un rediseño simultáneo de los cuatro.

## P1 — Terminar los juegos pendientes

Orden propuesto: cerrar primero el loop más pequeño y dejar el motor más complejo para el final.

### MonkeyType

- [ ] Definir corpus, duración/modos y comportamiento de espacio, backspace, foco e IME.
- [ ] Implementar cursor, texto correcto/incorrecto, tiempo, WPM, precisión y resultado.
- [ ] Añadir reset rápido, controles de teclado y responsive.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

### Stack

- [ ] Implementar movimiento, colocación, recorte, fallo y loop de replay.
- [ ] Ajustar velocidad, cámara, dificultad, scoring y feedback de precisión.
- [ ] Añadir input de un toque/tecla, sonido opcional y rendimiento estable en móvil.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

### Tetris

- [ ] Separar un motor testeable para tablero, piezas, colisión, rotación y limpieza de líneas.
- [ ] Implementar randomizer, wall kicks, lock/drop, niveles y scoring.
- [ ] Añadir next/hold si entran en la spec, además de controles de teclado y touch.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

## Backlog — Próximos juegos

Estos juegos se diseñarán después de terminar los tres prototipos actuales. Arkanoid y Super Mario se usan como referencias de género; el nombre final, personajes, niveles, audio y assets de Mini Arcade serán originales.

### Rompebloques inspirado en Arkanoid

- [ ] Definir control de pala para teclado, pointer y touch.
- [ ] Implementar pelota, ángulo de rebote, colisiones, bloques, vidas y condición de victoria/derrota.
- [ ] Diseñar niveles, power-ups y progresión de velocidad sin perder legibilidad en móvil.
- [ ] Definir identidad y nombre propios, integrar `GameResult` y pasar la definición de `Playable`.

### 3 en raya

- [Referencia compartida](https://www.youtube.com/watch?v=oWPFcuH8x6M)
- [ ] Empezar con modo local para dos jugadores y decidir después si incluir una IA.
- [ ] Implementar turnos, validación de casillas, victoria, empate, replay y marcador de rondas.
- [ ] Diseñar interacción accesible por teclado/touch y feedback que no dependa solo del color.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

### Plataformas inspirado en Super Mario

- [Referencia compartida](https://www.youtube.com/watch?v=RBYCgS8Et7Y&t=61s)
- [ ] Definir un vertical slice pequeño con movimiento, salto, gravedad, colisiones y una meta.
- [ ] Añadir cámara, plataformas, peligros, coleccionables, enemigos y reinicio/checkpoint.
- [ ] Diseñar controles móviles, rendimiento, niveles, personajes y assets completamente originales.
- [ ] Evaluar una librería de juego solo después de escribir la spec técnica.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

### Buscaminas

- [ ] Implementar generación de tablero con primera jugada segura y distribución válida de minas.
- [ ] Añadir revelar, expansión de celdas vacías, banderas, victoria, derrota y replay.
- [ ] Definir dificultades, tablero personalizado, timer y mejor marca.
- [ ] Diseñar click derecho, teclado y long press sin sacrificar accesibilidad móvil.
- [ ] Integrar `GameResult` y pasar la definición de `Playable`.

## P2 — UI/UX, responsive y accesibilidad final

- [ ] Auditar navegación, home, catálogo, auth, perfil y todas las páginas de juego con el mismo sistema visual.
- [ ] Eliminar overflow, solapamientos, targets pequeños y saltos de layout.
- [ ] Añadir tutorial progresivo o ayuda contextual donde las reglas no sean evidentes.
- [ ] Añadir microanimaciones y sonido con controles globales de mute y movimiento reducido.
- [ ] Probar zoom al 200 %, solo teclado, lector de pantalla básico y contraste.
- [ ] Hacer playtests cortos y convertir observaciones repetidas en tareas concretas.

## P2 — SEO, PWA y producción

### SEO y descubrimiento

- [ ] Configurar la URL canónica del sitio, canonical por página, sitemap y `robots.txt`.
- [ ] Añadir Open Graph/Twitter cards y una imagen social estable.
- [ ] Añadir datos estructurados apropiados y breadcrumbs donde ayuden.
- [ ] Crear contenido indexable útil por juego: descripción, instrucciones, controles y preguntas básicas.
- [ ] Marcar páginas de desarrollo como `noindex` hasta que tengan contenido útil y estén listas.
- [ ] Decidir idioma principal y estrategia bilingüe antes de crear muchas URLs o copy.
- [ ] Crear 404 y revisar redirects, enlaces rotos, favicon y metadata social.

### PWA

- [ ] Añadir web app manifest, iconos instalables, theme colors y display mode.
- [ ] Implementar service worker con caché versionado para shell y assets de juegos `Playable`.
- [ ] Diseñar estados offline/online y un flujo de actualización que no deje assets mezclados.
- [ ] Hacer jugables offline los juegos de invitado. Auth, sincronización y rankings requerirán conexión.
- [ ] Validar instalación, primer arranque, segundo arranque offline y actualización en móvil/escritorio.

### Rendimiento, QA y despliegue

- [ ] Definir presupuestos de Lighthouse/Core Web Vitals, JS por ruta e imágenes.
- [ ] Reducir hidratación e importar cada isla React solo donde haga falta.
- [ ] Optimizar imágenes, fuentes y assets de juegos.
- [ ] Ejecutar `pnpm build` y smoke tests en CI por cada PR.
- [ ] Añadir preview deploy, monitoreo de errores y una verificación mínima de disponibilidad.
- [ ] Crear una checklist de release para auth, guest mode, responsive, win/loss/replay, offline y SEO.

## Más adelante

- [ ] Leaderboards públicos por juego, modo y versión, con controles de abuso y privacidad.
- [ ] Achievements y retos, solo si mejoran la experiencia en vez de inflar el sistema de puntos.
- [ ] Multijugador en tiempo real después de estabilizar cuentas, sesiones y reglas de cada juego.
- [ ] Juegos clásicos adicionales después de completar el backlog planificado.
- [ ] Automatización de contenido, eventos o temporadas si existe una audiencia que lo justifique.

## Hitos de lanzamiento

- **Foundation:** decisión de backend, dirección visual y estados del catálogo resueltos.
- **Accounts beta:** cuentas end-to-end, backend reproducible y modo invitado resiliente.
- **Polished arcade:** cuatro juegos actuales cumplen la definición de `Playable` y guardan resultados.
- **Expanded arcade:** MonkeyType, Stack y Tetris llegan a `Playable` uno por uno.
- **v1.0:** responsive, accesibilidad, SEO, PWA, rendimiento, QA y operación cerrados.
- **Next cabinet:** Rompebloques, 3 en raya, Plataformas y Buscaminas pasan del backlog a specs ejecutables.

No se asignan fechas hasta medir el primer ciclo completo de pulido de un juego. Ese dato permitirá estimar el resto con menos ficción y más evidencia.
