import { AUTH_LOGOUT, AUTH_CHECK } from 'react-admin';
import axios from 'axios'
import { AUTH } from './routing'

export default (type, params) => {
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
    if (type === AUTH_CHECK) {
        return new Promise(async (resolve, reject) => {
            let token = localStorage.getItem('token')
            if(token){
                try {
                    let headers = { headers: {'Content-Type': 'application/json;charset=UTF-8'} }
                    let r = await axios.post(AUTH, { token : token }, headers)
                    if(r.data.status == 200){
                        resolve()
                    }else{
                        reject()
                    }
                }catch(e){
                    reject()
                }
            }else{
                reject()
            }
        })
    }
    return Promise.resolve();
}