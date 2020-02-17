const store = Vue.observable({
    isNavOpen: false
});

const mutations = {
    setIsNavOpen(yesno) {
        store.isNavOpen = yesno;
    },
    toggleNav() {
      store.isNavOpen = !store.isNavOpen;
    }
};


Vue.component('sidebar', {
  template: '#sidebar',
  methods: {
    closeSidebarPanel: mutations.toggleNav
  },
  computed: {
    isPanelOpen() {
      return store.isNavOpen
    }
  }
});

Vue.component('burger', {
  template: '#burger',
  computed: {
    isBurgerActive() {
      return store.isNavOpen
    }
  },
  methods: {
    toggle() {
      mutations.toggleNav()
    }
  }
});

new Vue({
  el: '#app',
  data () {
    return {
      items: [],
      errors: {
        email: '',
        password: ''
      },
      showSideNav: false,
      isSubmitting: false,
      showLessArticles: true,
      isSuccessAlert: null,
      hasAlert: false,
      user: {
        email: '',
        password: '',
      }
    }
  },

  computed: {
    itemsToDisplay () {
      // get 3 items for home page
      if (this.showLessArticles) {
        return this.items.slice(0, 3);
      }
    },

    closeNav() {
      return !this.showSideNav
    }
  },

  mounted () {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => (this.items = response.data))
  },

  methods: {
    closeAlert () {
      return this.hasAlert = false
    },

    resetForm () {
      this.user = {}
    },

    openMenu () {
      this.showSideNav = true
    },

    closeMenu () {
      this.showSideNav = false
    },

    // validate form fields are not empty
    checkForm () {      
      this.isSubmitting = true

      // if fields are not empty
      if (this.user.email && this.user.password) {
        this.isSubmitting = true
        this.submitForm();
      }

      this.errors = {};

      // if email is empty 
      if (!this.user.email) {
        this.isSubmitting = true
        this.showError
        this.errors.email = 'Email is required.'
      }

      // if pw is empty and is not  12 characters
      if (!this.user.password) {
        this.isSubmitting = true
        this.errors.password = 'Password is required.'
      }
      this.isSubmitting = false
    },

    submitForm () {
      this.isSubmitting = true

      axios.post('https://reqres.in/api/register', {
        email: this.user.email,
        password: this.user.password 
      }).then(response => {

        if (response.status == 200) {
          this.hasAlert = true
          this.isSuccessAlert = true
          this.user = {}
        }

      }).catch(error => {
        this.hasAlert = true
        this.isSuccessAlert = false
        this.isSubmitting = false
      });
    },
  },
})
