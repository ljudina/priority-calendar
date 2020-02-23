export const validate = (value, rules) => {
    let isValid = true;
    let errorMessage = '';
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
        if(!isValid){
            errorMessage = rules.required.errorMessage;
        }
    }

    if (rules.minLength && isValid) {
        isValid = value.length >= rules.minLength && isValid;
        if(!isValid){
            errorMessage = rules.minLength.errorMessage;
        }        
    }

    if (rules.maxLength && isValid) {
        isValid = value.length <= rules.maxLength && isValid;
        if(!isValid){
            errorMessage = rules.maxLength.errorMessage;
        }
    }

    if (rules.isEmail && isValid) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
        if(!isValid){
            errorMessage = rules.isEmail.errorMessage;
        }        
    }

    if (rules.isNumeric && isValid) {
        const numberPattern = /^\d+$/;
        isValid = numberPattern.test(value) && isValid;
        if(!isValid){
            errorMessage = rules.isNumeric.errorMessage;
        }                
    }

    if (rules.isDate && isValid) {      
        const date = new Date(value);
        isValid = date.toString() !== "Invalid Date" && isValid;
        if(!isValid){
            errorMessage = rules.isDate.errorMessage;
        }
    }

    if (rules.isFixedValue && isValid) {
        if(value){
            isValid = rules.isFixedValue.validValues.includes(value) && isValid;
            if(!isValid){
                errorMessage = rules.isFixedValue.errorMessage;
            }   
        }
    }

    return [isValid, errorMessage];
}//~!

export const validateData = (data) => {
    //Init valid flag
    let isValid = true;
    //Set field update
    let dataUpdate = {...data};
    //Process all data fields
    Object.keys(data).forEach( key => {
      //Check for validation
      if(data[key].validation){
        //Init validate flag
        let validateInput = true;
        //Check for dependency
        if(data[key].validation.dependency){
          validateInput = data[data[key].validation.dependency.key].value === data[key].validation.dependency.value;
        }
        //Process validation
        if(validateInput){
          const [entryValid, entryError] = validate(data[key].value, data[key].validation);        
          dataUpdate[key] = {...data[key], notValid: !entryValid, helperText: entryError};        
          isValid = isValid && entryValid;
        }
      }
    });
    //Check for password and confirm password
    if(data.password !== undefined && data.confirmPassword !== undefined){
        if(data.password.value !== data.confirmPassword.value){
            isValid = false;
            dataUpdate.password.notValid = true;
            dataUpdate.password.helperText = "Password and confirm password must match!";
            dataUpdate.confirmPassword.notValid = true;
            dataUpdate.confirmPassword.helperText = "Password and confirm password must match!";
          }
    }
    //Return success array
    return [isValid, dataUpdate];
}//~!