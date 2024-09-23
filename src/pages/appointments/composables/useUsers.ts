
import { ref, computed, watch, onMounted } from 'vue'
import { updateUser, addUser, removeUser, type Filters, Pagination } from '../../../data/pages/users'
import router from '../../../router'
import { appointmentStore } from '../../../stores/appointment'
import { User } from '../types'
import { useRoute } from 'vue-router'

const makePaginationRef = () => ref<Pagination>({ current_page: 1, per_page: 10, total: 0, total_pages: 0 })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useUsers = (options?: {
  pagination?: Ref<Pagination>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<User[]>([])
  const store = appointmentStore()
  const route = useRoute()  // Получаем доступ к роуту для извлечения параметров
  const path = computed(() => route.path)
  const query = computed(() => route.query)

  const { filters = makeFiltersRef(), pagination = makePaginationRef() } = options || {}

  // Функция для инициализации состояния из URL
  const initializeFromQuery = () => {
    const queryParams = query.value

    // Устанавливаем текущую страницу и количество элементов на странице из URL, если они есть
    pagination.value.current_page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    pagination.value.per_page = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 10

    // Устанавливаем параметры поиска
    filters.value.search = queryParams.search ? queryParams.search as string : ''
  }

  const fetch = async () => {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      search: filters.value.search,
    }

    await updatePagination(params)
  }

  const updatePagination = async (params) => {
    isLoading.value = true

    // Обновляем роут с параметрами пагинации и фильтров
    router.push({ path: path.value, query: params })

    try {
      const { data } = await store.GET_LIST_OF_APPOINTMENTS(params)
      users.value = data.data

      // Обновляем информацию о пагинации (общее количество элементов, страниц и т.д.)
      pagination.value.total = data.pagination.total
      pagination.value.per_page = data.pagination.per_page
      pagination.value.current_page = data.pagination.current_page
      pagination.value.total_pages = data.pagination.total_pages
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Инициализация состояния при загрузке компонента
  onMounted(() => {
    initializeFromQuery() // Устанавливаем начальные значения из URL
    fetch()               // Загружаем данные с этими параметрами
  })

  // Следим за изменениями в пагинации или фильтрах и загружаем данные при их изменении
  watch([pagination, filters], fetch, { deep: true })

  return {
    isLoading,
    filters,
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
      await updateUser(user)
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
