// src/stores/cards.ts
import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { filter } from './properties/appointmentsFilter'

export const appointmentStore = defineStore('appointment', {
  state: () => ({
    loading: false,
    listOfPatients: [],
    filter: JSON.parse(JSON.stringify(filter)),
    appointmentInfo: {}
  }),
  getters: {
    getFilter: (state) => state.filter,
  },
  actions: {
    async GET_LIST_OF_APPOINTMENTS(params: any) {
      return await axios
        .get('appointments', { params: params })
        .then((e) => {
          this.listOfPatients = e.data
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async GET_BY_ID(parentId: any) {
      return await axios
        .get(`appointments/${parentId}`)
        .then((e) => {
          this.appointmentInfo = e.data
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async CREATE_APPOINTMENT(body: any) {
      return await axios
        .post('appointments', body)
        .then((e) => {
          console.log(e, 'Success')
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async UPDATE(id: string, body: any) {
      return await axios
        .put(`appointments/${id}`, body)
        .then((e) => {
          console.log(e, 'Success')
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async UPDATE_STATUS(id: string, body: any) {
      return await axios
        .put(`appointments/${id}/status`, body)
        .then((e) => {
          console.log(e, 'Success')
          return e
        })
        .catch((error) => {
          return error
        })
    },
  },
})
