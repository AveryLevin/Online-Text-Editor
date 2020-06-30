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

var mirrorApp = new Vue(
    {
        delimiters: ['[[', ']]'],
        el: '#vueinst',
        data: {
            allLangs: supportedLangs,
            language: "python",
            theme: "dracula",
        },
        methods: {
            updateLanguage: function (language) {
                this.language = language;
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
            }
        },
        template: `
        <div class="container bg-dark rounded">
            <div class="nav bg-dark">
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-secondary active" @click="updateLanguage('python')">
                        <input type="radio" name="options" id="option1" checked> Python
                    </label>
                    <label class="btn btn-secondary " @click="updateLanguage('javascript')">
                        <input type="radio" name="options" id="option2" > Javascript
                    </label>
                    <label class="btn btn-secondary" @click="updateLanguage('xml')">
                        <input type="radio" name="options" id="option3"> HTML
                    </label>
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
            });
}

var editor = new createEditor("python", "dracula");

editor.setSize("500", "400");
