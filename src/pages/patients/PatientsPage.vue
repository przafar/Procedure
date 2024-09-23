<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PatientsTable from './widgets/PatientsTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { User, UserRole } from './types'
import { useUsers } from './composables/useUsers'
import { useToast } from 'vuestic-ui'

// Modal management
const doShowEditUserModal = ref(false)
const userToEdit = ref<User | null>(null)

// Fetch users and handle filters
const { users, isLoading, filters, pagination, fetch, ...usersApi } = useUsers()

// Toast notifications
const { init: notify } = useToast()

// Router and route instances
const router = useRouter()
const route = useRoute()

// Temporary local state for inputs (form values)
const formValues = ref({
  firstname: '',
  lastname: '',
  middlename: '',
  gender: null,
})

// Function to initialize form values from the route query parameters
const initializeFormValuesFromRoute = () => {
  const query = route.query

  formValues.value.firstname = query.firstname || ''
  formValues.value.lastname = query.lastname || ''
  formValues.value.middlename = query.middlename || ''
  formValues.value.gender = query.gender || null
}

// Update route query params when filter button is clicked
const filterPatients = () => {
  // Copy form values to filters
  filters.value.firstname = formValues.value.firstname
  filters.value.lastname = formValues.value.lastname
  filters.value.middlename = formValues.value.middlename
  filters.value.gender = formValues.value.gender

  // Update the route with the current filter values
  router.push({
    query: {
      ...route.query,
      firstname: formValues.value.firstname || undefined,
      lastname: formValues.value.lastname || undefined,
      middlename: formValues.value.middlename || undefined,
      gender: formValues.value.gender || undefined,
    },
  })

  // Fetch the filtered results
  fetch()
}

// Initialize form values from route query when the component is mounted
onMounted(() => {
  initializeFormValuesFromRoute()
})

// Show modal for editing an existing user
const showEditUserModal = (user: User) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
}

// Show modal for adding a new user
const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

// Handle saving a user (add or update)
const onUserSaved = async (user: User) => {
  if (userToEdit.value) {
    await usersApi.update(user)
    notify({
      message: `${user.fullname} has been updated`,
      color: 'success',
    })
  } else {
    await usersApi.add(user)
    notify({
      message: `${user.fullname} has been created`,
      color: 'success',
    })
  }
  fetch() // Refresh the list after saving
}

// Handle deleting a user
const onUserDelete = async (user: User) => {
  await usersApi.remove(user)
  notify({
    message: `${user.fullname} has been deleted`,
    color: 'success',
  })
  fetch() // Refresh the list after deletion
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between mb-4">
    <VaButton @click="showAddUserModal">{{ $t('addPatient') }}</VaButton>
  </div>
  <VaCard>
    <VaCardContent>
      <div class="grid gap-4 grid-cols-4 mb-4">
        <!-- Lastname Filter -->
        <div class="w-full">
          <VaInput v-model="formValues.lastname" :label="$t('lastname')" :placeholder="$t('lastname')" />
        </div>
        <!-- Firstname Filter -->
        <div class="w-full">
          <VaInput v-model="formValues.firstname" :label="$t('firstname')" :placeholder="$t('firstname')" />
        </div>
        <!-- Middlename Filter -->
        <div class="w-full">
          <VaInput v-model="formValues.middlename" :label="$t('middlename')" :placeholder="$t('middlename')" />
        </div>
        <!-- Gender Filter -->
        <div>
          <VaSelect
            v-model="formValues.gender"
            :label="$t('gender')"
            class="w-full"
            :options="roleSelectOptions"
            name="gender"
            value-by="value"
          />
        </div>
        <!-- Filter Button -->
        <div>
          <VaButton color="warning" @click="filterPatients">{{ $t('filter') }}</VaButton>
        </div>
      </div>

      <!-- Patients Table -->
      <PatientsTable
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @update:current_page="pagination.current_page = $event; fetch()"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <!-- Modal for Adding/Editing Users -->
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="large"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <h1 class="va-h5">{{ userToEdit ? 'Tahrirlash' : 'Bemor qo`shish' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
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
