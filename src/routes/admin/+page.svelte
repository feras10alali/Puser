<script>
  import { enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  
  export let data;
  
  $: records = data.records;
  let sortBy = 'date';
  let sortOrder = 'desc';
  let showDropdown = false;
  let showDatePicker = false;
  let startDate = data.startDate || '';
  let endDate = data.endDate || '';

  // Calculate total amount
  $: totalAmount = records.reduce((sum, record) => {
    return sum + Number(record.amount || 0);
  }, 0);

  function sortRecords(column) {
    if (sortBy === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = column;
      sortOrder = 'desc';
    }

    records = records.slice().sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      if (column === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (column === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
    showDatePicker = false;
  }

  function closeDropdown() {
    showDropdown = false;
  }

  function toggleDatePicker(event) {
    event.stopPropagation();
    showDatePicker = !showDatePicker;
    showDropdown = false;
  }

  function closeDatePicker(event) {
    if (!event.target.closest('.date-picker-container')) {
      showDatePicker = false;
    }
  }

  async function applyDateFilter() {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    await goto(`?${params.toString()}`, { invalidateAll: true });
    showDatePicker = false;
  }

  async function clearDateFilter() {
    startDate = '';
    endDate = '';
    await goto('?', { invalidateAll: true });
    showDatePicker = false;
  }

  function printTable() {
    window.print();
  }
</script>

<svelte:head>
  <style>
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .print\\:hidden {
        display: none !important;
      }
      header {
        display: none !important;
      }
      .bg-gray-50 {
        background-color: white !important;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</svelte:head>

<svelte:window on:click={closeDatePicker} />

<div class="min-h-screen bg-gray-50" dir="ltr">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200 print:hidden">
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <!-- User Avatar Dropdown -->
      <div class="relative">
        <button 
          on:click|stopPropagation={toggleDropdown}
          class="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {data.user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </button>

        {#if showDropdown}
          <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div class="px-4 py-2 border-b border-gray-200">
              <p class="text-sm text-gray-600 truncate">{data.user?.email || ''}</p>
            </div>
            
            <a
              href="/add-user"
              class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-start gap-2 block"
            >
              <span>Add User</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </a>

            <form method="POST" action="?/logout" use:enhance on:submit={closeDropdown}>
              <button 
                type="submit"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center justify-start gap-2"
              >
                <span>Logout</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Table Content -->
  <div class="p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Date Filter Section -->
      <div class="mb-4 flex justify-between items-center print:hidden">
        <!-- Print Button -->
        <button
          type="button"
          on:click={printTable}
          class="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow transition-colors font-medium print:hidden"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print</span>
        </button>

        <!-- Date Filter Button -->
        <div class="relative date-picker-container">
          <button
            type="button"
            on:click={toggleDatePicker}
            class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-300"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-gray-700">Filter by Date</span>
            {#if startDate || endDate}
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            {/if}
          </button>

          {#if showDatePicker}
            <div 
              class="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px]"
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-left">
                    From Date
                  </label>
                  <input
                    type="date"
                    bind:value={startDate}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-left">
                    To Date
                  </label>
                  <input
                    type="date"
                    bind:value={endDate}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex gap-2 pt-2">
                  <button
                    type="button"
                    on:click={applyDateFilter}
                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    on:click={clearDateFilter}
                    class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th 
                  on:click={() => sortRecords('amount')}
                  class="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-black cursor-pointer hover:bg-gray-200 transition-colors select-none"
                >
                  <div class="flex items-center justify-start gap-2">
                    Amount
                    {#if sortBy === 'amount'}
                      <span class="text-sm">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    {/if}
                  </div>
                </th>
                <th class="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-black">
                  Category
                </th>
                <th 
                  on:click={() => sortRecords('date')}
                  class="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-black cursor-pointer hover:bg-gray-200 transition-colors select-none"
                >
                  <div class="flex items-center justify-start gap-2">
                    Date
                    {#if sortBy === 'date'}
                      <span class="text-sm">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    {/if}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {#each records as record}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-gray-800 border-b border-gray-200">
                    {record.amount}
                  </td>
                  <td class="px-6 py-4 text-gray-800 border-b border-gray-200">
                    {record.category}
                  </td>
                  <td class="px-6 py-4 text-gray-800 border-b border-gray-200">
                    {formatDate(record.date)}
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                    No Data Available
                  </td>
                </tr>
              {/each}
            </tbody>
            <!-- Table Footer with Total -->
            <tfoot class="bg-gray-50 border-t-2 border-gray-300">
              <tr>

                <td class="px-6 py-4 text-left font-semibold text-gray-700" colspan="2">
                  Total: <span class="px-6 py-4 text-left font-semibold text-blue-500">{totalAmount.toLocaleString('en-US')}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
