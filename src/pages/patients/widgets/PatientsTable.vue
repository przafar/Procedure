<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef } from 'vue'
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

const formatIdentifiers = (identifiers: Identifier[] | null | undefined) => {
  identifiers = identifiers || []

  if (identifiers.length === 0) {
    return t('noDocument')
  }

  if (identifiers.length <= 2) {
    return identifiers.map((item) => item.value).join(', ')
  }

  return (
    identifiers
      .slice(0, 2)
      .map((item) => item)
      .join(', ') +
    ' + ' +
    (identifiers.length - 2) +
    t(' more')
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

    <template #cell(username)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.username }}
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
        <RouterLink :to="{ name: 'patient-show', params: { id: rowData.id } }">
          <VaButton
            preset="primary"
            size="small"
            icon="mso-visibility"
            aria-label="Edit user"
            @click="$emit('edit-user', rowData)"
          />
        </RouterLink>
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
          disabled
          aria-label="Delete user"
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

    <!-- <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Oldingi sahifa"
        :disabled="$props?.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Keyingi sahifa"
        :disabled="$props?.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props?.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
