
function validator (  detail , history , logOut ) {
     if ( detail.search('tokeninvalid') !== -1 || detail.search('token expired') !== -1){
        
        if ( history.location.pathname != '/login'){
            logOut();
        }

     } else if( detail.search('not allowed') !== -1 ){
        return false

     } else if ( detail.search('admin granted') !== -1) {
         return true
     }

     }

export default validator;