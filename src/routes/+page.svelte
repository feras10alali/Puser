<script>
  import { enhance } from '$app/forms';
  import { fade, fly } from 'svelte/transition';
  
  export let form;
  
  let amount = '';
  let date = '';
  let category = '';
  let showSuccess = false;

  $: if (form?.success) {
    showSuccess = true;
    amount = '';
    date = '';
    category = '';
    
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }
</script>

<style>
  @keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
  
  .animate-wave {
    animation: wave 1s ease-in-out;
    animation-delay: 0.8s;
    transform-origin: 70% 70%;
    display: inline-block;
  }
</style>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
  <div class="w-full max-w-md" in:fly={{ y: 20, duration: 600, delay: 100 }}>
    
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-black mb-2" in:fly={{ y: -30, duration: 800, delay: 200 }}>
        Welcome <span class="inline-block animate-wave">👋</span>
      </h1>
    </div>

    {#if form?.error}
      <div 
        class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-center text-red-700 font-medium"
        in:fly={{ y: 10, duration: 300 }}
      >
        {form.error}
      </div>
    {/if}

    <form method="POST" action="?/submit" use:enhance class="space-y-6">
      
      <div class="group" in:fly={{ x: -20, duration: 500, delay: 400 }}>
        <label for="amount" class="block text-left text-gray-700 font-medium mb-2 transition-colors group-focus-within:text-black">
          Amount
        </label>
        <div class="relative">
          <input
            id="amount"
            type="number"
            name="amount"
            bind:value={amount}
            required
            class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-left focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300"
            placeholder="Enter amount"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-60">
            <svg viewBox="0 0 1124.14 1256.39" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
              <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="group" in:fly={{ x: -20, duration: 500, delay: 500 }}>
        <label for="date" class="block text-left text-gray-700 font-medium mb-2 transition-colors group-focus-within:text-black">
          Date
        </label>
        <input
          id="date"
          type="date"
          name="date"
          bind:value={date}
          required
          class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-left focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300"
        />
      </div>

      <div class="group" in:fly={{ x: -20, duration: 500, delay: 600 }}>
        <label for="category" class="block text-left text-gray-700 font-medium mb-2 transition-colors group-focus-within:text-black">
          Category
        </label>
        <input
          id="category"
          type="text"
          name="category"
          bind:value={category}
          required
          class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-left focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300"
          placeholder="Enter category"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95"
        in:fly={{ y: 20, duration: 500, delay: 700 }}
      >
        Submit
      </button>
    </form>

    {#if showSuccess}
      <div 
        class="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl text-center text-green-700 font-medium"
        in:fly={{ y: 10, duration: 300 }}
        out:fade={{ duration: 200 }}
      >
        Submitted successfully! ✓
      </div>
    {/if}

  </div>
</div>