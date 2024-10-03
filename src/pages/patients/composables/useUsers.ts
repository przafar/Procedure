import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { patientStore } from '../../../stores/patient'
import { Filters, Pagination, User } from '../types'

const makePaginationRef = () => ref<Pagination>({
  current_page: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
})

const makeFiltersRef = () => ref<Partial<Filters>>({
  firstname: '',
  lastname: '',
  middlename: '',
  gender: null,
})

export const useUsers = (options?: {
  pagination?: ReturnType<typeof makePaginationRef>
  filters?: ReturnType<typeof makeFiltersRef>
}) => {
  const router = useRouter()    // Router instance for manipulating routes
  const route = useRoute()      // Route instance to access current route params

  const isLoading = ref(false)  // Loading state
  const users = ref<User[]>([]) // Holds the fetched users
  const store = patientStore()  // Vuex store for handling data fetching

  const { filters = makeFiltersRef(), pagination = makePaginationRef() } = options || {}

  const initializeFromQuery = () => {
    const queryParams = route.query

    pagination.value.current_page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    pagination.value.per_page = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 10

    // Apply query parameters to filters (firstname, lastname, middlename, gender)
    filters.value.firstname = queryParams.firstname ? queryParams.firstname as string : ''
    filters.value.lastname = queryParams.lastname ? queryParams.lastname as string : ''
    filters.value.middlename = queryParams.middlename ? queryParams.middlename as string : ''
    filters.value.gender = queryParams.gender ? queryParams.gender as string : null
  }

  const fetch = async () => {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      firstname: filters.value.firstname, // firstname filter
      lastname: filters.value.lastname, // lastname filter
      middlename: filters.value.middlename, // middlename filter
      gender: filters.value.gender, // gender filter
    }

    isLoading.value = true

    try {
      router.push({ path: route.path, query: params })

      const { data } = await store.GET_LIST_OF_PATIENTS(params)
      users.value = data.data

      pagination.value.total = data.pagination.total
      pagination.value.total_pages = data.pagination.total_pages
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      isLoading.value = false
    }
  }
  const searchFetch = async () => {
    const params = {
      firstname: filters.value.firstname, // firstname filter
      lastname: filters.value.lastname, // lastname filter
      middlename: filters.value.middlename, // middlename filter
      gender: filters.value.gender, // gender filter
    }

    isLoading.value = true

    try {
      router.push({ path: route.path, query: params })

      const { data } = await store.GET_LIST_OF_PATIENTS(params)
      users.value = data.data

      pagination.value.total = data.pagination.total
      pagination.value.total_pages = data.pagination.total_pages
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    initializeFromQuery()
    fetch()
  })

  watch([filters, pagination], fetch, { deep: true })

  return {
    isLoading,
    filters,
    pagination,
    users,
    fetch,
    searchFetch,

    async add(user: User) {
      isLoading.value = true
      try {
        await store.ADD_USER(user)
        await fetch()
      } finally {
        isLoading.value = false
      }
    },

    async update(user: User) {
      isLoading.value = true
      try {
        await store.UPDATE_USER(user)
        await fetch()
      } finally {
        isLoading.value = false
      }
    },

    async remove(user: User) {
      isLoading.value = true
      try {
        await store.REMOVE_USER(user)
        await fetch()
      } finally {
        isLoading.value = false
      }
    },
  }
}
