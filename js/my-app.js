// Initialize your app
var myApp = new Framework7({
        init: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


myApp.onPageInit('index', function(page) { console.log('123');
        do_list();
});

myApp.onPageInit('add', function (page) { console.log('555');
        // run createContentPage func after link was clicked
        $$('.save-note').on('click', function () {
                createContentPage();
        });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><div class="icon icon-back"></div></a></div>' +
        '    <div class="center sliding">Добавление</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Запись сохранена</p>' +
        '          <p>Перейти <a href="index.html" >на главную</a></p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
var storage = window['localStorage'];

// функция сохранения
function do_save(){
        event.preventDefault();
        var date = new Date(),
            check = document.getElementById('note-check'),
            title = document.getElementById('note-title').value,
            content = document.getElementById('note-content').value,
        check = (check.checked) ? true : false;
        date = date.getChatFullDate();
        var obj = {
           date: date,
           title: title,
           content: content,
           check: check
        };
        storage.setItem("mylist|" + (date), JSON.stringify(obj));
        mainView.router.loadPage('index.html');
        return;
}
// функция удаления
function do_delete(){
        event.preventDefault();

}
// функция вывода на экран
function do_list(){
        var key = "",
            text = "",
            st_length = storage.length;
        if(st_length){
                text = '<ul>';
                for (var i = 0; i < st_length; i++){
                        key = storage.key(i);
                        var obj = JSON.parse(localStorage.getItem(key)); console.log(obj);
                        var title = obj.title,
                            date = obj.date,
                            check = obj.check,
                            class_ch = '';
                        if(check){
                                class_ch  = 'checked';
                        }
                        if (key.indexOf('mylist') !== -1){
                                text +=
                                    '<li>' +
                                    '<a href="note.html" class="item-link">' +
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
Date.prototype.getChatFullDate = function () {
        return  leadingZero(this.getDate()) + '-' +
            leadingZero(this.getMonth() + 1) + '-' +
            this.getFullYear() + ' ' +
            leadingZero(this.getHours()) + ':' +
            leadingZero(this.getMinutes()) + ':' +
            leadingZero(this.getSeconds())
};
myApp.init();