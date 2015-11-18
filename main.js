// Initialize your app
var myApp = new Framework7({
    init: false,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


myApp.onPageInit('index', function(page) {
    do_list();
    $$('.item-link').on('click', function () {
        var date = $$(this).data('link');
        mainView.router.load({
            'url': "note.html",
            'query': {
                'date': date
            }
        });
    });
});
// add callback
myApp.onPageInit('add', function (page) {
    if(page.query.date){
        var title   = page.query.title,
            content = page.query.content,
            check   = page.query.check,
            date_short = page.query.date_short,
            date    = page.query.date;
        if(check) document.getElementById('note-check').setAttribute('checked', 'checked');
        document.getElementById('note-title').value = title;
        document.getElementById('note-content').value = content;
        document.getElementById('note-top-title').innerText = 'Изменить';
    }
    $$('.icon-save').on('click', function(){
        var check = document.getElementById('note-check'),
            title = document.getElementById('note-title').value,
            content = document.getElementById('note-content').value;
        if(page.query.date) {
            var date = page.query.date,
                date_short = page.query.date_short;
        }
        if(!date){
            var date_now = new Date();
            var date = date_now.getFullDate();
            var date_short = date_now.getShortDate();
        }

        var error = '';
        if(title == '' && content == ''){
            error = 'Не заполнены поля Заголовок и Текст заметки';
        }
        else if(title == ''){
            error = 'Не заполнено поле Заголовок'
        }
        else if(content == ''){
            error = 'Не заполнено поле Текст заметки'
        }
        if(!error){
            check = (check.checked) ? true : false;
            var obj = {
                date: date,
                date_short: date_short,
                title: title,
                content: content,
                check: check
            };
            storage.setItem("mylist|" + (date), JSON.stringify(obj));
            mainView.router.loadPage('index.html');
        }
        else{
            createErrorModal(error);
        }

        return;
    })

});
// note callback
myApp.onPageInit('note', function (page) {
    if(page.query.date){
        var key = "mylist|" + page.query.date;
        var obj = JSON.parse(localStorage.getItem(key));
        var date    = obj.date,
            date_short = obj.date_short,
            title   = obj.title,
            content = obj.content,
            check   = obj.check;
        var content_bl =
            '<div class="content-block-title">' + title + '</div>' +
            '<div class="content-block-date">' + date + '</div>' +
            '<div class="content-block-inner">' + content + '</div>' +
            '<div class="row">' +
            '<div class="col-25"></div>' +
            '<div class="col-50"><a href="#" class="button" ontouchend="do_delete(\'' + key + '\')">Удалить</a></div>' +
            '<div class="col-25"></div>' +
            '</div>';
        document.getElementById('content-note').innerHTML = content_bl;
        $$('.icon-edit').on('click', function(){
            mainView.router.load({
                'url': "add.html",
                'query': {
                    'date': date,
                    'date_short': date_short,
                    'title': title,
                    'content': content,
                    'check': check
                }
            });
        });
    }
});

// modal error
function createErrorModal(txt) {
    myApp.modal({
        title:  'Ошибка!',
        text: txt,
        buttons: [
            {
                text: 'Ок'
            }
        ]
    })
}

var storage = window['localStorage'];

// delete
function do_delete(key){
    event.preventDefault();
    myApp.modal({
        title:  '',
        text: 'Вы уверены?',
        buttons: [
            {
                text: 'Да',
                onClick: function() {
                    localStorage.removeItem(key);
                    mainView.router.loadPage('index.html');
                }
            },
            {
                text: 'Отмена',
            }
        ]
    })
}

// display
function do_list(){
        var key = "",
            text = "",
            st_length = storage.length;
        if(st_length){
                text = '<ul>';
                for (var i = 0; i < st_length; i++){
                        key = storage.key(i);
                        var obj = JSON.parse(localStorage.getItem(key));
                        var title = obj.title,
                            date = obj.date_short,
                            check = obj.check,
                            class_ch = '';
                        if(check){
                                class_ch  = 'checked';
                        }
                        if (key.indexOf('mylist') !== -1){
                                text +=
                                    '<li>' +
                                    '<a href="#" class="item-link" data-link="' + obj.date + '">' +
                                    '<div class="item-content">' +
                                    '<div class="item-inner ' + class_ch + '">' +
                                    '<div class="item-title">' + title + '<br>' +
                                    '<span class="item-date">' + date + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</li>';
                        }
                }
                text += '</ul>';
                document.getElementById('list').innerHTML = text;
        }

}
function leadingZero(number, amount) {
        amount = amount || 2;
        if (number.toString().length < amount) {
                return '0'.repeat(amount - number.toString().length) + number;
        }
        return number;
}
Date.prototype.getFullDate = function () {
    return  leadingZero(this.getDate()) + '.' +
        leadingZero(this.getMonth() + 1) + '.' +
        this.getFullYear() + ' ' +
        leadingZero(this.getHours()) + ':' +
        leadingZero(this.getMinutes()) + ':' +
        leadingZero(this.getSeconds())
};
Date.prototype.getShortDate = function () {
    return  leadingZero(this.getDate()) + '.' +
        leadingZero(this.getMonth() + 1) + '.' +
        this.getFullYear() + ' ' +
        leadingZero(this.getHours()) + ':' +
        leadingZero(this.getMinutes())
};
myApp.init();