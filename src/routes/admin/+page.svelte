<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  export let data;
  
  let records = data.records;
  let sortBy = 'date';
  let sortOrder = 'desc';
  let showDropdown = false;
  let showDatePicker = false;
  let startDate = data.startDate || '';
  let endDate = data.endDate || '';

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
  }

  function closeDropdown() {
    showDropdown = false;
  }

  function toggleDatePicker(event) {
    event.stopPropagation();
    showDatePicker = !showDatePicker;
  }

  function closeDatePicker() {
    showDatePicker = false;
  }

  function applyDateFilter() {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    goto(`?${params.toString()}`);
    showDatePicker = false;
  }

  function clearDateFilter() {
    startDate = '';
    endDate = '';
    goto('?');
    showDatePicker = false;
  }
</script>

<svelte:window on:click={closeDatePicker} />

<div class="min-h-screen bg-gray-50" dir="rtl">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
      
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
            
            <form method="POST" action="?/logout" use:enhance on:submit={closeDropdown}>
              <button 
                type="submit"
                class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center justify-end gap-2"
              >
                <span>تسجيل الخروج</span>
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
      <div class="mb-4 flex justify-end">
        <div class="relative">
          <button
            on:click={toggleDatePicker}
            class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-300"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-gray-700">تصفية حسب التاريخ</span>
            {#if startDate || endDate}
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            {/if}
          </button>

          {#if showDatePicker}
            <div 
              class="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px]"
              on:click|stopPropagation
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-right">
                    من تاريخ
                  </label>
                  <input
                    type="date"
                    bind:value={startDate}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-right">
                    إلى تاريخ
                  </label>
                  <input
                    type="date"
                    bind:value={endDate}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex gap-2 pt-2">
                  <button
                    on:click={applyDateFilter}
                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    تطبيق
                  </button>
                  <button
                    on:click={clearDateFilter}
                    class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    إعادة تعيين
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
                  class="px-6 py-4 text-right font-semibold text-gray-700 border-b-2 border-black cursor-pointer hover:bg-gray-200 transition-colors select-none"
                >
                  <div class="flex items-center justify-end gap-2">
                    المبلغ
                    {#if sortBy === 'amount'}
                      <span class="text-sm">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    {/if}
                  </div>
                </th>
                <th class="px-6 py-4 text-right font-semibold text-gray-700 border-b-2 border-black">
                  الصنف
                </th>
                <th 
                  on:click={() => sortRecords('date')}
                  class="px-6 py-4 text-right font-semibold text-gray-700 border-b-2 border-black cursor-pointer hover:bg-gray-200 transition-colors select-none"
                >
                  <div class="flex items-center justify-end gap-2">
                    التاريخ
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
                    لا توجد بيانات
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>