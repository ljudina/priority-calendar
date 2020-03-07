import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PopUpMessage from '../../../shared/popUpMessage';

import { configure, shallow } from 'enzyme'; 
import Adapter from 'enzyme-adapter-react-16';

import { SignUp } from './SignUp';

configure({ adapter: new Adapter() });

describe('<SignUp />', () => {
    //Init wrapper
    let wrapper;
    //Shallow load component
    beforeEach(() => {
        wrapper = shallow(<SignUp error={{message: ''}} />);
    });
    //On loading spinner should be showing
    it('on loading spinner should be showing', () => {
        wrapper.setProps({loading: true, error: { message: ''}});
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });        
    //Show error message on error
    it('should show error message on error', () => {
        wrapper.setProps({error: { message: "This is error"}});
        expect(wrapper.contains(<PopUpMessage message="This is error" type="error" open />)).toEqual(true);
    });
});