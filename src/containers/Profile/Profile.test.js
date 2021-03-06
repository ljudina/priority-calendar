import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PopUpMessage from '../../shared/popUpMessage';

import { configure, shallow } from 'enzyme'; 
import Adapter from 'enzyme-adapter-react-16';

import { Profile } from './Profile';

configure({ adapter: new Adapter() });

describe('<Profile />', () => {
    //Init wrapper
    let wrapper;
    //Shallow load component
    beforeEach(() => {
        wrapper = shallow(<Profile error="" history={{location:{ pathname: "" }}} />);
    });
    //On loading spinner should be showing
    it('on loading spinner should be showing', () => {
        wrapper.setProps({loading: true, error: { message: ''}});
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });        
    //On saving spinner should be showing
    it('on saving spinner should be showing', () => {
        wrapper.setProps({saving: true, error: { message: ''}});
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });            
    //Show error message on error
    it('should show error message on error', () => {
        wrapper.setProps({error: "This is error"});
        expect(wrapper.contains(<PopUpMessage message="This is error" type="error" open />)).toEqual(true);
    });
    //Show success message on success
    it('should show success message on success', () => {
        wrapper.setProps({ success: "This is success message" });
        expect(wrapper.contains(<PopUpMessage message="This is success message" type="success" open />)).toEqual(true);
    });    
});