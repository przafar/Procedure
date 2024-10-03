import { defineStore } from 'pinia'
import axios from '../plugins/axios'

export const prescriptionStore = defineStore('prescription', {
  state: () => ({
    loading: false,
    listOfPrescriptions: [],
    prescriptionInfo: {},
  }),
  getters: {
    getListOfPrescriptions: (state) => state.listOfPrescriptions,
    getPrescriptionInfo: (state) => state.prescriptionInfo,
  },
  actions: {
    // Get the list of prescriptions with optional filtering (pagination, appointment_id)
    async GET_LIST_OF_PRESCRIPTIONS(params: any) {
      this.loading = true
      try {
        const response = await axios.get('prescriptions', { params: params })
        this.listOfPrescriptions = response.data
        return response
      } catch (error) {
        return error
      } finally {
        this.loading = false
      }
    },

    // Get prescription by ID
    async GET_PRESCRIPTION_BY_ID(id: string) {
      this.loading = true
      try {
        const response = await axios.get(`prescriptions/${id}`)
        this.prescriptionInfo = response.data
        return response
      } catch (error) {
        return error
      } finally {
        this.loading = false
      }
    },

    // Create a new prescription
    async CREATE_PRESCRIPTION(body: any) {
      this.loading = true
      try {
        const response = await axios.post('prescriptions', body)
        console.log(response, 'Prescription created successfully')
        return response
      } catch (error) {
        return error
      } finally {
        this.loading = false
      }
    },

    // Update an existing prescription
    async UPDATE_PRESCRIPTION(id: string, body: any) {
      this.loading = true
      try {
        const response = await axios.put(`prescriptions/${id}`, body)
        console.log(response, 'Prescription updated successfully')
        return response
      } catch (error) {
        return error
      } finally {
        this.loading = false
      }
    },

    // Delete a prescription by ID
    async DELETE_PRESCRIPTION(id: string) {
      this.loading = true
      try {
        const response = await axios.delete(`prescriptions/${id}`)
        console.log(response, 'Prescription deleted successfully')
        return response
      } catch (error) {
        return error
      } finally {
        this.loading = false
      }
    },
    async PRINT_PRESCRIPTION(id: string) {
      this.loading = true
      try {
        const response = await axios.get(`prescriptions/${id}/pdf`, {
          responseType: 'blob', // Указываем тип ответа как blob для бинарных данных (PDF)
        })

        // Создаем URL для скачивания файла
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `prescription-${id}.pdf` // Имя файла
        link.click() // Программно вызываем клик для скачивания файла

        console.log('Prescription printed successfully')
        return response
      } catch (error) {
        console.error('Error printing prescription', error)
        return error
      } finally {
        this.loading = false
      }
    }

  },
})
