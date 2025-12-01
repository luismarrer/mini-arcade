// @ts-check

/**
 * @typedef {Object} MemoryConfig
 * @property {string} tarjetas
 * @property {string} dificultad
 * @property {string} artefactos
 */

/**
 * Attach submit handler to the configuration form.
 * @param {HTMLFormElement} form
 */
const attachConfigHandler = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(form)
    /** @type {MemoryConfig} */
    const config = {
      tarjetas: String(data.get('tarjetas') ?? '12'),
      dificultad: String(data.get('dificultad') ?? 'baja'),
      artefactos: String(data.get('artefactos') ?? '0'),
    }

    sessionStorage.setItem('memoryGameConfig', JSON.stringify(config))

    window.location.href = '/memory'
  })
}

const init = () => {
  const form = document.querySelector('form')
  if (!(form instanceof HTMLFormElement)) return
  attachConfigHandler(form)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
