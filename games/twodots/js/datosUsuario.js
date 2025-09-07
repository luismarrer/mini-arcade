/*
* JS Para la gestión de los datos de usuario
*
*/

//sessionStorage

/**
 * Almacenar los datos en el sessionStorage
 * @param {String} nick nick del usuario
 * @param {Number} tamano tamaño del panel
 * @param {String} avatarCont avatar del usuario
 */
const datosUsuario = (nick, tamano, avatarCont) => {
    sessionStorage.setItem('nick', nick)
    sessionStorage.setItem('tamano', tamano)
    sessionStorage.setItem('avatarImg', avatarCont)
}

/**
 * Recoge los datos de la sesion del sessionStage
 */
const getDatosUsuario = () => {
    nick = sessionStorage.getItem('nick')
    tamano = parseInt(sessionStorage.getItem('tamano'))
    avatarImg = sessionStorage.getItem('avatarImg')
}

/**
 * Comprueba si existe nick en el sessionStorage
 */
const comprobacionDatosUsuario = () => {
    if (nick == null) {
        sessionStorage.setItem('error','No se ha rellenado correctamente el formulario')
        return false
    }
    return true
}

//localStorage
/**
 * Crea y almacena en el localStorage el histórico de entrada
 * 
 * @param  {String} nick nick del usuario
 */
const historicoUsuarios = (nick) => {
    let historicoStorage=localStorage.getItem('historico')
    let historico=[]
    if (historicoStorage == null) {
        historico=[]
    } else {
        historico=JSON.parse(historicoStorage)
    }
    let registroUsuario={
        usuario:nick,
        fecha:Date.now()
    }
    historico.push(registroUsuario)
    localStorage.setItem('historico',JSON.stringify(historico))
}

export { datosUsuario }