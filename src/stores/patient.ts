// src/stores/cards.ts
import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { filter } from './properties/patientsFilter'

export const patientStore = defineStore('patient', {
  state: () => ({
    loading: false,
    listOfPatients: [],
    filter: JSON.parse(JSON.stringify(filter)),
    patientsInfo: {},
  }),
  getters: {
    getFilter: (state) => state.filter,
  },
  actions: {
    async GET_LIST_OF_PATIENTS(params: any) {
      return await axios
        .get('patients', { params: params })
        .then((e) => {
          this.listOfPatients = e.data
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async GET_BY_ID(parentId: number) {
      return await axios
        .get(`patients/${parentId}`)
        .then((e) => {
          this.patientsInfo = e.data
          return e.data
        })
        .catch((error) => {
          return error
        })
    },
    async CREATE_PATIENT(body: any) {
      return await axios
        .post('patients', body)
        .then((e) => {
          console.log(e, 'Success')
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async UPDATE_PATIENT(body: any, id: string) {
      return await axios
        .put(`patients/${id}`, body)
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
