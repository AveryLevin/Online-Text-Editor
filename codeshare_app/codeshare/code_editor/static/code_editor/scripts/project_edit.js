Vue.config.devtools = true;

var supportedLangs = {
    "python": `def myfunc():
    print("Hello World!")
    return None
    `,
    "javascript": `let greeting = "Hello World!";
    `,
    "xml": `<h1> Hello World! </h1>
    `,
};

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
        active: false,
    },
    {
        displayName: "Folder B",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "folder",
        active: false,
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
        active: false,
    },
    {
        displayName: "main.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
        active: true,
    },
    {
        displayName: "really_really_long_file_name.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
        active: false,
    },
    {
        displayName: "helper2.py",
        edited: "Apr 7, 2017",
        created: "Oct 17, 2015",
        fileType: "python",
        active: false,
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

var openBreadcrumb = JSON.parse(document.getElementById('breadcrumb').textContent);
var projectFiles = JSON.parse(document.getElementById('proj-files').textContent);
var fileContent = JSON.parse(document.getElementById('file-content').textContent);
console.log(fileContent);

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
        class="breadcrumb-item"
        @click="goTo">
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

                    //check for redirect response
                    if (response.redirected) {
                        // if redirected, a folder was selected, goTo projectHome page
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
            img_url: "/static/projects/imgs/" + this.fileItem.fileType + ".png"
        }
    },
    template: `
    <div class="file-item"
    v-bind:class="{select : selected,
        activefile : this.fileItem.active}"
    @click="handleClicks">
        <img :src="this.img_url" alt="" style="width: 32px; height: 32px;">
        <div class="name-list">
            <div class="name2">[[ fileItem.displayName ]]</div>
        </div>
    </div>
    `,
    computed: {

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
            } else {
                this.selected = true;
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

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '.proj_home-root-vue',
    data: {
        openBreadcrumb: openBreadcrumb,
        fileContent: fileContent,
        projectFiles: projectFiles,
        postTo: window.location.href,
    },
    computed: {
        breadcrumbData: function () {
            return this.openBreadcrumb;
        },
        fileContent: function () {
            return this.fileContent;
        },
        fileData: function () {
            return this.projectFiles;
        },
        openFile: function () {
            var rVal = null;
            this.fileData.forEach(file => {
                if (file.active) {
                    console.log(file.displayName);
                    rVal = file;
                }
            });
            return rVal;
        },
        img_url: function () {
            return "/static/projects/imgs/" + this.openFile.fileType + ".png";
        }
    },
    methods: {
        saveFile: function () {
            var updatedCode = editor.getValue();

            let postData = JSON.stringify({
                action: "save_file",
                new_content: updatedCode,
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
                        // checks whether successfully saved
                        saveStatus = data;
                        console.log("saving:");
                        console.log(saveStatus.save_status);
                        // TODO: create toast for successful save
                    });
                }
            ).catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        },
        implementChanges: function (newFileData) {
            console.log("updating with info: ");
            console.log(newFileData)
            this.openBreadcrumb = newFileData['breadcrumb'];
            this.fileContent = newFileData['file_content'];
            this.projectFiles = newFileData['proj_files'];
            this.refreshCodeMirror();
        },
        refreshCodeMirror: function() {
            console.log("attempting to refresh editor");
            console.log(this.fileContent);
            editor.getDoc().setValue(this.fileContent);
        },
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
                <div class="row" style="height: calc(100% - 19px); margin-left: -15px;">
                    <div class="project-panel proj-container col-1">
                        <div class="proj-toolbar"> 
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
                            <file-item
                            v-for="file in fileData"
                            v-bind:file-item="file"
                            v-on:open-file-changed="implementChanges"></file-item>
                        </div>
                    </div>
                    <div class="code-panel proj-container col-11">
                        <div class="code-editor fill-width bg-light">
                            <div class="code-nav nav">
                                <div class="open-file-name">
                                <img :src="this.img_url" alt="" style="width: 32px; height: 32px;">
                                [[this.openFile.displayName]]</div>
                                <button class="save-btn my-2 justify-content-end btn btn-light"
                                @click="this.saveFile">Save</button>
                                <div class=""></div>
                            </div>
                            <div class="editor-wraper">
                                <textarea name="editor" id="editor" width="auto" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 0; right: 0;">
                <div class="toast-header">
                    <img src="..." class="rounded mr-2" alt="...">
                    <strong class="mr-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>
            -->
        </div>
    </div>
    </div>
    `
});

function createEditor(language, highlighting) {
    var starter = app.fileContent;
    if (starter != null) {
        document.getElementById('editor').value = starter;
    }
    return CodeMirror.fromTextArea
        (document.getElementById('editor'),
            {
                mode: language,
                theme: highlighting,
                lineNumbers: true,
                //addon autoclose brackets
                autoCloseBrackets: true,
                matchBrackets: true,
                autoCloseTags: true,
                matchTags: true,
                lineWrapping: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                scrollbarStyle: "overlay",
            });
}

var editor = new createEditor("python", "xq-light");
