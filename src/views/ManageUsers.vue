<template>
  <div class="header-row"></div>
  <div class="user-management">
    <h1>Manage Users</h1>
    <p>Here you can manage the app's users with this interactive table</p>
    <div class="row mt-5 col-12">
      <h4>Users list:</h4>
      <DataTable :value="paginatedUsers" dataKey="id" responsiveLayout="scroll">
        <TableColumn field="email" header="Email"></TableColumn>
        <TableColumn field="username" header="Username"></TableColumn>
        <TableColumn field="firstname" header="First Name"></TableColumn>
        <TableColumn field="lastname" header="Last Name"></TableColumn>
        <TableColumn field="role" header="Role"></TableColumn>
        <TableColumn field="address" header="Address"></TableColumn>
        <TableColumn field="gender" header="Gender"></TableColumn>
        <TableColumn field="motivation" header="Motivation"></TableColumn>
        <TableColumn field="isaustralian" header="Is Australian">
          <template #body="slotProps">{{ slotProps.data.isaustralian ? 'Yes' : 'No' }}</template>
        </TableColumn>
        <TableColumn field="password" header="Password"></TableColumn>
        <TableColumn header="Action">
          <template #body="slotProps">
            <button @click="deleteUser(slotProps.data.id)">Delete</button>
          </template>
        </TableColumn>
      </DataTable>
      <div class="btn">
        <button class="btn filter-btn" @click="filterUsers">Search Users</button>
        <button class="btn filter-btn" @click="orderUsers">Order Users</button>
        <button class="btn filter-btn" @click="limitUsers">Limit Users</button>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div class="row mt-2 mb-2">
      <div class="col-12 d-flex justify-content-center">
        <button class="btn refresh-button" @click="refreshData">Refresh Data</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebaseConfig.js'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  limit,
  orderBy
} from 'firebase/firestore'

export default {
  setup() {
    const users = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)

    const totalPages = computed(() => {
      return Math.ceil(users.value.length / pageSize.value)
    })

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return users.value.slice(start, end)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const filterUsers = async () => {
      try {
        const filterField = prompt(
          'Please enter the field you want to filter by (e.g., username):'
        )
        const searchKeyword = prompt('Please enter the keyword to search for:')

        // This is an exact match filter setup; Firestore doesn't support partial matches natively.
        const q = query(
          collection(db, 'SAHusers'),
          where(filterField, '==', searchKeyword)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          alert(`No results found for ${filterField} with keyword "${searchKeyword}"`)
          return
        }

        const usersArray = []
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() })
        })
        users.value = usersArray
      } catch (error) {
        console.error('Error fetching users:', error)
        alert(`Error: Failed to filter users.`)
      }
    }

    const orderUsers = async () => {
      try {
        const orderByField = prompt('Enter the field to order by:')
        const q = query(collection(db, 'SAHusers'), orderBy(orderByField, 'asc'))
        const querySnapshot = await getDocs(q)
        const usersArray = []
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() })
        })
        users.value = usersArray
      } catch (error) {
        console.error('Error fetching users:', error)
        alert(`Error: Failed to order users.`)
      }
    }

    const limitUsers = async () => {
      try {
        const limitValue = prompt('Enter the maximum number of results:')
        if (isNaN(limitValue)) {
          alert('You must input a number.')
          return
        }
        const q = query(collection(db, 'SAHusers'), limit(limitValue))
        const querySnapshot = await getDocs(q)
        const usersArray = []
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() })
        })
        users.value = usersArray
      } catch (error) {
        console.error('Error fetching users:', error)
        alert(`Error: Failed to limit users.`)
      }
    }

    const refreshData = async () => {
      const tempUsers = []
      const querySnapshot = await getDocs(collection(db, 'SAHusers'))
      querySnapshot.forEach((doc) => {
        let userData = doc.data()
        userData.id = doc.id // Appending ID for use as a key in lists
        tempUsers.push(userData)
      })
      users.value = [...tempUsers] // Updating the users reactive data
    }

    const deleteUser = async (userId) => {
      await deleteDoc(doc(db, 'SAHusers', userId))
      refreshData()
    }

    onMounted(() => {
      refreshData()
    })

    return {
      users,
      limitUsers,
      orderUsers,
      filterUsers,
      paginatedUsers,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      refreshData,
      deleteUser
    }
  }
}
</script>

<style scoped>
.header-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0 auto;
  text-align: center;
  border-radius: 10px;
}

.header-row-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: large;
  text-align: right;
  padding-right: 20px;
}

.user-management {
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button {
  background-color: #0f6741;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  box-shadow: 0 4px #999;
}

.refresh-button:hover {
  background-color: #4b9118;
  box-shadow: 0 5px #666;
  transform: translateY(-2px);
}

.refresh-button:active {
  background-color: #1f788a;
  box-shadow: 0 2px #666;
  transform: translateY(6px);
}
</style>
