export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
}

const initialState = {
    status: StatusFilters.All,
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
            const { color:selectedColor, changeType } = action.payload
            if(changeType === 'added') {
                return {
                    ...state,
                    colors: [...state.colors, selectedColor]
                }
            }else if(changeType === 'removed'){
                return {
                    ...state,
                    colors: state.colors.filter(color => color !== selectedColor)
                }
            }else{
                return state
            }
        }
        default:
            return state
    }
}

export const selectedColors = state => state.filters.colors

export const selectedStatus = state => state.filters.status