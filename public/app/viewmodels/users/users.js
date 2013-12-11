define(['plugins/http', 'durandal/app', 'knockout', 'plugins/router'], function (http, app, ko, router) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    return {
        displayName: 'Sign-In',
        activeDisplay: ko.observable('users/signin.html'),
        activate: function (qs) {
            //the router's activator calls this function and waits for it to complete before proceding
            var that = this;
            if (qs && qs.action === 'signout'){
                http.get('/signout', {  }).then(function(response){
                   // that.activeDisplay('users/signin.html');
                    window.location.assign('/');
                });
            }
            else if (qs && qs.action === 'signin'){
                that.activeDisplay('users/signin.html');
            }
            else if (qs && qs.action === 'signup'){
                that.activeDisplay('users/signup.html');
            }
            else if (qs && qs.action === 'unauthorized'){
                that.activeDisplay('users/unauthorized.html');
            }
           return;
        }
    };
});