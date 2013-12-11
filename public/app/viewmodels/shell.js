define(['plugins/router', 'durandal/app', 'Global', 'bootstrap'], function (router, app, global, bootstrap) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        global: global,
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'users', title: 'Users', moduleId: 'viewmodels/users/users', nav: false },
                { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true },
                { route: 'articles*details', moduleId: 'viewmodels/articles', title: 'Articles', nav: true, hash: '#articles'}
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});