Vue.config.devtools = true;

/**
 * check out Brython for running python code
 * https://brython.info/
 */
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

var allLanguages = [
    {
        name: "python",
        dispName: "Python",
        active: true
    },
    {
        name: "javascript",
        dispName: "Javascript",
        active: false
    },
    {
        name: "xml",
        dispName: "HTML",
        active: false
    }
]

Vue.component('language-button',
    {
        delimiters: ['[[', ']]'],
        data: function () {
            return null;
        },
        props: {
            language: Object
        },
        methods: {
            updateLang: function () {
                if (!this.language.active) {
                    this.$emit('new-language', this.language)
                }
            }
        },
        template: `
        <label v-if="this.language.active" class="btn btn-secondary active" @click="this.updateLang">
            <input type="radio" name="options" id="option1" checked> [[this.language.dispName]]
        </label>
        <label v-else class="btn btn-secondary" @click="this.updateLang">
            <input type="radio" name="options" id="option1"> [[this.language.dispName]]
        </label>
    `
    }
)

var mirrorApp = new Vue(
    {
        delimiters: ['[[', ']]'],
        el: '#vueinst',
        data: {
            allLangs: supportedLangs,
            language: "python",
            theme: "darcula",
        },
        methods: {
            updateLanguage: function (language) {
                this.language = language.name;
                allLanguages.forEach(element => {
                    element.active = false;
                });
                language.active = true;
                this.updateEditor();
            },
            updateTheme: function (theme) {
                this.theme = theme;
                this.updateEditor();
            },
            updateEditor: function () {
                editor.toTextArea();
                document.getElementById('editor').value = "";
                editor = new createEditor(this.language, this.theme);
            },
            getVersion() {
                if (editor != null)
                    return editor.version;
                else
                    return null;
            }
        },
        template: `
        <div class="container fill-height bg-dark rounded">
            <div class="nav bg-dark">
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <language-button 
                    v-for="lang in allLanguages"
                    v-bind:language="lang"
                    v-on:new-language="updateLanguage">
                    </language-button>
                </div>
            </div>
            <textarea name="editor" id="editor" width="auto" ></textarea>
        </div>
        `,
    }
);


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

var editor = new createEditor("python", "darcula");

editor.setSize("500", "400");
