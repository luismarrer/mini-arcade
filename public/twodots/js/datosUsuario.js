/*
* JS for user data management
*
*/

//sessionStorage

/**
 * Store data in sessionStorage
 * @param {String} nick user nickname
 * @param {Number} size board size
 * @param {String} avatarCont user avatar
 */
const saveUserData = (nick, size, avatarCont) => {
    sessionStorage.setItem('nick', nick)
    sessionStorage.setItem('size', size)
    sessionStorage.setItem('avatarImg', avatarCont)
}

/**
 * Gets session data from sessionStorage
 */
const getUserData = () => {
    nick = sessionStorage.getItem('nick')
    size = parseInt(sessionStorage.getItem('size'))
    avatarImg = sessionStorage.getItem('avatarImg')
}

/**
 * Checks if nick exists in sessionStorage
 */
const validateUserData = () => {
    if (nick == null) {
        sessionStorage.setItem('error','The form was not filled out correctly')
        return false
    }
    return true
}

//localStorage
/**
 * Creates and stores user history in localStorage
 * 
 * @param  {String} nick user nickname
 */
const saveUserHistory = (nick) => {
    let historyStorage=localStorage.getItem('history')
    let history=[]
    if (historyStorage == null) {
        history=[]
    } else {
        history=JSON.parse(historyStorage)
    }
    let userRecord={
        user:nick,
        date:Date.now()
    }
    history.push(userRecord)
    localStorage.setItem('history',JSON.stringify(history))
}

export { saveUserData }