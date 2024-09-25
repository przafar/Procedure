<template>
  <div class="container mx-auto px-4 sm:px-6 py-6 relative">
    <!-- Check if appointmentInfo is available -->
    <div v-if="appointmentInfo" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Block 1: Patient Information -->
      <div class="col-span-12 lg:col-span-4 bg-white p-4 lg:p-6 rounded-lg shadow-lg">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">{{ $t('patientInfo') }}</h2>
        <div class="space-y-3 lg:space-y-4">
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('patientId') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.id }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('fullName') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.last_name }} {{ appointmentInfo.patient?.first_name }} {{ appointmentInfo.patient?.middle_name }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('passport') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ formatIdentifiers(appointmentInfo.patient?.identifier) }}</p>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('phoneNumber') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.patient?.phone_number || $t('noPhoneNumber') }}</p>
          </div>
        </div>
      </div>

      <!-- Block 2: Appointment Details -->
      <div class="col-span-12 lg:col-span-8 bg-white p-4 lg:p-6 rounded-lg shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6">
          <div class="flex flex-col">
            <div>
              <h2 class="text-lg lg:text-2xl font-bold text-gray-800">{{ $t('appointmentDetails') }}</h2>
            </div>
            <div class="inline mt-2">
              <span :class="statusClass(appointmentInfo.status)" class="mt-2 px-3 py-1 rounded-lg text-white font-bold text-xs sm:text-sm ">
                {{ $t(appointmentInfo.status) }}
              </span>
            </div>
          </div>
          <div class="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">

            <div class="text-gray-500 text-xs sm:text-sm">
              {{ $t('createdAt') }}: {{ formatDate(appointmentInfo.created_at) }}
            </div>
            <button v-if="appointmentInfo.status === 'in-progress' || appointmentInfo.status === 'finished' || appointmentInfo.status === 'draft'" @click="errorAppointment" class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200">
              {{ $t('enteredInError') }}
            </button>
            <button v-if="appointmentInfo.status === 'in-progress'" @click="editAppointment" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors duration-200">
              {{ $t('addService') }}
            </button>
            <button v-if="appointmentInfo.status === 'in-progress'" @click="endAppointment" class="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-yellow-600 transition-colors duration-200">
              {{ $t('endAppointment') }}
            </button>
            <button v-if="appointmentInfo.status === 'draft'" @click="startAppointment" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200">
              {{ $t('startAppointment') }}
            </button>
          </div>
        </div>
        <div class="space-y-3 lg:space-y-4">
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('primaryEncounterType') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.encounter_class?.display }}</p>
          </div>
          <!-- Encounter Types Loop -->
          <div v-for="item in appointmentInfo.encounter_types" :key="item.id" class="bg-blue-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 lg:w-8 h-5 lg:h-8 text-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-sm lg:text-md font-semibold text-gray-800">{{ item.display }}</h3>
              <p class="text-xs lg:text-sm text-gray-500">Code: {{ item.code }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 class="text-sm lg:text-md font-semibold text-gray-700">{{ $t('reason') }}</h3>
            <p class="text-xs lg:text-sm text-gray-600">{{ appointmentInfo.reason_text }}</p>
          </div>
        </div>
      </div>

    </div>
    <div>
      <!-- Prescriptions Section -->
      <div  class="mt-8">
        <div class="flex flex-row items-center mb-4">
          <div>
            <h2 class="text-lg lg:text-2xl font-bold text-gray-800">{{ $t('prescriptions') }}</h2>
          </div>
          <div v-if="appointmentInfo && appointmentInfo?.status === 'in-progress'" class="ml-4">
            <button v-if="!appointmentInfo?.prescriptions.length" @click="createPrescription" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors duration-200">{{ $t('createPrescription') }}</button>
            <button v-if="appointmentInfo?.prescriptions.length" @click="updatePrescription" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200 ml-4">{{ $t('editPrescription') }}</button>
            <button v-if="appointmentInfo?.prescriptions && appointmentInfo?.prescriptions.length > 0" @click="removePrescription" class="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200">{{ $t('delete') }}</button>
          </div>

        </div>
        <ul v-if="appointmentInfo?.prescriptions && appointmentInfo?.prescriptions.length > 0" class="space-y-4">
          <li v-for="prescription in appointmentInfo?.prescriptions" :key="prescription.id" class="bg-white p-4 rounded-lg shadow-md">
            <div class="mb-2">
              <h3 class="font-semibold text-gray-800">{{ $t('prescribingDoctor') }}: {{ prescription.prescribing_doctor }}</h3>
            </div>
            <div class="text-gray-600 text-sm">
              <p><strong>{{ $t('medications') }}:</strong> {{ formatMedications(prescription.medications) }}</p>
              <p><strong>{{ $t('notes') }}:</strong> {{ prescription.notes || $t('noNotes') }}</p>
              <p><strong>{{ $t('prescriptionDate') }}:</strong> {{ formatDate(prescription.prescription_date) }}</p>
            </div>
          </li>
        </ul>
        <div v-else class="text-gray-500 mt-8 bg-white p-4 rounded-lg shadow-md">
          <p>{{ $t('noPrescriptions') }}</p>
        </div>
      </div>
    </div>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="appointmentVisible"
      size="large"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1>{{ $t('addService') }}</h1>
      <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full mt-4">
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
          <div v-for="item in state.encounterTypesData" class="bg-gray-50 w-full p-4 rounded-lg">
            <div class="flex gap-4 w-full">
              <div class="w-full">
                <VaSelect
                  v-model="item.class.code"
                  :label="$t('primaryEncounterType')"
                  class="w-full"
                  :options="getEncounterClasses"
                  :rules="[validators.required]"
                  text-by="display"
                  value-by="code"
                  disabled
                />
              </div>
            </div>
            <div class="mt-4">
              <div v-for="(c, index) in item.type" class="w-full mb-2 flex flex-col md:flex-row align-center justify-center items-end">
                <VaSelect
                  v-model="c.code"
                  :label="`${$t('encounterType')} #${index + 1}`"
                  class="w-full"
                  :options="item.typesDatas"
                  :rules="[validators.required]"
                  text-by="display"
                  value-by="code"
                />
                <div class="w-full md:w-12 mt-2 md:mt-0 flex justify-end">
                  <button @click="deleteType(index)" class="cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Iconly/Light/Delete">
                        <g id="Delete">
                          <path id="Stroke 1" d="M14.4936 7.10107C14.4936 7.10107 14.0863 12.1523 13.8501 14.2801C13.7376 15.2963 13.1098 15.8918 12.0816 15.9106C10.1248 15.9458 8.16584 15.9481 6.20984 15.9068C5.22059 15.8866 4.60334 15.2836 4.49309 14.2853C4.25534 12.1388 3.85034 7.10107 3.85034 7.10107" stroke="#D10F5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path id="Stroke 3" d="M15.5311 4.67969H2.81262" stroke="#D10F5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path id="Stroke 5" d="M13.0804 4.67974C12.4917 4.67974 11.9847 4.26349 11.8692 3.68674L11.6869 2.77474C11.5744 2.35399 11.1934 2.06299 10.7592 2.06299H7.58443C7.15018 2.06299 6.76918 2.35399 6.65668 2.77474L6.47443 3.68674C6.35893 4.26349 5.85193 4.67974 5.26318 4.67974" stroke="#D10F5C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                      </g>
                    </svg>

                  </button>
                </div>
              </div>
              <div class="flex flex-row justify-end mt-3">
                <button @click="addType" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200">
                  {{ $t('add') }} +
                </button>
              </div>
            </div>
          </div>

          <div class="w-full mb-4">
            <VaTextarea v-model="state.reasonText" :label="$t('reason')" class="w-full" />
          </div>

          <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
            <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('cancel') }}</VaButton>
            <VaButton :disabled="!isValid" @click="onSave">{{ $t('save') }}</VaButton>

          </div>
        </div>
      </VaForm>
    </VaModal>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="prescriptionVisible"
      size="large"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1>{{ $t('createPrescription') }}</h1>
      <VaForm
        v-slot="{ isValid }"
        ref="prescriptionForm"
        class="flex-col justify-start items-start gap-4 inline-flex w-full mt-4"
      >
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
          <!-- Medications Loop -->
          <div v-for="(item, index) in state.prescriptionData.medications" class="bg-gray-50 w-full p-4 rounded-lg">
            <div class="w-full">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="col-span-1">
                  <VaInput v-model="item.name" :rules="[validators.required]" :placeholder="$t('medicationName')" :label="$t('medicationName')" />
                </div>
                <div class="col-span-1">
                  <VaInput v-model="item.dosage" :rules="[validators.required]" :placeholder="$t('dosage')" :label="$t('dosage')" />
                </div>
                <div class="col-span-1">
                  <VaInput v-model="item.duration" :rules="[validators.required]" :placeholder="$t('duration')" :label="$t('duration')" />
                </div>
                <div class="col-span-1">
                  <VaInput v-model="item.frequency" :rules="[validators.required]" :placeholder="$t('frequency')" :label="$t('frequency')" />
                </div>
              </div>
            </div>

            <div class="w-full mt-2 md:mt-4 flex flex-col items-end justify-end">
              <button v-if="index === 1" @click="deletePrescription(index)" class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200">
                Удалить
              </button>
            </div>
            <!-- Encounter Type Section -->

          </div>
          <div class="flex w-full items-center justify-end">
            <button
              @click="addPrescription"
              class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200 mt-2"
            >
              {{ $t('add') }} +
            </button>
          </div>
          <div class="flex flex-col w-full">
            <VaInput v-model="state.prescriptionData.prescribing_doctor" :rules="[validators.required]" :placeholder="$t('fullName')" :label="$t('prescribingDoctor')" />
          </div>

          <!-- Reason Section -->
          <div class="w-full mb-4">
            <VaTextarea v-model="state.prescriptionData.notes" :label="$t('note')" class="w-full" />
          </div>
          <!-- Action Buttons -->
          <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
            <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('cancel') }}</VaButton>
            <VaButton v-if="!appointmentInfo.prescriptions.length" :disabled="!isValid" @click="savePrescription">{{ $t('save') }}</VaButton>
            <VaButton v-else :disabled="!isValid" @click="updatePrescriptionSubmit">{{ $t('update') }}</VaButton>

          </div>
        </div>
      </VaForm>
    </VaModal>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import { appointmentStore } from '../../stores/appointment';
