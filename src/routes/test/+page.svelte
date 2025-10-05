<!-- +page.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let employees = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', password: 'password123' },
    { id: 2, name: 'Michael Chen', email: 'michael.chen@company.com', password: 'secure456' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@company.com', password: 'mypass789' },
    { id: 4, name: 'David Kim', email: 'david.kim@company.com', password: 'david2024' },
    { id: 5, name: 'Jessica Martinez', email: 'jessica.m@company.com', password: 'jess1234' }
  ];
  
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
  let nextId = 6;
  
  function openAddModal() {
    editingEmployee = null;
    formData = { name: '', email: '', password: '', confirmPassword: '' };
    errors = {};
    showModal = true;
  }
  
  function openEditModal(employee) {
    editingEmployee = employee;
    formData = {
      name: employee.name,
      email: employee.email,
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
  
  function validateForm() {
    errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!editingEmployee) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return Object.keys(errors).length === 0;
  }
  
  function handleSubmit() {
    if (!validateForm()) return;
    
    if (editingEmployee) {
      employees = employees.map(emp => {
        if (emp.id === editingEmployee.id) {
          return {
            ...emp,
            name: formData.name,
            email: formData.email,
            password: formData.password || emp.password
          };
        }
        return emp;
      });
    } else {
      employees = [...employees, {
        id: nextId++,
        name: formData.name,
        email: formData.email,
        password: formData.password
      }];
    }
    
    closeModal();
  }
  
  function confirmDelete(employee) {
    deleteEmployee = employee;
    showDeleteConfirm = true;
  }
  
  function handleDelete() {
    employees = employees.filter(emp => emp.id !== deleteEmployee.id);
    showDeleteConfirm = false;
    deleteEmployee = null;
  }
</script>

<svelte:head>
  <title>Employee Management</title>
</svelte:head>

<div class="container">
  <div class="header">
    <div class="header-content">
      <h1>Employee Management</h1>
      <p class="subtitle">Manage your team members efficiently</p>
    </div>
    <button class="btn-primary" on:click={openAddModal}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Add Employee
    </button>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each employees as employee (employee.id)}
          <tr>
            <td>
              <div class="name-cell">
                <div class="avatar">{employee.name.charAt(0)}</div>
                <span>{employee.name}</span>
              </div>
            </td>
            <td>{employee.email}</td>
            <td>
              <div class="actions">
                <button class="btn-icon edit" on:click={() => openEditModal(employee)} title="Edit">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M12.5 2.5L15.5 5.5L5.5 15.5H2.5V12.5L12.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="btn-icon delete" on:click={() => confirmDelete(employee)} title="Delete">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3.5 5.5H14.5M7 8V13M11 8V13M4.5 5.5L5.5 14.5C5.5 15.05 5.95 15.5 6.5 15.5H11.5C12.05 15.5 12.5 15.05 12.5 14.5L13.5 5.5M7 5.5V3.5C7 3 7.5 2.5 8 2.5H10C10.5 2.5 11 3 11 3.5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if showModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
        <button class="btn-close" on:click={closeModal}>×</button>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Enter full name"
            class:error={errors.name}
          />
          {#if errors.name}
            <span class="error-message">{errors.name}</span>
          {/if}
        </div>
        
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="name@company.com"
            class:error={errors.email}
          />
          {#if errors.email}
            <span class="error-message">{errors.email}</span>
          {/if}
        </div>
        
        <div class="form-group">
          <label for="password">Password {editingEmployee ? '(leave empty to keep current)' : '*'}</label>
          <input
            id="password"
            type="password"
            bind:value={formData.password}
            placeholder="Minimum 6 characters"
            class:error={errors.password}
          />
          {#if errors.password}
            <span class="error-message">{errors.password}</span>
          {/if}
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password {editingEmployee ? '' : '*'}</label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={formData.confirmPassword}
            placeholder="Re-enter password"
            class:error={errors.confirmPassword}
          />
          {#if errors.confirmPassword}
            <span class="error-message">{errors.confirmPassword}</span>
          {/if}
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn-secondary" on:click={closeModal}>Cancel</button>
          <button type="submit" class="btn-primary">{editingEmployee ? 'Update' : 'Add'} Employee</button>
        </div>
      </form>
    </div>
  </div>
{/if}

{#if showDeleteConfirm}
  <div class="modal-overlay" on:click={() => showDeleteConfirm = false}>
    <div class="modal confirm-modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Confirm Delete</h2>
        <button class="btn-close" on:click={() => showDeleteConfirm = false}>×</button>
      </div>
      
      <div class="confirm-content">
        <div class="warning-icon">⚠️</div>
        <p>Are you sure you want to delete <strong>{deleteEmployee?.name}</strong>?</p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn-secondary" on:click={() => showDeleteConfirm = false}>Cancel</button>
        <button type="button" class="btn-danger" on:click={handleDelete}>Delete</button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: white;
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-content h1 {
    color: black;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }
  
  .subtitle {
    color: #333;
    margin: 0;
    font-size: 1.1rem;
  }
  
  .table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: black;
  }
  
  th {
    padding: 1.2rem 1.5rem;
    text-align: left;
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
  }
  
  tbody tr:hover {
    background-color: #f8f9ff;
  }
  
  td {
    padding: 1.2rem 1.5rem;
    color: #333;
  }
  
  .name-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-primary {
    background: black;
    color: white;
    border: none;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  .btn-secondary {
    background: #f5f5f5;
    color: #666;
    border: none;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background: #e5e5e5;
  }
  
  .btn-icon {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-icon.edit {
    color: #667eea;
  }
  
  .btn-icon.edit:hover {
    background: #f0f3ff;
  }
  
  .btn-icon.delete {
    color: #ef4444;
  }
  
  .btn-icon.delete:hover {
    background: #fee;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }
  
  .modal {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .confirm-modal {
    max-width: 400px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: #999;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-close:hover {
    color: #666;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 600;
    font-size: 0.95rem;
  }
  
  input {
    width: 100%;
    padding: 0.85rem;
    border: 2px solid #e5e5e5;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  input.error {
    border-color: #ef4444;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .confirm-content {
    text-align: center;
    padding: 1rem 0;
  }
  
  .warning-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .confirm-content p {
    color: #555;
    margin: 0.5rem 0;
    font-size: 1.05rem;
  }
  
  .warning-text {
    color: #999;
    font-size: 0.9rem;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-danger:hover {
    background: #dc2626;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 2rem 1rem;
    }
    
    .header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .header-content h1 {
      font-size: 2rem;
    }
    
    table {
      font-size: 0.9rem;
    }
    
    th, td {
      padding: 1rem;
    }
    
    .avatar {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }
  }
</style>