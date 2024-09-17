<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      New to Vuestic?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useToast } from 'vuestic-ui';
import { authStore } from '../../stores/auth';  // Import the auth store

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
});

const router = useRouter();
const { validate } = useForm('form');
const { init } = useToast();
const store = authStore();

const submit = async () => {
  if (validate()) {
    try {
      // Call the login action from the store
      await store.login(formData);

      // Show success message
      init({ message: "You've successfully logged in", color: 'success' });

      // Redirect to dashboard
      router.push({ name: 'dashboard' });
    } catch (error) {
      // Show error message
      init({ message: 'Login failed. Please check your credentials.', color: 'danger' });
    }
  }
};
</script>
