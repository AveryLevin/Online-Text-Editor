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
    v-bind:class="{activefile : this.fileItem.active}"
    @click="toggleSelect">
        <img :src="this.img_url" alt="" style="width: 32px; height: 32px;">
        <div class="name-list">
            <div class="name2">[[ fileItem.displayName ]]</div>
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

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '.proj_home-root-vue',
    data: {
        //projHomeData: projHomeData,
        projHomeData: null,
        activeFile: "main.py",
        language: "python"
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
        },
        openFile: function() {
            var rVal = null;
            this.fileData.forEach(file => {
                if (file.active) {
                    console.log(file.displayName);
                    rVal = file;
                }
            });
            return rVal;
        },        
        img_url: function() {
            return "/static/projects/imgs/" + this.openFile.fileType + ".png";
        }
    },
    template: `
    <div class="container-fluid" style="height: 100%;">
                    <div class="row" style="height: 100%;">
                        <div class="proj_main-container proj-container container">
                            <nav aria-label="breadcrumb" class="breadcrumb-header breadcrumb" style="margin-bottom: 0px;     border-radius: 0;">
                                Quick Code
                            </nav>
                            <div class="row" style="height: calc(100% - 19px); margin-left: -15px;">
                                <div class="code-panel proj-container" style="max-width: 100% !important">
                                    <div class="code-editor fill-width bg-light">
                                        <div class="editor-wraper" style="height: 100%;">
                                            <textarea name="editor" id="editor" width="auto" ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    `
});

function createEditor(language, highlighting) {
    var starter = supportedLangs[language];
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

var editor = new createEditor(app.language, "xq-light");
