Vue.config.devtools = true;

var sampleBreadcrumData = [
    {
        displayName: "Main Project",
        rederName: "",
    },
    {
        displayName: "Folder 1",
        rederName: "",
    },
    {
        displayName: "Folder 2",
        rederName: "",
    },
]

var sampleFileData = [
    {
        displayName: "Folder A",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "folder",
    },
    {
        displayName: "Folder B",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "folder",
    },
    {
        displayName: "Folder C",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "folder",
    },
    {
        displayName: "Folder D",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "folder",
    },
    {
        displayName: "main.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
    },
    {
        displayName: "helper1.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
    },
    {
        displayName: "helper2.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
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
    {
        name: 'Jane Doe',
    },
    {
        name: 'Sarah Lin',
    },
    {
        name: 'Tom Leir',
    },
];

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
var csrftoken = getCookie('csrftoken');
console.log(csrftoken);

var openBreadcrumb = JSON.parse(document.getElementById('breadcrumb').textContent);
var projectContributers = JSON.parse(document.getElementById('contr-data').textContent);
var projectFiles = JSON.parse(document.getElementById('proj-files').textContent);
// console.log(projectContributers)
//console.log(projectFiles)
//console.log(openBreadcrumb);

Vue.component('breadcrumb-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {

        }
    },
    props: {
        breadcrumb: Object,
        active: Boolean
    },
    template: `
        <li 
        v-if="!active"
        @click="goTo"
        class="breadcrumb-item">
            <a href="#">
                [[ breadcrumb.displayName ]]
            </a>
        </li>
        <li 
        v-else
        class="breadcrumb-item active"
        aria-current="page">
            [[ breadcrumb.displayName ]]
        </li>
    `,
    computed: {

    },
    methods: {
        goTo: function () {
            console.log("attempting to open breadcrumb " + this.breadcrumb.displayName)
            console.log("Attempting POST Request to " + this.postTo);

            let postData = JSON.stringify({
                action: "goto_breadcrumb",
                prev_breadcrumb: app.breadcrumbData,
                id: this.breadcrumb.id,
                this_breadcrumb: this.breadcrumb,
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

                    //check response data
                    response.json().then(function (data) {

                        fileData = data;
                        console.log("recieved:");
                        console.log(fileData);
                        self.$emit('open-file-changed', fileData);
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        }
    }
});

Vue.component('file-item', {
    delimiters: ['[[', ']]'],
    props: {
        fileItem: Object,
    },
    data: function () {
        return {
            result: [],
            delay: 200,
            clicks: 0,
            time: null,
            selected: false,
        }
    },
    computed: {

    },
    template: `
    <div class="file-item"
    v-bind:class="{select : selected}"
    @click="handleClicks">
        <img :src="this.img_url" alt="" style="width: 32px; height: 32px;">
        <div class="name-list">
            <div class="name2">[[ fileItem.displayName ]]</div><div class="edited2">[[ fileItem.edited ]]</div><div class="created2">[[ fileItem.created ]]</div>
        </div>
    </div>
    `,
    computed: {
        img_url: function () {
            return "/static/projects/imgs/" + this.fileItem.fileType + ".png"
        }
    },
    methods: {
        handleClicks: function () {
            this.clicks++;
            if (this.clicks === 1) {
                var self = this;
                this.timer = setTimeout(function () {
                    self.clicks = 0;
                    self.toggleSelect();
                }, this.delay)
            } else {
                clearTimeout(this.timer);
                this.clicks = 0;
                this.openFileFolder();
            }
        },
        toggleSelect: function () {
            if (this.selected) {
                this.selected = false;
                app.selectedFiles.splice(app.selectedFiles.indexOf(this.fileItem.id), 1);
                console.log(app.selectedFiles);
            } else {
                this.selected = true;
                app.selectedFiles.push(this.fileItem.id);
                console.log(app.selectedFiles);
            }
        },
        openFileFolder: function () {
            console.log("attempting to open " + this.fileItem.displayName)
            console.log("Attempting POST Request to " + this.postTo);

            let postData = JSON.stringify({
                action: "open_file",
                prev_breadcrumb: app.breadcrumbData,
                id: this.fileItem.id
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
                    console.log("RESPONSE:");
                    console.log(response);
                    //check for redirect response
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                    //check response data
                    response.json().then(function (data) {

                        fileData = data;
                        console.log("received:");
                        console.log(fileData);
                        self.$emit('open-file-changed', fileData);
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        }
    }
});

Vue.component('user-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {
            selected: false
        }
    },
    props: {
        user: Object,
    },
    template: `
    <li class="list-group-item"
        v-bind:class="{select : selected}"
    @click="toggleSelect">
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
            } else {
                this.selected = true;
            }
        },
    }
});

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '.proj_home-root-vue',
    data: function () {
        return {
            openBreadcrumb: openBreadcrumb,
            projectContributers: projectContributers,
            projectFiles: projectFiles,
            postTo: window.location.href,
            modalData: {
                header: "",
                body: "",
                footer: "",
            },
            selectedFiles: [],
        }
    },
    computed: {
        breadcrumbData: function () {
            return this.openBreadcrumb;
        },
        contributers: function () {
            return this.projectContributers;
        },
        fileData: function () {
            return this.projectFiles;
        }
    },
    methods: {
        implementChanges: function (newFileData) {
            console.log("updating with info: ");
            console.log(newFileData)
            this.openBreadcrumb = newFileData['breadcrumb'];
            this.projectContributers = newFileData['contributers'];
            this.projectFiles = newFileData['proj_files'];
        },
        deleteFiles: function () {

            console.log("deleting:");
            console.log(this.selectedFiles);

            let postData = JSON.stringify({
                action: "delete_files",
                files: this.selectedFiles,
                prev_breadcrumb: this.openBreadcrumb,
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

                    //check for redirect response 
                    if (response.redirected) {
                        window.location.href = response.url;
                    }

                    //check response data
                    response.json().then(function (data) {

                        fileData = data;
                        console.log("received:");
                        console.log(fileData);
                        self.implementChanges(fileData);
                        $('#universalModal').modal('toggle');
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        },
        createFolder: function () {
            var folderName = document.getElementById('enter-folder-name').value;

            if (folderName == 'Enter name' || folderName == '') {
                console.log("invalid name")
                this.modalData.body = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Please give the folder a name.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                ` + this.modalData.body;
                return;
            }

            console.log("craeating project: " + folderName);

            let postData = JSON.stringify({
                action: "create_folder",
                name: folderName,
                prev_breadcrumb: this.openBreadcrumb,
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

                    //check for redirect response 
                    if (response.redirected) {
                        window.location.href = response.url;
                    }

                    //check response data
                    response.json().then(function (data) {

                        fileData = data;
                        console.log("received:");
                        console.log(fileData);
                        self.implementChanges(fileData);
                        $('#universalModal').modal('toggle');
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        },
        createFile: function () {
            var fileName = document.getElementById('enter-folder-name').value;

            if (fileName == 'Enter name' || fileName == '') {
                console.log("invalid name")
                this.modalData.body = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Please give the file a name.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                ` + this.modalData.body;
                return;
            }

            console.log("craeating project: " + fileName);

            let postData = JSON.stringify({
                action: "create_file",
                name: fileName,
                prev_breadcrumb: this.openBreadcrumb,
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

                    //check for redirect response 
                    if (response.redirected) {
                        window.location.href = response.url;
                    }

                    //check response data
                    response.json().then(function (data) {

                        if ('failed' in data) {
                            console.log("invalid name")
                            self.modalData.body = `
                            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                Invalid file extension. 
                                <br>
                                Supported file types:
                                ` + data['validExtensions'] + `
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            ` + self.modalData.body;
                            return;
                        }
                        fileData = data;
                        console.log("received:");
                        console.log(fileData);
                        self.implementChanges(fileData);
                        $('#universalModal').modal('toggle');
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        },
        deleteFilesDialog: function () {
            if (this.selectedFiles.length < 1) {
                return
            } else if (this.selectedFiles.length > 1) {
                this.createDialog({
                    header: "Delete Files",
                    body: `
                    This will delete all selected files and all of their contents. Do you wish to continue?
                    `,
                    footer: `
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary"
                    id="delete-button">Delete</button>
                    `,
                });
            } else {
                this.createDialog({
                    header: "Delete File",
                    body: `
                    This will delete the selected file and all of its contents. Do you wish to continue?
                    `,
                    footer: `
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary"
                    id="delete-button">Delete</button>
                    `,
                });
            }

        },
        createFileDialog: function () {
            this.createDialog({
                header: "Create New File",
                body: `
                <div class="form-group>
                    <label for="enter-folder-name">
                        File Name:
                    </label>
                    <input 
                    class="form-control" 
                    id="enter-folder-name"
                    placeholder="Enter name">
                </div>
                `,
                footer: `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary"
                id="create-button-file">Create</button>
                `,
            });
        },
        createFolderDialog: function () {
            this.createDialog({
                header: "Create New Folder",
                body: `
                <div class="form-group>
                    <label for="enter-folder-name">
                        Folder Name:
                    </label>
                    <input 
                    class="form-control" 
                    id="enter-folder-name"
                    placeholder="Enter name">
                </div>
                `,
                footer: `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary"
                id="create-button-fold">Create</button>
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
            if (e.target.matches('#create-button-fold')) {
                this.createFolder();
            } else if (e.target.matches('#delete-button')) {
                this.deleteFiles();
            } else if (e.target.matches('#create-button-file')) {
                this.createFile();
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
                        <div class="modal-footer"
                        v-html="this.modalData.footer"                        
                        @click="handleModalClick">
                        </div>
                    </div>
                </div>
            </div>
            <div class="proj_main-container proj-container container">
                <nav aria-label="breadcrumb" class="breadcrumb-header">
                    <ol class="breadcrumb breadcrumb-list">
                        <breadcrumb-item
                        v-for="(breadcrumb, index) in this.breadcrumbData"
                        v-bind:breadcrumb="breadcrumb"
                        v-on:open-file-changed="implementChanges"
                        v-bind:active="index == breadcrumbData.length - 1"></breadcrumb-item>
                    </ol>
                </nav>
                <div class="row" style="height: calc(100% - 65px); margin: 0px;">
                    <div class="project-panel proj-container col-8">
                        <div class="proj-toolbar"> 
                            <form class="form-inline search-bar">
                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-success my-2 my-sm-0 disabled" type="submit">Search</button>
                            </form>
                            <div class="control-icon"
                            v-bind:class="{'control-icon-disabled' : this.selectedFiles.length < 1}"
                            @click="deleteFilesDialog">
                                <!-- TODO: add @click event-->
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </div>
                            <div class="control-icon"
                            @click="createFolderDialog">
                                <!-- TODO: add @click event-->
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-folder-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M9.828 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91H9v1H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181L15.546 8H14.54l.265-2.91A1 1 0 0 0 13.81 4H9.828zm-2.95-1.707L7.587 3H2.19c-.24 0-.47.042-.684.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293z"/>
                                    <path fill-rule="evenodd" d="M13.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                                    <path fill-rule="evenodd" d="M13 12.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
                                </svg>    
                            </div>
                            <div class="control-icon"
                            @click="createFileDialog">
                                <!-- TODO: add @click event-->
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-file-earmark-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5v-1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5v2.5A1.5 1.5 0 0 0 10.5 6H13v2h1V6L9 1z"/>
                                    <path fill-rule="evenodd" d="M13.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                                    <path fill-rule="evenodd" d="M13 12.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="file-explorer"> 
                            
                            <div class="file-exp-header container-fluid">
                                <div class="name">Name</div><div class="edited">Edited</div><div class="created">Created</div>
                            </div>

                            <file-item
                            v-for="file in fileData"
                            v-bind:file-item="file"
                            v-on:open-file-changed="implementChanges"></file-item>

                        </div>
                    </div>
                    <div class="extras-panel col-4">
                        <div class="contributers-panel proj-container">
                            <div class="proj-toolbar">
                                <span class="contr-title">Contributers</span>
                                <div class="control-icon">
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-dash-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
                                    </svg>
                                </div>
                                <div class="control-icon">
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-plus-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                                        <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                                        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="user-list overflow-auto">
                                <user-item
                                v-for="user in this.contributers" 
                                v-bind:user="user"></user-item>
                            </div>
                        </div>
                        <div class="submit-panel">
                            <button type="button" class="btn btn-success">Publish</button
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    `
});