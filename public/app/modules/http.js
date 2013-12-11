/**
 * Created by marnel on 12/10/13.
 */
define(['plugins/http', 'jquery', 'knockout'], function(http, $, ko){
    var _this = this;

    var _http = {
        put: function(url, data) {
            return $.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json'
            });
        },
        delete: function(url, data) {
            return $.ajax({
                url: url,
                data: ko.toJSON(data),
                type: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        }
    };
    $.extend(_http, http);
    //debugger;
    return _http;

});
