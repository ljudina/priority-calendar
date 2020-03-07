import { configure } from 'enzyme'; 
import Adapter from 'enzyme-adapter-react-16';
import {validate} from './validation';

configure({ adapter: new Adapter() });

//Set rules
const required = { required: true };
const minLength = { minLength: 5 };
const maxLength = { maxLength: 7 };
const emailValidation = { isEmail: true };
const numericValidation = { isNumeric: true };
const dateValidation = { isDate: true };
const fixedValueValidation = { isFixedValue: { validValues: ['only', 'valid', 'values'] }};

describe('utility/validation', () => {
    //Check blank space
    it('validate/required: value empty string', () => {        
        const isValid = validate('', required)[0];
        expect(isValid).toEqual(false);
    });
    //Check null
    it('validate/required: null value', () => {        
        const isValid = validate(null, required)[0];
        expect(isValid).toEqual(false);        
    });
    //Check empty object
    it('validate/required: empty object', () => {        
        const obj = {};
        const isValid = validate(obj, required)[0];
        expect(isValid).toEqual(false);        
    });
    //Check valid string
    it('validate/required: valid string', () => {        
        const isValid = validate("This is test", required)[0];
        expect(isValid).toEqual(true);
    });
    //Check string length less than minimum length
    it('validate/minLength: less than minimum length', () => {        
        const isValid = validate("Less", minLength)[0];
        expect(isValid).toEqual(false);
    });
    //Check string length more than minimum length
    it('validate/minLength: more than minimum length', () => {        
        const isValid = validate("More than minimum length", minLength)[0];
        expect(isValid).toEqual(true);
    });
    //Check string length less than maximum length
    it('validate/maxLength: less than maximum length', () => {        
        const isValid = validate("Maximum", maxLength)[0];
        expect(isValid).toEqual(true);
    });
    //Check string length more than maximum length
    it('validate/maxLength: more than maximum length', () => {        
        const isValid = validate("More than maximum length", maxLength)[0];
        expect(isValid).toEqual(false);
    });    
    //Check invalid email string 
    it('validate/email: invalid email', () => {            
        const isValid = validate("invalidemail", emailValidation)[0];
        expect(isValid).toEqual(false);
    });
    //Check valid email string 
    it('validate/email: valid email', () => {            
        const isValid = validate("office@company.com", emailValidation)[0];
        expect(isValid).toEqual(true);
    });   
    //Check invalid numeric string 
    it('validate/numeric: invalid number', () => {            
        const isValid = validate("notnumber", numericValidation)[0];
        expect(isValid).toEqual(false);
    });
    //Check valid numeric string 
    it('validate/numeric: valid number', () => {            
        const isValid = validate("123", numericValidation)[0];
        expect(isValid).toEqual(true);
    });
    //Check invalid date string    
    it('validate/date: invalid date', () => {            
        const isValid = validate("notadate", dateValidation)[0];
        expect(isValid).toEqual(false);
    });    
    //Check valid date string
    it('validate/date: valid date', () => {                
        const isValid = validate("2020-01-01", dateValidation)[0];
        expect(isValid).toEqual(true);
    });
    //Check invalid fixed value string
    it('validate/fixed: invalid fixed value', () => {                
        const isValid = validate("not_in_array", fixedValueValidation)[0];
        expect(isValid).toEqual(false);
    });        
    //Check valid fixed value string    
    it('validate/fixed: valid fixed value', () => {                
        const isValid = validate("valid", fixedValueValidation)[0];
        expect(isValid).toEqual(true);
    });
});