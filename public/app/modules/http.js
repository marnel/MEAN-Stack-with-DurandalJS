/**
 * Created by marnel on 12/10/13.
 */
// Extend the durandal http plugin to include put and delete methods.
define(['plugins/http', 'jquery', 'knockout'], function(httpPlugin, $, ko){
    var http = {
        put: function(url, data) {
            return $.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json'
            });
        },
        del: function(url, data) {
            return $.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        }
    };
    $.extend(http, httpPlugin);
    return http;

});
