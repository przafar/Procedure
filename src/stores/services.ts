// src/stores/cards.ts
import { defineStore } from 'pinia'
import axios from '../plugins/axios'

export const ServicesStore = defineStore('service', {
  state: () => ({
    loading: false,
    encounterClasses: [],
    encounterTypes: [],
  }),
  getters: {
    getFilter: (state) => state.filter,
    getEncounterClasses: (state) => state.encounterClasses,
    getEncounterTypes: (state) => state.encounterTypes,
  },
  actions: {
    async GET_LIST_OF_ECOUNTER_CLASSES(params: any) {
      return await axios
        .get('valuesets/encounter_classes', { params: params })
        .then((e) => {
          this.encounterClasses = e.data.data
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async GET_LIST_OF_ECOUNTER_TYPES(params: string) {
      return await axios
        .get(`valuesets/encounter_types/${params}`)
        .then((response) => {
          this.encounterTypes = response.data.data
          return response
        })
        .catch((error) => {
          console.error('Error fetching encounter types:', error)
          throw error // Переброс ошибки для обработки выше
        })
    },
    async CREATE_ENCOUNTER_CLASSES(body: any) {
      return await axios
        .post('valuesets/encounter_classes', body)
        .then((e) => {
          console.log(e, 'Success')
          return e
        })
        .catch((error) => {
          return error
        })
    },
    async CREATE_ENCOUNTER_TYPES(body: any) {
      return await axios
        .post('valuesets/encounter_types', body)
        .then((e) => {

          return e
        })
        .catch((error) => {
          return error
        })
    },
    // async UPDATE_PATIENT(body: any, id: string) {
    //   return await axios
    //     .put(`patients/${id}`, body)
    //     .then((e) => {
    //       console.log(e, 'Success')
    //       return e
    //     })
    //     .catch((error) => {
    //       return error
    //     })
    // },
  },
})
