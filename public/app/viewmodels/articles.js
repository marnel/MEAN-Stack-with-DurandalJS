/**
 * Created by marnel on 12/7/13.
 */
define(['durandal/app', 'knockout', 'jquery', 'plugins/router', 'Global', '../modules/http'],
    function( app, ko, $, router, global, http ) {

        var ctor = function() {
            this.displayName = 'Articles';
            this.activeDisplay = ko.observable('articles/list.html');
            this.articleID = ko.observable();
            this.articles = ko.observableArray();
            this.newArticleTitle = ko.observable();
            this.newArticleContent = ko.observable();
            this.currentArticle = ko.observable();
        };

        //Durandal lifecycle events
        var lifecycle = {
            canActivate: function() {
                if ( !global.authenticated ) {
                    return {redirect: '/users?action=unauthorized'};
                }
                return true;
            },
            activate: function( view, id ) {
                //debugger;
                //the router's activator calls this function and waits for it to complete before proceeding
                this.articleID(id);
                var that = this;
                return http.get('/api/articles').then(function( response ) {
                    that.articles(response);
                    switch ( view ) {
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

                    }
                });
            },
            deactivate: function() {
                this.activeDisplay('articles/list.html');
            }
        };

        //model specific methods
        var methods = {
            create: function create () {
                var that = this;
                http.post('/api/articles', { title: this.newArticleTitle, content: this.newArticleContent }).then(function( response ) {
                    that.articles.push(response);
                    that.activeDisplay('articles/list.html');
                    router.navigate('articles');
                });
            },
            createArticle: function createArticle () {
                this.activeDisplay('articles/create.html');
                router.navigate('articles');
            },
            update: function update () {
                var that = this;
                http.put('/api/articles/' + that.currentArticle()._id, { title: that.currentArticle().title, content: that.currentArticle().content}).
                    then(function( res ) {
                        app.showMessage('Article Updated!', 'Update');
                        that.activeDisplay('articles/view.html');
                        router.navigate('articles');
                    }, function( xhr, status, msg ) {
                        app.showMessage(msg);
                    });
            },
            remove: function remove () {
                var that = this;
                that.activeDisplay('articles/list.html');
                http.delete('/api/articles/' + that.currentArticle()._id, {}).
                    then(function( data ) {
                        that.currentArticle({});
                        app.showMessage('Article Deleted!', 'Delete');
                        router.navigate('articles');
                    }, function( xhr, status, msg ) {
                        app.showMessage(msg);
                    });
            }
        };

        var common = {
            global: global,
            formatDate: function formatDate ( date ) {
                var d = new Date(date);
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();
                return curr_date + "." + curr_month + "." + curr_year;
            }
        };

        // mixin lifecyle. common and methods to the prototype
        // later methods can overwrite earlier. That allows to store e.g. common in an external module and still overwrite
        // extend in e.g. crud
        $.extend(true, ctor.prototype, common, methods, lifecycle);

        return ctor;

        // Internal
        function findArticleById ( articles, id ) {
            var match = ko.utils.arrayFirst(articles(), function( item ) {
                return id === item._id;
            });
            return match;
        }
    });
