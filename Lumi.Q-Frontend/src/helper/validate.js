import toast from 'react-hot-toast'

/** validate login page username */
export async function emailValidate(values){
    const errors = emailVerify({}, values);
    return errors;
}


function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!");
    } else if (!/^[A-Z0-9._%+-]+@lumiq\.ai$/i.test(values.email)) {
        error.email = toast.error("Please use an email ending with @lumiq.ai!");
    } 


    return error;
}

function passwordVerify(errors, values){
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }
}