const initialState = {
    status: 'All',
    colors: []
}

export default function filtersReducer(state = initialState, action) {
    switch (action.type) {
        case 'filters/statusFilterChanged': {
            return {
                ...state,
                status: action.payload
            }
        }
        case 'filters/colorsFilterChanged': {
            if(action.payload.changeType === 'added') {
                return {
                    ...state,
                    colors: [...state.colors, action.payload.color]
                }
            }else if(action.payload.changeType === 'removed'){
                return {
                    ...state,
                    colors: state.colors.filter(color => color !== action.payload.color)
                }
            }else{
                return state
            }
        }
        default:
            return state
    }
}