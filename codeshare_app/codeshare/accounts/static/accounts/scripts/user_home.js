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
    {
        name: 'RepeatMe Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'RepeatMe Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'RepeatMe Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'RepeatMe Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'RepeatMe Project',
        createDate: 'Oct 12, 2019',
        lastEditDate: 'Jul 15, 2020',
    },
    {
        name: 'RepeatMe Project',
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

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var userProjsData = JSON.parse(document.getElementById('user-projs').textContent);
var affiliatedUsers = JSON.parse(document.getElementById('aff-users').textContent);
var addibleUsers = {};
console.log(userProjsData);
console.log(affiliatedUsers);

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
    <div class="project-icon"
    @click="openProject">
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
        openProject: function () {
            window.location.href = "/projects/proj_" + this.projectItem.id;
        }
    }
});

Vue.component('user-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {
            selected: false,
        }
    },
    props: {
        user: Object,
        editable: Boolean,
    },
    template: `
    <li class="list-group-item"
    v-bind:class="{select : selected}">
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
        toggleSelect: function () {
            if (this.selected) {
                this.selected = false;
                app.selectedUsers.splice(app.selectedUsers.indexOf(this.fileItem.id), 1);
                console.log(app.selectedUsers);
            } else {
                this.selected = true;
                app.selectedFiles.push(this.fileItem.id);
                console.log(app.selectedFiles);
            }
        },
    }
});

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '.user_home-root-vue',
    data: function () {
        return {
            modalData: {
                header: "",
                body: "",
                footer: "",
            },
            postTo: window.location.href,
            addUsers: {},
        }
    },
    computed: {
        projects: function () {
            return userProjsData;
        },
        affiliatedUsers: function () {
            return affiliatedUsers;
        },
    },
    methods: {
        createProject: function () {
            var projectName = document.getElementById('enter-proj-name').value;

            if (projectName == 'Enter name' || projectName == '') {
                console.log("invalid name")
                this.modalData.body = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Please give the project a name.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                ` + this.modalData.body;
                return;
            }

            console.log("craeating project: " + projectName);

            let postData = JSON.stringify({
                action: "create_proj",
                name: projectName,
            });
            var self = this;
            fetch(app.postTo, {
                method: 'post',
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: postData,

            }).then(
                function (response) {
                    if (response.status != 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    //check for redirect response (should redir to new project)
                    if (response.redirected) {
                        // if redirected, a folder was selected, goTo projectHome page
                        window.location.href = response.url;
                    }
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });

        },
        searchUser: function () {
            // TODO: implement me!
            var userName = document.getElementById('enter-user-name').value;

            if (userName == "Enter user's name" || userName == '') {
                console.log("invalid name")
                this.modalData.body = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Please give a valid username.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                ` + this.modalData.body;
                return;
            }

            console.log("searching user: " + userName);

            let postData = JSON.stringify({
                action: "user_search",
                name: userName,
            });
            var self = this;
            fetch(app.postTo, {
                method: 'post',
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: postData,

            }).then(
                function (response) {
                    if (response.status == 400) {

                    } else if (response.status != 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    //check for redirect response (should redir to new project)
                    if (response.redirected) {
                        // if redirected, a folder was selected, goTo projectHome page
                        window.location.href = response.url;
                    }

                    //check response data
                    response.json().then(function (data) {


                        let userList = data;
                        console.log("received:");
                        self.addUsers = userList.users;
                        console.log(self.addUsers);
                        self.modalData.body = `
                        <div class="container user-pane-title">
                            Select Users to Add
                        </div>
                        `;
                        //$('#universalModal').modal('toggle');
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });

        },
        openCreateProjectDialog: function () {
            this.createDialog({
                header: "Create New Project",
                body: `
                <div class="form-group">
                    <label for="enter-proj-name">
                        Project Name:
                    </label>
                    <input 
                    class="form-control" 
                    id="enter-proj-name"
                    placeholder="Enter name">
                </div>
                `,
                footer: `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary"
                id="create-button">Create</button>
                `,
            });
        },
        openCreateFindFriendDialog: function () {
            this.createDialog({
                header: "Add New Friend",
                body: `
                <div class="form-group">
                    <label for="enter-user-name">
                        Search Users:
                    </label>
                    <input 
                    class="form-control" 
                    id="enter-user-name"
                    placeholder="Enter user's name">
                </div>
                `,
                footer: `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary"
                id="search-button">Search</button>
                `,
            });
        },
        createDialog: function (dialogContent) {
            // check if dictionary provided
            try {
                this.modalData.header = dialogContent.header;
                this.modalData.body = dialogContent.body;
                this.modalData.footer = dialogContent.footer;
                console.log("creating modal");
                $('#universalModal').modal('toggle');
            } catch (error) {
                console.log("DIALOG ERROR: wrong content type provided");
                console.log(error);
            }

        },
        handleModalClick: function (e) {
            // this was a pretty neat trick to be able to check when 'create' button is pressed
            /**
             * Since the modal is being loaded dynamically using Vue's v-html, Vue won't parse
             * the html and see an '@click handler. Therefor, I put the handler on the entire
             * div where content is being inserted and use this method to check the element 
             * target matches the 'create' button
             */
            if (e.target.matches('#create-button')) {
                this.createProject();
            } else if (e.target.matches('#search-button')) {
                this.searchUser();
            }
        },
    },
    template: `
    <div class="container-fluid" style="height: 100%;">
        <div class="row" style="height: 100%;">
            <div class="modal fade" 
            id="universalModal" 
            tabindex="-1" 
            role="dialog" 
            aria-labelledby="exampleModalCenterTitle" 
            aria-hidden="true"
            data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">[[ this.modalData.header ]]</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                            <div class="modal-body"
                            v-html="this.modalData.body">
                            </div>
                        <ul class="modal-list list-group user-pane-list">
                            <!-- for loop for user list. -->
                            <user-item
                            v-for="user in this.addUsers" 
                            v-bind:user="user"
                            editable=true>Test</user-item>
                        </ul>
                        <div class="modal-footer"
                        v-html="this.modalData.footer"                        
                        @click="handleModalClick">
                        </div>
                    </div>
                </div>
            </div>
            <div class="projects-list-container col-9">
                <div class="projects-header">
                    Recent Projects
                </div>
                <div class="projects-content overflow-auto">
                    <!-- for loop for project list. -->
                    <project-item
                    v-for="project in this.projects" 
                    v-bind:project-item="project"></project-item>
                    <div class="project-icon"
                    style="background-color: #f8f9fa;"
                    @click="openCreateProjectDialog">
                    <div class="add-icon">
                        <svg width="7.5em" height="8em" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="rgb(200 200 200)" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                            <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        </svg>
                    </div>
                    </div>
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
                    v-bind:user="user"
                    editable=false></user-item>
                </ul>
                <div class="container user-button-panel">
                    <button type="button" class="btn btn-light" @click="openCreateFindFriendDialog">Find Other Users</button>
                </div>
            </div>
        </div>
    </div>
    `
});