import { ServicesStore } from '../../stores/services';
import { prescriptionStore} from '../../stores/prescription'
import { validators } from '../../services/utils'
import { useForm } from 'vuestic-ui'

const route = useRoute();
const appointmentId = route.params.id;
const appointment = appointmentStore();
const prescription = prescriptionStore();
const loading = ref(true);
const appointmentInfo = ref(null);
const appointmentVisible = ref(false);
const prescriptionVisible = ref(false);
const encounter = ServicesStore();

const getEncounterClasses = computed(() => encounter.getEncounterClasses);

const form = useForm('prescriptionForm');

const state = reactive({
  encounterTypesData: [
    {
      class: {
        code: '',
        display: '',
      },
      type: [
        {
          code: null,
          display: '',
          id: '',
        },
      ],
      typesDatas: []
    }
  ],
  reasonText: '',
  prescriptionData: {
    prescribing_doctor: '',
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
      }
    ],
    notes: '',
    prescription_date: '',
  }
});


onMounted(async () => {
  await fetchDetails();
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const response = await appointment.GET_BY_ID(appointmentId);
    appointmentInfo.value = { ...response.data };
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
  } finally {
    loading.value = false;
  }
};

// Function to determine background class for the status badge
const statusClass = (status) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-500';
    case 'in-process':
      return 'bg-blue-500';
    case 'finished':
      return 'bg-green-500';
    case 'entered-in-error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Function to format status text
