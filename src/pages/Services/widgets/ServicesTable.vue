<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: false },
  { label: 'Code', key: 'code', sortable: true },
  { label: 'Nomi', key: 'display', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  encounters: {
    type: Array as PropType<User[]>,
    required: true,
  },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'show-class', user: User): void
  (event: 'delete-user', user: User): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()


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



</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="encounters"
    :loading="$props.loading"
  >
    <template #cell(fullname)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.id }}
      </div>
    </template>

    <template #cell(username)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.code }}
      </div>
    </template>
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="success"
          size="small"
          icon="visibility"
          aria-label="Edit user"
          @click="$emit('show-class', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit user"
          @click="$emit('edit-user', rowData as encounters)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          disabled
          aria-label="Delete user"
          @click="onUserDelete(rowData as encounters)"
        />
      </div>
    </template>
  </VaDataTable>

</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
