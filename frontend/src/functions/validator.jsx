import store from '../redux/store'

function validator (  detail , history ) {
    switch(detail){

        case 'token invalid':
            store.dispatch(logOut())
            /*
            history.push('/login')
            alert('Por favor vuelva a iniciar sesion')*/
            break;

        case 'token expired':
            store.dispatch(logOut())
            /*
            history.push('/login')
            alert('Por favor vuelva a iniciar sesion')*/
            return 

        case 'problem db':
            alert('error')
        break;
        
        case 'not allowed':
            return

        case 'admin granted':
            return
            
        default:
            
    }
}

const logOut = ()=>{
    return { 
       type: 'LOG_OUT'
    }
}

export default validator;