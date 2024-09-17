<script setup lang="ts">
import { ref } from 'vue'
import ServicesTable from './widgets/ServicesTable.vue'
import ShowServiceForm from './widgets/ShowServiceForm.vue'
import EditServiceForm from './widgets/EditServiceForm.vue'
import { User } from './types'
import { useEncounters } from './composables/useEncounters'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)
const doShowServiceModal = ref(false)

const { encounters, types, fetchChildren, isLoading, filters, sorting, pagination, ...usersApi } = useEncounters()

const userToEdit = ref<User | null>(null)
const classTitle = ref<User | null>(null)

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}
const showService = (id) => {
  classTitle.value = id

  doShowServiceModal.value = true
  fetchChildren(id)
}

const { init: notify } = useToast()

const onUserSaved = async (user: User) => {
  if (userToEdit.value) {
    await usersApi.update(user)
    console.log(user, 'user')

    notify({
      message: `${user.fullname} has been updated`,
      color: 'success',
    })
  } else {
    usersApi.add(user)
    notify({
      message: `${user.fullname} has been created`,
      color: 'success',
    })
  }
}

const onUserDelete = async (user: User) => {
  await usersApi.remove(user)
  notify({
    message: `${user.fullname} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const showChildren = async (parent: User) => {
  await fetchChildren(parent.code)
}
</script>

<template>
  <h1 class="page-title">{{ $t('services') }}</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" :placeholder="$t('search.placeholder')">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">{{ $t('addService') }}</VaButton>
      </div>
      <ServicesTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :encounters="encounters"
        :loading="isLoading"
        :pagination="pagination"
        @showClass="showService"
        @openChild="showChildren"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="medium"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ userToEdit ? $t('editDirection') : $t('addDirection') }}</h1>
    <EditServiceForm
      ref="editFormRef"
      :user="userToEdit"
      :encounters="encounters"
      :save-button-label="userToEdit ? $t('save') : $t('add')"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user)
          ok()
        }
      "
  /></VaModal>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowServiceModal"
    size="large"
    max-width="80%"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <h1 class="va-h5">{{ classTitle.display }}</h1>
    <ShowServiceForm
      ref="editFormRef"
      :types="types"
      :classId="classTitle"
      :loading="isLoading"
      :save-button-label="userToEdit ? 'Saqlash' : 'Qo`shish'"

      @close="cancel"

      @save="
        (user) => {
          onUserSaved(user)
          ok()
        }
      "
    />
  </VaModal>
</template>
