import { CommonUtils } from '../../utils';
import actionTypes from '../actions/actionTypes';

const initialState = {
    gender: [],
    roles: [],
    positions: []

}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            console.log('maithu start', action);
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copyState = { ...state };
            copyState.gender = action.data;
            console.log('maithu success', copyState);
            return {
                ...copyState
            }
        case actionTypes.FETCH_GENDER_FAIDED:
            console.log('maithu faile', action);
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;