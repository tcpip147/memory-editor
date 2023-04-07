const initialState = {
    value: 0
};

const testReducer = function (state = initialState, action) {
    if (action.type == "test") {
        return { ...state, value: state.value + 1 };
    }
    return state;
};

export default testReducer;