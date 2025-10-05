<!-- src/routes/employees/+page.svelte -->
<script>
  export let data;
  export let form;
  
  let employees = data.employees || [];
  let showModal = false;
  let showDeleteConfirm = false;
  let editingEmployee = null;
  let deleteEmployee = null;
  
  let formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  let errors = {};
  let submitting = false;
  
  // Show success/error messages from form actions
  $: if (form?.success) {
    showModal = false;
    formData = { name: '', email: '', password: '', confirmPassword: '' };
  }
  
  function openAddModal() {
    editingEmployee = null;
    formData = { name: '', email: '', password: '', confirmPassword: '' };
    errors = {};
    showModal = true;
  }
  
  function openEditModal(employee) {
    editingEmployee = employee;
    formData = {
      name: employee.name || '',
      email: employee.email || '',
      password: '',
      confirmPassword: ''
    };
    errors = {};
    showModal = true;
  }
  
  function closeModal() {
    showModal = false;
    formData = { name: '', email: '', password: '', confirmPassword: '' };
    errors = {};
  }
  
  function confirmDelete(employee) {
    deleteEmployee = employee;
    showDeleteConfirm = true;
  }
</script>

<svelte:head>
  <title>Employee Management</title>
</svelte:head>

<div class="min-h-screen bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div class="flex items-center gap-4">
        <a 
          href="/admin"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
          title="Back to Admin Dashboard"
        >
          <svg class="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-4xl font-bold text-black mb-2">Employee Management</h1>
      </div>
      <button 
        on:click={openAddModal}
        class="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
          <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add Employee
      </button>
    </div>
    
    <!-- Alerts -->
    {#if form?.error}
      <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
        {form.error}
      </div>
    {/if}
    
    {#if form?.success}
      <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium">
        {form.message}
      </div>
    {/if}
    
    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-black">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {#if employees.length === 0}
              <tr>
                <td colspan="3" class="px-6 py-16 text-center text-gray-500">
                  No employees found. Add your first employee to get started!
                </td>
              </tr>
            {:else}
              {#each employees as employee (employee.id)}
                <tr class="hover:bg-blue-50 transition-colors duration-200">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg uppercase">
                        {employee.name?.charAt(0) || employee.email?.charAt(0) || '?'}
                      </div>
                      <span class="font-medium text-gray-900">
                        {employee.name || employee.email}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">
                    {employee.email}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button 
                        on:click={() => openEditModal(employee)}
                        class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" viewBox="0 0 18 18" fill="none">
                          <path d="M12.5 2.5L15.5 5.5L5.5 15.5H2.5V12.5L12.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        type="button"
                        on:click={() => confirmDelete(employee)}
                        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" viewBox="0 0 18 18" fill="none">
                          <path d="M3.5 5.5H14.5M7 8V13M11 8V13M4.5 5.5L5.5 14.5C5.5 15.05 5.95 15.5 6.5 15.5H11.5C12.05 15.5 12.5 15.05 12.5 14.5L13.5 5.5M7 5.5V3.5C7 3 7.5 2.5 8 2.5H10C10.5 2.5 11 3 11 3.5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Add/Edit Modal -->
{#if showModal}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    on:click={closeModal}
  >
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
    >
      <div class="p-8">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button 
            on:click={closeModal}
            class="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>
        
        <!-- Form -->
        <form method="POST" action={editingEmployee ? '?/updateUser' : '?/addUser'}>
          {#if editingEmployee}
            <input type="hidden" name="userId" value={editingEmployee.id} />
          {/if}
          
          <div class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                bind:value={formData.name}
                placeholder="Enter full name"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors duration-200"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                bind:value={formData.email}
                placeholder="name@company.com"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors duration-200"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password {editingEmployee ? '(leave empty to keep current)' : '*'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                bind:value={formData.password}
                placeholder="Minimum 8 characters"
                required={!editingEmployee}
                minlength="8"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors duration-200"
              />
            </div>
            
            <div>
              <label for="passwordConfirm" class="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password {editingEmployee ? '' : '*'}
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                bind:value={formData.confirmPassword}
                placeholder="Re-enter password"
                required={!editingEmployee}
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex gap-3 justify-end mt-8">
            <button 
              type="button"
              on:click={closeModal}
              class="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              class="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {submitting ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && deleteEmployee}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    on:click={() => showDeleteConfirm = false}
  >
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-sm w-full"
      on:click|stopPropagation
    >
      <div class="p-8">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Confirm Delete</h2>
          <button 
            on:click={() => showDeleteConfirm = false}
            class="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>
        
        <!-- Content -->
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">⚠️</div>
          <p class="text-gray-700 text-lg mb-2">
            Are you sure you want to delete <strong>{deleteEmployee.name || deleteEmployee.email}</strong>?
          </p>
          <p class="text-gray-500 text-sm">This action cannot be undone.</p>
        </div>
        
        <!-- Form -->
        <form method="POST" action="?/deleteUser">
          <input type="hidden" name="userId" value={deleteEmployee.id} />
          <div class="flex gap-3 justify-end">
            <button 
              type="button"
              on:click={() => showDeleteConfirm = false}
              class="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}