<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'Qabul vaqti', key: 'id', sortable: false },
  { label: 'F.I.O', key: 'patient.full_name', sortable: true },
  { label: 'Yo`nalishi', key: 'encounter_class.display', sortable: true },
  { label: 'Turi', key: 'encounter_type.display', sortable: true },
  { label: 'Izoh', key: 'reason_text', sortable: true },
  { label: 'Holat', key: 'status', sortable: true }, // New column for status
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
    <template #cell(fullname)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.id }}
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
        class="max-w-[120px] text-center"
      >
        {{ rowData.status }}
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

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b> {{ $props.pagination.total }} Jami soni.</b>
      <VaSelect v-model="$props.pagination.per_page" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <!-- Pagination Controls (Optional) -->
    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