const formatStatus = (status) => {
  return status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatIdentifiers = (identifiers) => {
  if (!identifiers || identifiers.length === 0) return 'No Document';
  return identifiers.map(identifier => `${identifier.display}: ${identifier.value}`).join(', ');
};

// Format birth date and created at
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  // Set the timezone offset for GMT+5
  const options = {
    timeZone: 'Asia/Tashkent', // This is the timezone for GMT+5 (Uzbekistan)
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return date.toLocaleString('en-GB', options).replace(',', ''); // Format in DD-MM-YYYY HH:mm
};
const formatMedications = (medications) => {
  if (!medications || medications.length === 0) return 'No Medications';
  return medications.map(med => `${med.name} (${med.dosage}, ${med.frequency}, ${med.duration})`).join(', ');
};

// Edit Appointment Function
const editAppointment = async () => {
  appointmentVisible.value = true
  state.encounterTypesData[0].class.code = appointmentInfo.value.encounter_class.code
  state.encounterTypesData[0].class.display = appointmentInfo.value.encounter_class.display
  state.encounterTypesData[0].type = appointmentInfo.value.encounter_types ? appointmentInfo.value.encounter_types : [{ code: '', display: '', id: '' }];
  state.reasonText = appointmentInfo.value.reason_text;
  await encounter.GET_LIST_OF_ECOUNTER_CLASSES();
  await encounter.GET_LIST_OF_ECOUNTER_TYPES(appointmentInfo.value.encounter_class.code).then((response) => {
    state.encounterTypesData[0].typesDatas = response.data.data;
  });
};

const startAppointment = async () => {
  const payload = {
    status: 'in-progress',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}
const endAppointment = async () => {
  const payload = {
    status: 'finished',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}
const errorAppointment = async () => {
  const payload = {
    status: 'entered-in-error',
  }
  await appointment.UPDATE_STATUS(appointmentId, payload);
  await fetchDetails();
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  hide();
};
const addType = () => {
  state.encounterTypesData[0].type.push({
    code: '',
    display: '',
    id: '',
  });
};
const onSave = async () => {
  const encounterTypes = state.encounterTypesData[0].type.map(item => item.code);
  const payload = {
    encounter_types: encounterTypes,
    reason_text: state.reasonText,
    status: 'in-progress'
  };
  console.log(payload, 'payload');
  await appointment.UPDATE(appointmentId, payload);
  await fetchDetails();
};
const deleteType = (index) => {
  state.encounterTypesData[0].type.splice(index, 1);
};
const createPrescription = () => {
  prescriptionVisible.value = true;
  const doctor = JSON.parse(localStorage.getItem('user'));
  state.prescriptionData.prescribing_doctor = doctor.fullname;
}
const updatePrescription = () => {
  prescriptionVisible.value = true;
  const doctor = JSON.parse(localStorage.getItem('user'));
  state.prescriptionData.prescribing_doctor = doctor.fullname;
  state.prescriptionData.medications = appointmentInfo.value.prescriptions[0].medications;
  state.prescriptionData.notes = appointmentInfo.value.prescriptions[0].notes;
}
const deletePrescription = (index) => {
  state.prescriptionData.medications.splice(index, 1);
}
const addPrescription = () => {
  state.prescriptionData.medications.push({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  });
}
const removePrescription = async () => {
  await prescription.DELETE_PRESCRIPTION(appointmentInfo.value.prescriptions[0].id);
  await fetchDetails();
}
const savePrescription = async () => {
  if (form.validate()) {
    const payload = {
      appointment_id: appointmentId,
      prescribing_doctor: state.prescriptionData.prescribing_doctor,
      medications: state.prescriptionData.medications,
      notes: state.prescriptionData.notes,
    }
    await prescription.CREATE_PRESCRIPTION(payload);
    await fetchDetails();
    prescriptionVisible.value = false;
  }
}
const updatePrescriptionSubmit = async () => {
  const payload = {
    prescribing_doctor: state.prescriptionData.prescribing_doctor,
    medications: state.prescriptionData.medications,
    notes: state.prescriptionData.notes,
  }
  await prescription.UPDATE_PRESCRIPTION(appointmentInfo.value.prescriptions[0].id, payload);
  await fetchDetails();
  prescriptionVisible.value = false;
}

</script>

<style scoped>


.container {
  max-width: 100%;
  padding: 0;
}

.bg-white {
  background-color: #fff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-blue-50 {
  background-color: #ebf8ff;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-gray-700 {
  color: #4a4a4a;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-500 {
  color: #a0aec0;
}

.status-badge {
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
}

button {
  font-size: 0.875rem;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.transition-shadow {
  transition: box-shadow 0.2s;
}
</style>
