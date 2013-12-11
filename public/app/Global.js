/**
 * Created by marnel on 12/6/13.
 */

define('Global',[],function(){
    var _this = this;
    _this._data = {
        user: window.user,
        authenticated: !! window.user
    };

    return _this._data;
});
