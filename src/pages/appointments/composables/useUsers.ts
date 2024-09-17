import { Ref, ref, unref, watch } from 'vue'
import { getUsers, updateUser, addUser, removeUser, type Filters, Pagination, Sorting } from '../../../data/pages/users'
import { appointmentStore } from '../../../stores/appointment';

import { User } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ current_page: 1, per_page: 10, total: 0, total_pages: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'fullname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useUsers = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<User[]>([])
  const store = appointmentStore()

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data } = await store.GET_LIST_OF_APPOINTMENTS().then((e) => {
      console.log(e, 'data')
      return e
    })
    users.value = data.data
    ignoreUpdates(() => {
      pagination.value = data.pagination
    })

    isLoading.value = false
  }

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

    users,

    fetch,

    async add(user: User) {
      isLoading.value = true
      await addUser(user)
      await fetch()
      isLoading.value = false
    },

    async update(user: User) {
      isLoading.value = true
      await fetch()
      isLoading.value = false
    },

    async remove(user: User) {
      isLoading.value = true
      await removeUser(user)
      await fetch()
      isLoading.value = false
    },
  }
}
