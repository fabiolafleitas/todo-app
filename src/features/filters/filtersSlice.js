import { createSlice } from '@reduxjs/toolkit'

export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
}

const initialState = {
    status: StatusFilters.All,
    colors: []
}

const filtersSlice = createSlice({
   name: 'filters',
   initialState,
   reducers: {
       statusFilterChanged(state, action) {
           state.status = action.payload
       },
       colorsFilterChanged: {
           reducer(state, action) {
               const { color, changeType } = action.payload
               if(changeType === 'added') {
                   state.colors.push(color)
               }else if(changeType === 'removed'){
                   state.colors = state.colors.filter(c => c !== color)
               }else{
                   return state
               }
           },
           prepare(color, changeType) {
               return {
                   payload: { color, changeType }
               }
           }
       }
   }
})

export const { statusFilterChanged, colorsFilterChanged } = filtersSlice.actions

export default filtersSlice.reducer

export const selectedColors = state => state.filters.colors

export const selectedStatus = state => state.filters.status
