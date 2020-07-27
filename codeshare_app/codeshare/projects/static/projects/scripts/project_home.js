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
]

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

    }
});

Vue.component('file-item', {
    delimiters: ['[[', ']]'],
    props: {
        fileItem: Object,
    },
    data: function () {
        return {
            selected: false,
            img_url: "/static/projects/imgs/" + this.fileItem.fileType + ".png"
        }
    },
    template: `
    <div class="file-item"
    v-bind:class="{select : selected}"
    @click="toggleSelect">
        <img :src="this.img_url" alt="" style="width: 32px; height: 32px;">
        <div class="name-list">
            <div class="name2">[[ fileItem.displayName ]]</div><div class="edited2">[[ fileItem.edited ]]</div><div class="created2">[[ fileItem.created ]]</div>
        </div>
    </div>
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
            projHomeData: projHomeData
        }
    },
    computed: {
        breadcrumbData: function () {
            return sampleBreadcrumData;
        },
        projects: function () {
            return sampleProjectData;
        },
        contributers: function () {
            return sampleUserData;
        },
        fileData: function () {
            return sampleFileData;
        }
    },
    template: `
    <div class="container-fluid" style="height: 100%;">
                    <div class="row" style="height: 100%;">
                        <div class="proj_main-container proj-container container">
                            <nav aria-label="breadcrumb" class="breadcrumb-header">
                                <ol class="breadcrumb breadcrumb-list">
                                    <breadcrumb-item
                                    v-for="(breadcrumb, index) in this.breadcrumbData"
                                    v-bind:breadcrumb="breadcrumb"
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
                                        <div class="control-icon">
                                            <!-- TODO: add @click event-->
                                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </div>
                                        <div class="control-icon">
                                            <!-- TODO: add @click event-->
                                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-folder-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M9.828 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91H9v1H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181L15.546 8H14.54l.265-2.91A1 1 0 0 0 13.81 4H9.828zm-2.95-1.707L7.587 3H2.19c-.24 0-.47.042-.684.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293z"/>
                                                <path fill-rule="evenodd" d="M13.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                                                <path fill-rule="evenodd" d="M13 12.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
                                            </svg>    
                                        </div>
                                        <div class="control-icon">
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
                                        v-bind:file-item="file"></file-item>

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
    `
});