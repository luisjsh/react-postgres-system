import store from '../redux/store'

function validator (  detail , history ) {
    switch(detail){

        case 'error de conexion':
            setBadNotification('Error de conexion')
            break;

        case 'token invalid':
            store.dispatch(logOut())
            history.push('/login')
            setBadNotification('Por favor vuelva a iniciar sesion')
            break;

        case 'token expired':
            store.dispatch(logOut())
            history.push('/login')
            setBadNotification('Por favor vuelva a iniciar sesion')
            return 

        case 'problem db':
            setBadNotification('Error con la base de datos')
            break;
        
        case "user not registered":
            store.dispatch(logOut())
            history.push('/login')
            break;

        case 'not allowed':
            return

        case 'admin granted':
            store.dispatch(setAdmin())
            break;
            
        default:
            
    }
}

const logOut = ()=>{
    return { 
       type: 'LOG_OUT'
    }
}

const setBadNotification = (message) => {
    return {
        type: 'SET_BAD_NOTIFICATION',
        payload: message
    }
}

const setAdmin = ()=>{
    return {
        type: 'ADMIN'
    }
}

export default validator;