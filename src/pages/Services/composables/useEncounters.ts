import { Ref, ref, unref, watch } from 'vue'
import { getUsers, updateUser, addUser, removeUser, type Filters, Pagination, Sorting } from '../../../data/pages/users'
import { ServicesStore } from '../../../stores/services';
import helperGenerator from '../helper/helperGenerator'


import { User } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ current_page: 1, per_page: 10, total: 0, total_pages: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'fullname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useEncounters = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const encounters = ref<User[]>([])
  const types = ref<User[]>([])
  const store = ServicesStore()

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data } = await store.GET_LIST_OF_ECOUNTER_CLASSES().then((e) => {
      return e
    })
    encounters.value = data.data
    ignoreUpdates(() => {
      pagination.value = data.pagination
    })

    isLoading.value = false
  }

  const fetchChildren = async (parentId: string) => {
    isLoading.value = true
    try {
      await store.GET_LIST_OF_ECOUNTER_TYPES(parentId.code).then((e) => {
        types.value = e.data.data
        return e
      })

    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      isLoading.value = false
    }
  };



  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,
    filters,
    sorting,
    pagination,
    encounters,
    fetchChildren,
    fetch,
    types,

    async add(encounter: Encounter) {
      isLoading.value = true
      await addUser(encounter)
      await fetch()
      isLoading.value = false
    },

    async update(encounter: Encounter) {
      isLoading.value = true
      await fetch()
      isLoading.value = false
    },

    async remove(encounter: Encounter) {
      isLoading.value = true
      await removeUser(encounter)
      await fetch()
      isLoading.value = false
    },
  }
}
