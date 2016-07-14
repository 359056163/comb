/***
 * options : {
 *      [parameter name]:Array|String(split by ";") each item must be one of following.
 * }
 * required
 * optional
 * isNumber
 * /REGEXP/
 * isInt
 * isFloat(precision)
 */

"use strict";
const qs = require("querystring");
let Matcher = {
    /**
     * 构造一个参数验证的中间件
     * @param options {Object} 请求参数匹配设置。
     * @param fail {String} 不匹配的消息返回方式,可以选择 以JSON ，重定向，或者服务端 的页面渲染
     * @param separator {String} 每条 参数匹配设置 的分隔符
     * @returns {Function}
     */
    newMatcher: function (options, fail, separator) {
        separator = separator || ";";
        if (isEmpty(options)) {
            return function (req, res, next) {
                return next();
            }
        }
        let m = new Object();
        for (let attr in options) {
            (function (key, items) {
                if (typeof items === 'string') {
                    items = items.split(separator);
                }
                if (Array.isArray(items) && verifyPatterns(items)) {
                    let optionalIndex = items.indexOf("optional");
                    let requiredIndex = items.indexOf("required");
                    if(optionalIndex>=0&&requiredIndex>=0){
                        throw new Error("the two items: \"required\" and \"optional\" are mutex !");
                    }
                    if(items.indexOf("optional")>0||items.indexOf("required")>0){
                        throw new Error("the two items: \"required\" or \"optional\"  must be first one,if you need them.");
                    }
                    m[key] = function (value) {
                        if (items[0] == "optional") {
                            if (value == null || value == "")
                                return [OK];
                            else
                                items.shift();
                        }
                        return items.map((item)=> {
                            if (item.startsWith("REGEXP:")) {
                                return matcherCollection.REGEXP(item.split(":")[1], value);
                            } else {
                                return matcherCollection[item](value);
                            }
                        });
                    };

                } else {
                    throw new TypeError("object: options is not correct,each value of attributes must be an array or a string with seperator \",\"");
                }
            })(attr, options[attr]);
        }

        return function (req, res, next) {
            let result = {};
            let isOk = true;
            for (let key in m) {
                result[key] = m[key](getParam(req, key)).filter(function (e) {
                    let flag = (e != OK);
                    if (flag) {
                        isOk = false;
                    }
                    return flag
                });
            }


            if (isOk) {
                return next();
            }
            if (!fail || fail.toLowerCase() == "json") {
                res.json(result);
            } else if (/^render\:.+$/.test(fail.toLowerCase())) {
                res.render(fail.split(":")[1], {
                    result: result
                });
            } else if (/^redirect\:.+$/.test(fail)) {
                let url = fail.split(":")[1];
                let str = qs.stringify(result);
                if (url.lastIndexOf("?") < 0) {
                    str = "?" + str;
                } else {
                    str = "&" + str;
                }
                res.redirect(url + str);
            }
        }
    },

    /**
     * 向集合中新增一个匹配函数
     * @param name {String}
     * @param matcher {function}
     * @returns {boolean}
     */
    setMatcher: function (name, matcher) {
        if (typeof name == "String" && typeof matcher == 'function') {
            matcherCollection[name] = matcher;
            return true;
        } else {
            return false;
        }
    }
}

/**
 * 用于验证的函数的 集合
 */
let matcherCollection = {
    required: function (target) {
        let flag = (target !== null && target !== undefined && target !== '');
        if (flag) {
            return OK;
        }
        return "值不能为空";
    },
    isNumber: function (target) {
        let flag = !Number.isNaN(target);
        if (flag) {
            return OK;
        }
        return "值必须是数字";
    },
    isInt: function (target) {
        let flag = /^[1-9]\d?$/.test(target.toString());
        if (flag) {
            return OK;
        }
        return "值必须是整型数字";
    },
    isURL: function (target) {
        let flag = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(target);
        if (flag) {
            return OK;
        }
        return "值必须是一个URL字符串"
    },
    isEmail: function (target) {
        let flag = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(target);
        if (flag) {
            return OK;
        }
        return "值必须是一个URL字符串"
    },
    REGEXP: function (reg, target) {
        try {
            let flag = new RegExp(reg).test(target);
            if (flag) {
                return OK;
            }
        } catch (e) {
            throw e.stack;
        }
        return "字符串与正则表达式不匹配";
    }
}

module.exports = Matcher;


function verifyPatterns(arr) {
    let flag = true;
    for (let v of arr) {
        if (typeof v !== 'string' || !matcherCollection[v]) {
            flag = false;
        }
    }
    return flag;
}


function getParam(req, name) {
    return req.body[name] || req.query[name]
}
function isEmpty(obj) {
    for (let attr in obj) {
        return false;
    }
    return true;
}

const OK = "ok";


