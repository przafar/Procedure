<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef, ref } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('ID'), key: 'id', sortable: false },
  { label: t('fullName'), key: 'full_name', sortable: true },
  { label: t('identityDocument'), key: 'identifier', sortable: true },
  { label: t('birthYear'), key: 'birth_date', sortable: true },
  { label: t('phoneNumber'), key: 'phone_number', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const roleColors: Record<UserRole, string> = {
  admin: 'danger',
  user: 'background-element',
  owner: 'warning',
}

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()
const test = ref(5)

const onUserDelete = async (user: User) => {
  const agreed = await confirm({
    title: t('Delete user'),
    message: t('Are you sure you want to delete {name}?', { name: user.fullname }),
    okText: t('Delete'),
    cancelText: t('Cancel'),
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-user', user)
  }
}

const formatIdentifiers = (identifiers) => {
  identifiers = Array.isArray(identifiers) ? identifiers : [];

  if (identifiers.length === 0) {
    return t('noDocument');
  }

  if (identifiers.length <= 2) {
    return identifiers.map(item => item.value).join(', ');
  }

  return (
    identifiers.slice(0, 2).map(item => item.value).join(', ') + ' + ' + (identifiers.length - 2) + t(' more')
  );
};

</script>

<template>
  <VaDataTable
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(fullname)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.id }}
      </div>
    </template>

    <template #cell(identifier)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{ formatIdentifiers(rowData.identifier) }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit user"
          @click="$emit('edit-user', rowData as User)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          @click="onUserDelete(rowData as User)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="pagination-container mt-4">
    <div class="pagination-controls">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous Page"
        class="rounded"
        rounded
        gapped
        :disabled="pagination.current_page === 1"
        @click="$emit('update:current_page', pagination.current_page - 1)"
      />

      <VaPagination
        v-model:modelValue="pagination.current_page"
        :pages="pagination.total_pages"
        :visible-pages="pagination.total_pages"
        @update:modelValue="$emit('update:current_page', pagination.current_page)"
        active-page-color="#154EC1"
        buttons-preset="secondary"
      >

      </VaPagination>

      <VaButton
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next Page"
        buttons-preset="secondary"
        rounded
        gapped
        :disabled="pagination.current_page === pagination.total_pages"
        @click="$emit('update:current_page', pagination.current_page + 1)"
      />
    </div>

    <div class="total-count">
      <span>Общее количество: {{ pagination.total }}</span>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
.va-pagination__item--active {
  background-color: #007bff;  /* Меняем цвет активной страницы */
  color: white;
  font-weight: bold;
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* Адаптируется для мобильных устройств */
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.total-count {
  font-weight: 500;
  color: #4a4a4a;
  text-align: right;
}

/* Для мобильных устройств */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: row; /* Перестраиваем в колонку на маленьких экранах */
    align-items: center;
  }

  .pagination-controls {
    justify-content: center;
    gap: 0;
  }

  .total-count {
    margin-top: 0.5rem;
    text-align: center; /* Центрируем текст на маленьких экранах */
  }

  /* Стили для кнопок и других элементов */
  .va-button {
    font-size: 14px;
    padding: 0.25rem 0.5rem; /* Уменьшаем кнопки для мобильных */
  }

  .va-pagination {
    font-size: 14px; /* Уменьшаем размер текста в пагинации */
  }
  .active-page {
    background: red !important;
  }
}

</style>
