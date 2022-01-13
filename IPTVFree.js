(function () {
    'use strict';
    
    var catalogs = [{"name":"=== \u041e\u0431\u043d\u043e\u0432\u043b\u0451\u043d: 11.01.2022 === smarttvnews.ru ===","video":"https:\/\/smarttvnews.ru\/wp-content\/uploads\/2018\/11\/BT-2016-logo_color7890.png","group":"All"}];
var groups = [{"title":"All"}];
     function iptvr(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true,
        step: 250
      });
      var items = [];
      var html = $('<div></div>');
      var body = $('<div class="category-full"></div>');
      var info;
      var last;
      var waitload;
      this.create = function () {
        var _this = this;
        this.activity.loader(true);
        var category = catalogs.filter(function (ch) {
            return ch.group == object.url;
        });
        if(category.length){
            info = Lampa.Template.get('info');
            info.find('.info__rate,.info__right').remove();
            scroll.render().addClass('layer--wheight').data('mheight', info);
            html.append(info);
            html.append(scroll.render());
            this.append(category);
            scroll.append(body);
            this.activity.loader(false);
            this.activity.toggle();
        }
        else {
          var empty = new Lampa.Empty();
          html.append(empty.render());
          _this.start = empty.start;
          _this.activity.loader(false);
          _this.activity.toggle();
        }
        return this.render();
      };
      this.append = function (data) {
        var _this3 = this;
        data.forEach(function (element) {
          var card = Lampa.Template.get('card', {
            title: element.name,
            release_year: element.group + (element.epg ? ' / ' + element.epg : '')
          });
          card.addClass('card--collection');
          card.find('.card__img').attr('src', element.picture);
          card.on('hover:focus', function () {
            last = card[0];
            scroll.update(card, true);
            info.find('.info__title').text(element.name);
            info.find('.info__title-original').text(element.group + (element.epg ? ' / ' + element.epg : ''));
          });
          card.on('hover:enter', function () {
            var video = {
              title: element.name,
              url: element.video
            };
            Lampa.Player.play(video);
            var playlist = [];
            items.forEach(function (elem) {
              playlist.push({
                title: elem.name,
                url: elem.video
              });
            });
            Lampa.Player.playlist(playlist);
          });
          body.append(card);
          items.push(card);
        });
      };
      this.start = function () {
        Lampa.Controller.add('content', {
          toggle: function toggle() {
            Lampa.Controller.collectionSet(scroll.render());
            Lampa.Controller.collectionFocus(last || false, scroll.render());
          },
          left: function left() {
            if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
          },
          right: function right() {
            Navigator.move('right');
          },
          up: function up() {
            if (Navigator.canmove('up')) Navigator.move('up');else Lampa.Controller.toggle('head');
          },
          down: function down() {
            if (Navigator.canmove('down')) Navigator.move('down');
          },
          back: function back() {
            Lampa.Activity.backward();
          }
        });
        Lampa.Controller.toggle('content');
      };
      this.pause = function () {};
      this.stop = function () {};
      this.render = function () {
        return html;
      };
      this.destroy = function () {
        network.clear();
        scroll.destroy();
        if (info) info.remove();
        html.remove();
        body.remove();
        network = null;
        items = null;
        html = null;
        body = null;
        info = null;
      };
    }

    function startPlugin() {
      window.plugin_iptvr_ready = true;
      Lampa.Component.add('iptvr', iptvr);
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {var ico = '<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" color="#fff" fill="currentColor" class="bi bi-tv"><path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/></svg>';
          var menu_item = $('<li class="menu__item selector focus" data-action="iptvr_316030216282790916"><div class="menu__ico">' + ico + '</div><div class="menu__text">ТВ</div></li>');
          menu_item.on('hover:enter', function () {
            Lampa.Select.show({
              title: 'Категории',
              items: groups,
              onSelect: function onSelect(a) {
                Lampa.Activity.push({
                  url: a.title,
                  title: a.title,
                  component: 'iptvr',
                  page: 1
                });
              },
              onBack: function onBack() {
                Lampa.Controller.toggle('menu');
              }
            });
          });
          $('.menu .menu__list').eq(0).append(menu_item);
        }
      });
    }

    if (!window.plugin_iptvr_ready) startPlugin();

})();
