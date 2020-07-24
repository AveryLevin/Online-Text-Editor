Vue.config.devtools = true;

var sampleProjectData = [
    {
        name: 'Hello World',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'Snake',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'Algorithms Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
]

var sampleUserData = [
    {
        name: 'John Doe',
    },
    {
        name: 'Jim Smith',
    },
    {
        name: 'Sally Burkes',
    },
]

Vue.component('project-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {

        }
    },
    props: {
        projectItem: Object,
    },
    template: `
    <div class="project-icon">
        <img src="/static/accounts/imgs/code_light.png" alt="">
        <div class="proj-title">
            [[ projectItem.name]]
        </div>
        <div class="date-created">
            <div class="label">created:</div>
            [[ projectItem.createDate ]]
        </div>
        <div class="date-edited">
            <div class="label">last opened:</div>
            [[ projectItem.lastEditDate ]]
        </div>
    </div>
    `,
    computed: {

    },
    methods: {
        
    }
});

Vue.component('user-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {

        }
    },
    props: {
        user: Object,
    },
    template: `
    <li class="list-group-item">
        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-person-circle"
            fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color: gray;">
            <path
                d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
            <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path fill-rule="evenodd"
                d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
        </svg>
        [[ user.name ]]
    </li>
    `,
    computed: {

    },
    methods: {
        
    }
});

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '.user_home-root-vue',
    data: function () {
        return {
            userHomeData: userHomeData
        }
    },
    computed: {
        projects: function () {
            return sampleProjectData;
        },
        affiliatedUsers: function () {
            return sampleUserData;
        }
    },
    template: `
    <div class="container-fluid" style="height: 100%;">
                    <div class="row" style="height: 100%;">
                        <div class="projects-list-container col-9">
                            <div class="projects-header">
                                Recent Projects
                            </div>
                            <div class="projects-content">
                                <!-- for loop for project list. -->
                                <project-item
                                v-for="project in this.projects" 
                                v-bind:project-item="project"></project-item>
                            </div>
                        </div>
                        <div class="affiliated-users-list-container col">
                            <div class="container user-pane-title">
                                Affiliated Users
                            </div>
                            <ul class="list-group user-pane-list">
                                <!-- for loop for user list. -->
                                <user-item
                                v-for="user in this.affiliatedUsers" 
                                v-bind:user="user"></user-item>
                            </ul>
                            <div class="container user-button-panel">
                                <button type="button" class="btn btn-light">Find Other Users</button>
                            </div>
                        </div>
                    </div>
                </div>
    `
});