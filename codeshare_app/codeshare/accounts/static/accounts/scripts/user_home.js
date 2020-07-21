Vue.config.devtools = true;

Vue.component('project-item', {
    delimiters: ['[[', ']]'],
    data: function() {
        return {
            classType: "article-item-light"
        }
    },
    props: {
        articleTitle: String,
        articleSource: String,
        articleRedirLink: String
    },
    template: `
    <div :class="classType" 
        @mouseover="makeItemDark"
        @mouseleave="makeItemLight">
            <a :href="articleRedirLink">
                <article class="article_block">
                    [[  articleTitle  ]] -- [[ articleSource ]]
                </article>
            </a>
        </div>
    `,
    computed: {

    },
    methods: {
        makeItemDark: function() {
            this.classType = "article-item-dark";
        },
        makeItemLight: function() {
            this.classType = "article-item-light";
        }
    }
});

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data: function () {
        return {
            userHomeData: userHomeData
        }
    },
    computed: {
        articles: function () {
            return this.userHomeData.articleListData;
        }
    },
});