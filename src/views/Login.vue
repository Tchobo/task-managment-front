<template>
  <div class="login-page">
    <!-- ==================== LEFT COLUMN — form ==================== -->
    <div class="login-left">
      <!-- Brand lockup -->
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"></div>
        <span class="brand-wordmark font-mono">Taskello</span>
      </div>

      <!-- Middle block -->
      <div class="form-block">
        <h1 class="heading font-mono">Welcome back</h1>
        <p class="subline">
          Don't have an account?
          <a href="#" class="link-primary">Sign up</a>
        </p>

        <form class="form-stack" @submit.prevent="onloginUser">
          <!-- Email -->
          <div class="field">
            <label for="email" class="field-label font-mono">Email</label>
            <input
              id="email"
              v-model="loginData.email"
              type="email"
              autocomplete="email"
              placeholder="you@company.com"
              class="input"
            />
          </div>

          <!-- Password -->
          <div class="field">
            <div class="password-header">
              <label for="password" class="field-label font-mono">Password</label>
              <a href="#" class="link-secondary">Forgot password?</a>
            </div>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="loginData.password"
                :type="visible ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="input password-input"
              />
              <button
                type="button"
                class="password-toggle font-mono"
                :aria-pressed="visible"
                aria-label="Toggle password visibility"
                @click="changePasswordVisibility"
              >
                {{ visible ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <!-- Inline error (auth failure) -->
          <p v-if="error" class="field-error">{{ error }}</p>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Log in</span>
            <span v-else class="spinner" aria-label="Loading"></span>
          </button>
        </form>
      </div>

      <!-- Legal footer -->
      <p class="legal">© 2026 Taskello · <a href="#" class="legal-link">Privacy</a></p>
    </div>

    <!-- ==================== RIGHT COLUMN — illustration ==================== -->
    <div class="login-right">
      <div class="right-panel">
        <div class="illustration-wrapper">
          <img
            src="../assets/images/taskello-login-illustration.svg"
            alt=""
            class="illustration"
          />
        </div>
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import store from "../store";

const visible = ref(false);
const isLoading = ref(false);
const error = ref(null);
const loginData = ref({ email: "", password: "" });

const router = useRouter();

const changePasswordVisibility = () => {
  visible.value = !visible.value;
};

const onloginUser = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    const loginStatus = await store.dispatch("loginUser", loginData.value);
    if (loginStatus) {
      router.push("/taskmanager");
    } else {
      error.value = "Invalid email or password. Please try again.";
    }
  } catch (err) {
    console.error("Error logging in:", err);
    error.value = "Something went wrong. Please try again in a moment.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ==================== DESIGN TOKENS ==================== */
/* Colors */
.login-page {
  --color-primary: #007aff;
  --color-primary-hover: #0062d1;
  --color-focus-ring: rgba(0, 122, 255, 0.18);
  --color-page-bg: #f7f6f4;
  --color-surface: #ffffff;
  --color-panel-bg: #0B2540;
  --color-caption-bg: #0C447C;
  --color-text-primary: #1a1a18;
  --color-text-secondary: #6b6760;
  --color-text-muted: #a8a49d;
  --color-border: #e0ddd6;
  --color-rule: #e6e3dc;
  --color-border-hover: #b8b3aa;
  --color-hover-fill: #f2f0ec;
  --color-error: #d32f2f;
}

/* ==================== LAYOUT ==================== */
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  height: 100dvh; /* accounts for mobile browser UI (address bar, etc.) */
  overflow: hidden;
  background: var(--color-page-bg);
  color: var(--color-text-primary);
  /* Whole page uses JetBrains Mono (same as the 'Welcome back' heading).
     Everything inside inherits from here — no need to sprinkle .font-mono
     across every child. */
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

/* Buttons and inputs don't inherit font by default in most browsers,
   so we force it explicitly for these controls. */
.login-page input,
.login-page button {
  font-family: inherit;
}

.login-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 7% 28px;
  min-height: 0; /* let the flex column shrink inside a fixed-height grid cell */
  overflow: hidden; /* no scrollbar between the two columns */
}

.login-right {
  padding: 0;
  min-height: 0;
  overflow: hidden;
}

/* ==================== LEFT: brand ==================== */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 22px;
  height: 22px;
  background: var(--color-primary);
  border-radius: 6px;
}

.brand-wordmark {
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
  font-weight: 500;
}

/* ==================== LEFT: form block ==================== */
/* White card that houses the form. Brand and legal stay OUTSIDE
   the card as page-level "chrome" (per design decision). */
.form-block {
  max-width: 440px;
  width: 100%;
  margin: 24px auto; /* horizontally centered within the left column */
  padding: 36px 40px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(11, 37, 64, 0.06),
              0 2px 6px rgba(11, 37, 64, 0.04);
}

.heading {
  font-size: 36px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin: 0;
}

.subline {
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.link-primary {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.link-primary:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.link-secondary {
  font-size: 13px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.link-secondary:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 36px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

/* ==================== inputs ==================== */
.input {
  height: 50px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder {
  color: var(--color-text-muted);
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.password-wrapper {
  position: relative;
}

.password-input {
  padding: 0 68px 0 16px;
}

.password-toggle {
  position: absolute;
  right: 6px;
  top: 6px;
  height: 38px;
  padding: 0 12px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.password-toggle:hover {
  background: var(--color-hover-fill);
  color: var(--color-primary);
}

/* ==================== inline error ==================== */
.field-error {
  font-size: 13px;
  color: var(--color-error);
  margin: -6px 0 0;
}

/* ==================== primary button ==================== */
.btn-primary {
  width: 100%;
  height: 50px;
  margin-top: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}
.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ==================== LEFT: legal ==================== */
.legal {
  font-size: 13px;
  color: var(--color-text-muted);
}

.legal-link {
  color: var(--color-text-muted);
  text-decoration: none;
}
.legal-link:hover {
  text-decoration: underline;
}

/* ==================== RIGHT: illustration panel ==================== */
.right-panel {
  border-radius: 0;
  overflow: hidden;
  background: var(--color-panel-bg);
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.illustration-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
}

.illustration {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.caption-card {
  margin: 16px;
  padding: 24px 28px;
  border-radius: 14px;
  background: var(--color-caption-bg);
}

.caption-headline {
  font-size: 19px;
  line-height: 1.5;
  font-weight: 500;
  color: #fff;
  max-width: 460px;
  margin: 0;
}

.caption-subline {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin: 10px 0 0;
}

/* ==================== responsive ==================== */
@media (max-width: 960px) {
  .login-page {
    grid-template-columns: 1fr; /* single column: only the form side */
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .login-left {
    overflow: visible;
    padding: 32px 20px;
  }
  /* Illustration panel hidden on small screens — mobile users get
     a focused form-only experience. */
  .login-right {
    display: none;
  }
  .form-block {
    padding: 28px 24px; /* slightly tighter card on narrow screens */
  }
}
</style>
