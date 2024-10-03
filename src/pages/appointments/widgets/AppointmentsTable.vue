<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('createdAt'), key: 'created_at', sortable: false },
  { label: t('fullName'), key: 'patient.full_name', sortable: true },
  { label: t('direction'), key: 'encounter_class.display', sortable: true },
  { label: t('encounterType'), key: 'encounter_type.display', sortable: true },
  { label: t('appointmentDetails'), key: 'reason_text', sortable: true },
  { label: t('status'), key: 'status', sortable: true },
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

const onUserDelete = async (user: User) => {
  const agreed = await confirm({
    title: 'Delete user',
    message: `Are you sure you want to delete ${user.fullname}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-user', user)
  }
}
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const formattedDate = date.toLocaleString('en-GB', options).replace(',', ''); // Format in DD/MM/YYYY HH:mm

  const [datePart, timePart] = formattedDate.split(' ');
  return `${timePart} ${datePart.replace(/\//g, '/')}`;
};

const formatIdentifiers = (identifiers: Identifier[] | null | undefined) => {
  identifiers = identifiers || [];

  if (identifiers.length === 0) {
    return 'Hujjati yo`q';
  }

  if (identifiers.length <= 2) {
    return identifiers.map((item) => item.value).join(', ');
  }

  return (
    identifiers
      .slice(0, 2)
      .map((item) => item)
      .join(', ') +
    ' + ' +
    (identifiers.length - 2) +
    ' K`op'
  )
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(created_at)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ formatDate(rowData.created_at) }}
      </div>
    </template>

    <template #cell(status)="{ rowData }">
      <div
        :class="[
          'px-2 py-1 rounded text-white',
          rowData.status === 'in-progress' ? 'bg-gray-400' : '',
          rowData.status === 'finished' ? 'bg-green-500' : '',
          rowData.status === 'draft' ? 'bg-gray-500' : '',
          rowData.status === 'entered-in-error' ? 'bg-red-500' : ''
        ]"
        class="max-w-[180px] text-center"
      >
        {{ $t(rowData.status) }}
      </div>
    </template>

    <template #cell(role)="{ rowData }">
      <VaBadge :text="rowData.role" :color="roleColors[rowData.role as UserRole]" />
    </template>

    <template #cell(identifier)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{ formatIdentifiers(rowData.identifier) }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <router-link :to="{ name: 'appointment-show', params: { id: rowData.id } }">
          <VaButton
            preset="primary"
            size="small"
            icon="mso-visibility"
            aria-label="View appointment"
          />
        </router-link>
        <VaButton
          preset="primary"
          size="small"
          disabled
          icon="mso-delete"
          color="danger"
          aria-label="Delete appointment"
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

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: row;
    align-items: center;
  }

  .pagination-controls {
    justify-content: center;
    gap: 0;
  }

  .total-count {
    margin-top: 0.5rem;
    text-align: center;
  }

  .va-button {
    font-size: 14px;
    padding: 0.25rem 0.5rem;
  }

  .va-pagination {
    font-size: 14px;
  }
  .active-page {
    background: red !important;
  }
}

</style>
