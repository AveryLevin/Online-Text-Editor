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

Vue.component('breadcrumb-item', {
    delimiters: ['[[', ']]'],
    data: function () {
        return {

        }
    },
    props: {
        breadcrumb: Object,
        active: Boolean,
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
        affiliatedUsers: function () {
            return sampleUserData;
        }
    },
    template: `
    <div class="container-fluid" style="height: 100%;">
                    <div class="row" style="height: 100%;">
                        <div class="proj_main-container proj_container container">
                            <nav aria-label="breadcrumb" class="breadcrumb-header">
                                <ol class="breadcrumb breadcrumb-list">
                                    <breadcrumb-item
                                    v-for="(breadcrumb, index) in this.breadcrumbData"
                                    v-bind:breadcrumb="breadcrumb"
                                    v-bind:active="index == breadcrumbData.length - 1"></breadcrumb-item>
                                </ol>
                            </nav>
                            <div class="proj-toolbar proj_container container"> 
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
                                <div class="control-icon">
                                    <!-- TODO: add @click event-->
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </div>
                                <form class="form-inline search-bar">
                                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                                    <button class="btn btn-outline-success my-2 my-sm-0 disabled" type="submit">Search</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
    `
});