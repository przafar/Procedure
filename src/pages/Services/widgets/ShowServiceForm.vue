<script setup lang="ts">
import { defineVaDataTableColumns, useForm, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { PropType, computed, toRef, ref } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'
import { validators } from '../../../services/utils'
import { ServicesStore } from '../../../stores/services'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: false },
  { label: 'Code', key: 'code', sortable: true },
  { label: 'Nomi', key: 'display', sortable: true },
  { label: 'Summa', key: 'price', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  types: {
    type: Array as PropType<User[]>,
    required: true,
  },
  classId: {
    type: Number,
    required: true,
  },
  loading: { type: Boolean, default: false }
})

const store = ServicesStore()
const encounterTypesVisible = ref(false)

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

const defaultNewUser: User = {
  code: '',
  text: '',
  price: 0
}

const newUser = ref<User>({ ...defaultNewUser })
const form = useForm('add-user-form')

const onSave = async () => {
  if (form.validate()) {
    const payload = {
      code: newUser.value.code,
      display: newUser.value.text,
      price: newUser.value.price,
      class_code: props.classId.id
    }
    try {
      await store.CREATE_ENCOUNTER_TYPES(payload).then(async (response) => {
        if (response.status === 200) {
          const data = await response.data
          emit('save', data)
          encounterTypesVisible.value = false
        } else {
          console.error('Failed to save user data:', response)
          encounterTypesVisible.value = false
          
        }
      })
    } catch (error) {
      console.error('Error during request:', error)
      encounterTypesVisible.value = false

    }
  }
}


</script>

<template>
  <div>
    <VaButton
      preset="primary"
      class="mr-6 mb-2"
      @click="encounterTypesVisible = true"
    >
      Muolaja qo'shish
    </VaButton>
  </div>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="types"
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
    <template #cell(price)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.price }}
      </div>
    </template>
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">

        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit user"
          @click="$emit('edit-user', rowData as types)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete user"
          @click="onUserDelete(rowData as types)"
        />
      </div>
    </template>
  </VaDataTable>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="encounterTypesVisible"
    size="large"
    max-width="80%"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <h1 class="va-h5">Muolaja qo`shish</h1>
    <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
      <div class="self-stretch flex-col justify-start items-start gap-4 flex">
        <div class="w-full">
          <div class="flex gap-4 flex-col sm:flex-row w-full mb-2">
            <VaInput v-model="newUser.code" :rules="[validators.required]" :label="'Code'" class="w-full" name="code" />
          </div>
          <div class="w-full">
            <VaInput v-model="newUser.text" :rules="[validators.required]" label="Tekst" class="w-full mt-2" name="display" />
          </div>
          <div class="w-full">
            <VaInput v-model="newUser.price" :rules="[validators.required]" label="Summa" class="w-full mt-2" name="display" />
          </div>
        </div>
        <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
          <VaButton preset="secondary" color="secondary" @click="$emit('close')">Bekor qilish</VaButton>
          <VaButton :disabled="!isValid" @click="onSave">Сохранить</VaButton>
        </div>
      </div>
    </VaForm>
  </VaModal>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
