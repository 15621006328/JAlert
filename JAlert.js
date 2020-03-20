function g(id) { return document.getElementById(id) };

function autoCenter(el, topv, iscenter) {
    if (el == undefined) return;
    //获取可见窗口大小
    var bodyW = document.documentElement.clientWidth;
    var bodyH = document.documentElement.clientHeight;
    //获取对话框宽、高
    var elW = el.offsetWidth;
    var elH = el.offsetHeight;

    if (iscenter) {
        el.style.left = (bodyW - elW) / 2 + 'px';
    }
    if (topv != undefined && topv != "") {
        el.style.top = topv;
    } else {
        el.style.top = (bodyH - elH) / 2 + 'px';
    }
};
// var isDraging = false;
//=================================================
function g(id) { return document.getElementById(id) };
window.JAlertOptions = {
    options: function(options) {
        var json = $.extend({
            title: "填写内容",
            Jmask_id: "Jmask",
            move_jdialog_id: "Jdialog",
            Closeid: "closeid",
            move_part_id: "move_part",
            multiple: false,
            callback: function() {}
        }, options || {

        });

        return json;
    },
    //根绝ID获取对象
    g: function(id) {
        return document.getElementById(id)
    },
    //打开弹窗
    openTk: function(options) {
        var obj = new JAlertOptions.options(options);

        window.JAlertOptions.CreateTk(obj)
        if (obj.top != undefined && obj.top != "") {
            autoCenter(g(obj.move_jdialog_id), obj.top, obj.iscenter);
        } else {
            autoCenter(g(obj.move_jdialog_id), "", obj.iscenter);
        }
        JAlertOptions.Move_Part_Mousedown(obj.move_jdialog_id, obj.move_part_id);
        JAlertOptions.Move_Part_Mouseup(obj.move_part_id);
        JAlertOptions.Set_Area(obj.move_jdialog_id);
        obj.callback()
    },
    isDraging: false,
    //关闭弹窗
    BdClose: function() {
        $(".Jdialog_close").click(function() {
            $("#" + $(this).attr("data-close-id")).remove();
        })
    },
    CloseTk: function(obj) {
        $("#" + obj.Closeid).remove();
    },
    CloseTkAll: function() {
        $(".JAertAllClose").remove()
    },
    //创建弹框html
    CreateTk: function(obj) {
        var html = "<div class='JAertAllClose' id='" + obj.Closeid + "'>" +
            (obj.Jmask_id == null ? "" : "<div id=\"" + obj.Jmask_id + "\" class=\"Jmask\"></div>") +
            "<div class=\"Jdialog\" style=\"width:" + obj.Jdialog_width + "\" id=\"" + obj.move_jdialog_id + "\">" +
            "<div class=\"Jdialog_head\" style=\"" + obj.titleStyle + "\" id=\"" + obj.move_part_id + "\">" + obj.title + "</div>" +
            "<button type=\"button\" data-close-id='" + obj.Closeid + "' class=\"close Jdialog_close\"></button>" +
            "<div class=\"Jdialog_content\"  style=\"" + obj.Jdialog_content + "\">" +
            obj.HtmlContent +
            "</div>" +
            "</div>" +
            "</div>"
        if (obj.multiple) {
            $('body').append(html)
        } else {
            if ($("#" + obj.Closeid)) { $("#" + obj.Closeid).remove() }
            $('body').append(html)
        }
        JAlertOptions.BdClose()
    },
    //鼠标按下
    Move_Part_Mousedown: function(id, startid) {
        //声明需要用到的变量
        var mx = 0,
            my = 0; //鼠标x、y轴坐标（相对于left，top）
        var dx = 0,
            dy = 0; //对话框坐标（同上）
        var newid = "";
        //不可拖动
        JAlertOptions.g(startid).addEventListener('mousedown', function(e) {
            var e = e || window.event;
            mx = e.pageX; //点击时鼠标X坐标
            my = e.pageY; //点击时鼠标Y坐标

            newid = $(this).parent().attr("id")
            dx = JAlertOptions.g($(this).parent().attr("id")).offsetLeft;
            dy = JAlertOptions.g($(this).parent().attr("id")).offsetTop;
            JAlertOptions.isDraging = true; //标记对话框可拖动


            document.onmousemove = function(e) {
                if (JAlertOptions.isDraging) {
                    console.log(newid)
                    var e = e || window.event;
                    var x = e.pageX; //移动时鼠标X坐标
                    var y = e.pageY; //移动时鼠标Y坐标
                    //判断对话框能否拖动
                    var moveX = dx + x - mx; //移动后对话框新的left值
                    var moveY = dy + y - my; //移动后对话框新的top值
                    JAlertOptions.g(newid).style.left = moveX + 'px'; //重新设置对话框的left
                    JAlertOptions.g(newid).style.top = moveY + 'px'; //重新设置对话框的top

                }
            }
        });
    },
    //鼠标离开
    Move_Part_Mouseup: function(id) {
        JAlertOptions.g(id).addEventListener('mouseup', function() {
            JAlertOptions.isDraging = false;
            document.onmousemove = null;
        })
    },
    //设置拖动范围
    Set_Area: function(id) {
        var pageW = document.documentElement.clientWidth;
        var pageH = document.documentElement.clientHeight;
        var JdialogW = JAlertOptions.g(id).offsetWidth;
        var JdialogH = JAlertOptions.g(id).offsetHeight;
        var maxX = pageW - JdialogW; //X轴可拖动最大值
        var maxY = pageH - JdialogH; //Y轴可拖动最大值
        var moveX = Math.min(Math.max(0, moveX), maxX); //X轴可拖动范围
        var moveY = Math.min(Math.max(0, moveY), maxY); //Y轴可拖动范围

    },
    callback: function() {

    }
}


function JAlert() {}
JAlert.Alert = function(options) {
    new JAlertOptions.openTk(options)
        //禁止选中对话框内容
    if (document.attachEvent) { //ie的事件监听，拖拽div时禁止选中内容，firefox与chrome已在css中设置过-moz-user-select: none; -webkit-user-select: none;
        g(JAlertOptions.options.move_jdialog_id).attachEvent('onselectstart', function() {
            return false;
        });
    }
    //事件会在窗口或框架被调整大小时发生
    window.onresize = function() {
        autoCenter(g(JAlertOptions.options.move_jdialog_id));
    }

}