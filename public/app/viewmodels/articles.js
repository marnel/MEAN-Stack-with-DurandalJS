/**
 * Created by marnel on 12/7/13.
 */
define(['durandal/app', 'knockout', 'plugins/router', 'Global', '../modules/http'],
        function (app, ko, router, global, http) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    function findArticleById(articles, id){
        var match = ko.utils.arrayFirst(articles(), function(item) {
            return id === item._id;
        });
        return match;
    }

    function formatDate(date){
        var d = new Date(date);
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        return curr_date + "." + curr_month + "." + curr_year;
    }

    return {
        self: this,
        global: global,
        displayName: 'Articles',
        activeDisplay: ko.observable('articles/list.html'),
        articleID: ko.observable(),
        articles: ko.observableArray(),
        newArticleTitle: ko.observable(),
        newArticleContent: ko.observable(),
        currentArticle: ko.observable(),
        canActivate: function(){
            if (!global.authenticated){
               return {redirect:'/users?action=unauthorized'};
                return;
            }
            return true;
        },
        activate: function (view, id) {
            //debugger;
            //the router's activator calls this function and waits for it to complete before proceeding
            this.articleID(id);
            var that = this;
            return http.get('/api/articles').then(function(response) {
                that.articles(response);
                switch (view) {
                    case '/edit':
                        that.currentArticle(findArticleById(that.articles, that.articleID().id));
                        that.activeDisplay('articles/edit.html');
                        break;
                    case '/view':
                        that.currentArticle(findArticleById(that.articles, that.articleID().id));
                        that.activeDisplay('articles/view.html');
                        break;
                    case '/create':
                        that.activeDisplay('articles/create.html');
                        break;
                    default:
                        that.activeDisplay('articles/list.html');

                };
            });
        },
        deactivate: function(){
            this.activeDisplay('articles/list.html');
        },
        create: function(){
            var that = this;
            http.post('/api/articles', { title: this.newArticleTitle, content: this.newArticleContent }).then(function(response){
                that.articles.push(response);
                that.activeDisplay('articles/list.html');
                router.navigate('articles');
            });
        },
        createArticle: function(){
            this.activeDisplay('articles/create.html');
            router.navigate('articles');
        },
        update: function(){
            var that = this;
            http.put('/api/articles/' + that.currentArticle()._id, { title: that.currentArticle().title, content: that.currentArticle().content}).
                then(function(res){
                    debugger;
                    app.showMessage('Article Updated!', 'Update');
                    that.activeDisplay('articles/view.html');
                    router.navigate('articles');
                }, function (xhr, status, msg){ app.showMessage(msg); });
        },
        remove: function(){
            var that = this;
            that.activeDisplay('articles/list.html');
            http.delete('/api/articles/' + that.currentArticle()._id, {}).
                then(function(data){
                    that.currentArticle({});
                    app.showMessage('Article Deleted!', 'Delete');
                    router.navigate('articles');
                }, function (xhr, status, msg){ app.showMessage(msg); });
        },
        formatDate: formatDate
    };
});
