import { createRouter, createWebHistory } from 'vue-router'
import UserRegistrationPage from '../views/UserRegistration.vue'
import UserProfilePage from '../views/UserProfile.vue'
import LoginPage from '../views/LoginPage.vue'
import AboutUs from '../views/AboutUs.vue'
import ContactUs from '../views/ContactUs.vue'
import DonationPage from '../views/DonationPage.vue'
import InformationPage from '../views/InformationPage.vue'
import NewsFeed from '../views/NewsFeed.vue'
import ManageUsers from '../views/ManageUsers.vue'
import RatingPage from '../views/RatingPage.vue'
import FireLogin from '../views/FirebaseLogin.vue'
import FireRegister from '../views/FirebaseRegistrationPage.vue'
import store from '../store/store.js'
import ManageEvent from '../views/ManageEvent.vue'
import WeatherInformation from '../views/WeatherInformation.vue'
import MapInformation from '../views/MapInformation.vue'
import SecureDonationPage from '../views/SecureDonationPage.vue'
import DonationThankYouPage from '../views/DonationThankYouPage.vue'
import BulkEmail from '../views/BulkEmail.vue'
import CalendarView from '../views/CalendarView.vue'
import AdminDashboard from '../views/AdminDasboard.vue'
import GenAI from '../views/GenAI.vue'
import UpcomingEvents from '../views/UpcomingEvents.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: InformationPage
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs
    //  Per-route Guard
    //  beforeEnter: (to, from) => {
    // return false
    // }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/userProfile',
    name: 'UserProfilePage',
    component: UserProfilePage
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: ContactUs
  },
  {
    path: '/donation',
    name: 'DonationPage',
    component: DonationPage
  },
  {
    path: '/userRegistration',
    name: 'UserRegistrationPage',
    component: UserRegistrationPage
  },
  {
    path: '/newsFeed',
    name: 'NewsFeed',
    component: NewsFeed
  },
  {
    path: '/manageUsers',
    name: 'ManageUsers',
    component: ManageUsers
  },
  {
    path: '/ratingPage',
    name: 'RatingPage',
    component: RatingPage
  },
  {
    path: '/fireLogin',
    name: 'FireLogin',
    component: FireLogin
  },
  {
    path: '/fireRegister',
    name: 'FireRegister',
    component: FireRegister
  },
  {
    path: '/manageEvent',
    name: 'ManageEvent',
    component: ManageEvent
  },
  {
    path: '/weatherInformation',
    name: 'WeatherInformation',
    component: WeatherInformation
  },
  {
    path: '/mapInformation',
    name: 'MapInformation',
    component: MapInformation
  },
  {
    path: '/secureDonationPage',
    name: 'SecureDonationPage',
    component: SecureDonationPage,
    props: true
  },
  {
    path: '/donationThankYouPage',
    name: 'DonationThankYouPage',
    component: DonationThankYouPage,
    props: true
  },
  {
    path: '/bulkEmail',
    name: 'BulkEmail',
    component: BulkEmail,
    props: true
  },
  {
    path: '/calendarView',
    name: 'CalendarView',
    component: CalendarView
  },
  {
    path: '/adminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/genAI',
    name: 'GenAI',
    component: GenAI
  },
  {
    path: '/upcomingEvents',
    name: 'UpcomingEvents',
    component: UpcomingEvents
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!store.state.isAuthenticated && to.name === 'RatingPage') {
    alert('You must log in first to rate.')
    next ({ name: 'LoginPage' })
  } else {
    next()
  }
})

// router.beforeEach(async (to, from) => {
//   if(to.name == 'About'{
//     return false;
//   }
// })

export default router
