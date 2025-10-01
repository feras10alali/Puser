<script>
  import { enhance } from '$app/forms';
  import { fade, fly } from 'svelte/transition';
  
  export let form;
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

    <form method="POST" use:enhance class="space-y-6">
      
      <div class="group" in:fly={{ x: -20, duration: 500, delay: 400 }}>
        <label for="email" class="block text-left text-gray-700 font-medium mb-2 transition-colors group-focus-within:text-black">
          Email        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form?.email ?? ''}
          required
          class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-left focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300"
          placeholder="example@email.com"
        />
      </div>

      <div class="group" in:fly={{ x: -20, duration: 500, delay: 500 }}>
        <label for="password" class="block text-left text-gray-700 font-medium mb-2 transition-colors group-focus-within:text-black">
          Password        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          class="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-left focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95"
        in:fly={{ y: 20, duration: 500, delay: 600 }}
      >
        login
      </button>
    </form>


  </div>
</div>