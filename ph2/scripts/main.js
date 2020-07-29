"use strict";
!(function(t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery);
})(function(t) {
  function e(t) {
    if (t instanceof Date) return t;
    if (String(t).match(a))
      return (
        String(t).match(/^[0-9]*$/) && (t = Number(t)),
        String(t).match(/\-/) && (t = String(t).replace(/\-/g, "/")),
        new Date(t)
      );
    throw new Error("Couldn't cast `" + t + "` to a date object.");
  }
  function i(t) {
    var e = t.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    return new RegExp(e);
  }
  function s(t) {
    return function(e) {
      var s = e.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
      if (s)
        for (var o = 0, a = s.length; o < a; ++o) {
          var l = s[o].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
            h = i(l[0]),
            c = l[1] || "",
            u = l[3] || "",
            f = null;
          (l = l[2]),
            r.hasOwnProperty(l) && ((f = r[l]), (f = Number(t[f]))),
            null !== f &&
              ("!" === c && (f = n(u, f)),
              "" === c && f < 10 && (f = "0" + f.toString()),
              (e = e.replace(h, f.toString())));
        }
      return (e = e.replace(/%%/, "%"));
    };
  }
  function n(t, e) {
    var i = "s",
      s = "";
    return (
      t &&
        ((t = t.replace(/(:|;|\s)/gi, "").split(/\,/)),
        1 === t.length ? (i = t[0]) : ((s = t[0]), (i = t[1]))),
      Math.abs(e) > 1 ? i : s
    );
  }
  var o = [],
    a = [],
    l = { precision: 100, elapse: !1, defer: !1 };
  a.push(/^[0-9]*$/.source),
    a.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),
    a.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),
    (a = new RegExp(a.join("|")));
  var r = {
      Y: "years",
      m: "months",
      n: "daysToMonth",
      d: "daysToWeek",
      w: "weeks",
      W: "weeksToMonth",
      H: "hours",
      M: "minutes",
      S: "seconds",
      D: "totalDays",
      I: "totalHours",
      N: "totalMinutes",
      T: "totalSeconds"
    },
    h = function(e, i, s) {
      (this.el = e),
        (this.$el = t(e)),
        (this.interval = null),
        (this.offset = {}),
        (this.options = t.extend({}, l)),
        (this.instanceNumber = o.length),
        o.push(this),
        this.$el.data("countdown-instance", this.instanceNumber),
        s &&
          ("function" == typeof s
            ? (this.$el.on("update.countdown", s),
              this.$el.on("stoped.countdown", s),
              this.$el.on("finish.countdown", s))
            : (this.options = t.extend({}, l, s))),
        this.setFinalDate(i),
        !1 === this.options.defer && this.start();
    };
  t.extend(h.prototype, {
    start: function() {
      null !== this.interval && clearInterval(this.interval);
      var t = this;
      this.update(),
        (this.interval = setInterval(function() {
          t.update.call(t);
        }, this.options.precision));
    },
    stop: function() {
      clearInterval(this.interval),
        (this.interval = null),
        this.dispatchEvent("stoped");
    },
    toggle: function() {
      this.interval ? this.stop() : this.start();
    },
    pause: function() {
      this.stop();
    },
    resume: function() {
      this.start();
    },
    remove: function() {
      this.stop.call(this),
        (o[this.instanceNumber] = null),
        delete this.$el.data().countdownInstance;
    },
    setFinalDate: function(t) {
      this.finalDate = e(t);
    },
    update: function() {
      if (0 === this.$el.closest("html").length) return void this.remove();
      var e,
        i = void 0 !== t._data(this.el, "events"),
        s = new Date();
      (e = this.finalDate.getTime() - s.getTime()),
        (e = Math.ceil(e / 1e3)),
        (e = !this.options.elapse && e < 0 ? 0 : Math.abs(e)),
        this.totalSecsLeft !== e &&
          i &&
          ((this.totalSecsLeft = e),
          (this.elapsed = s >= this.finalDate),
          (this.offset = {
            seconds: this.totalSecsLeft % 60,
            minutes: Math.floor(this.totalSecsLeft / 60) % 60,
            hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
            days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
            daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
            daysToMonth: Math.floor(
              (this.totalSecsLeft / 60 / 60 / 24) % 30.4368
            ),
            weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
            weeksToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7) % 4,
            months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
            years: Math.abs(this.finalDate.getFullYear() - s.getFullYear()),
            totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
            totalHours: Math.floor(this.totalSecsLeft / 60 / 60),
            totalMinutes: Math.floor(this.totalSecsLeft / 60),
            totalSeconds: this.totalSecsLeft
          }),
          this.options.elapse || 0 !== this.totalSecsLeft
            ? this.dispatchEvent("update")
            : (this.stop(), this.dispatchEvent("finish")));
    },
    dispatchEvent: function(e) {
      var i = t.Event(e + ".countdown");
      (i.finalDate = this.finalDate),
        (i.elapsed = this.elapsed),
        (i.offset = t.extend({}, this.offset)),
        (i.strftime = s(this.offset)),
        this.$el.trigger(i);
    }
  }),
    (t.fn.countdown = function() {
      var e = Array.prototype.slice.call(arguments, 0);
      return this.each(function() {
        var i = t(this).data("countdown-instance");
        if (void 0 !== i) {
          var s = o[i],
            n = e[0];
          h.prototype.hasOwnProperty(n)
            ? s[n].apply(s, e.slice(1))
            : null === String(n).match(/^[$A-Z_][0-9A-Z_$]*$/i)
            ? (s.setFinalDate.call(s, n), s.start())
            : t.error(
                "Method %s does not exist on jQuery.countdown".replace(
                  /\%s/gi,
                  n
                )
              );
        } else new h(this, e[0], e[1]);
      });
    });
});
var slickOpts = { arrows: !1, infinite: !0 };
$(".testimonials-list").slick(slickOpts),
  $(".slide-prev").on("click", function() {
    $(".testimonials-list").slick("slickPrev");
  }),
  $(".slide-next").on("click", function() {
    $(".testimonials-list").slick("slickNext");
  });
var timer = function(t) {
  var e = new Date(),
    i = new Date(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes() + 31,
      1
    );
  t.countdown(i, function(t) {
    var e = t.strftime("%H"),
      i = t.strftime("%M"),
      s = t.strftime("%S");
    $(".hour1").text(e[0]),
      $(".hour2").text(e[1]),
      $(".minute1").text(i[0]),
      $(".minute2").text(i[1]),
      $(".second1").text(s[0]),
      $(".second2").text(s[1]);
  });
};
timer($(".timer__wrap"));
var i, c, y, v, s, n;
for (
  v = document.getElementsByClassName("youtube"),
    v.length > 0 &&
      ((s = document.createElement("style")),
      (s.type = "text/css"),
      (s.innerHTML =
        '.youtube{background-color:#000;max-width:100%;height:inherit;overflow:hidden;position:relative;cursor:hand;cursor:pointer}.youtube .thumb{bottom:0;display:block;left:0;margin:auto;max-width:100%;position:absolute;right:0;top:0;width:100%;height:auto}.youtube .play{filter:alpha(opacity=80);opacity:.8;height:77px;left:50%;margin-left:-38px;margin-top:-38px;position:absolute;top:50%;width:77px;background:url("images/youtube-play-icon.png") no-repeat}'),
      document.body.appendChild(s)),
    n = 0;
  n < v.length;
  n++
)
  (y = v[n]),
    (i = document.createElement("img")),
    i.setAttribute("src", "https://i.ytimg.com/vi/" + y.id + "/hqdefault.jpg"),
    i.setAttribute("class", "thumb"),
    (c = document.createElement("div")),
    c.setAttribute("class", "play"),
    y.appendChild(i),
    y.appendChild(c),
    (y.onclick = function() {
      var t = document.createElement("iframe");
      t.setAttribute(
        "src",
        "https://www.youtube.com/embed/" +
          this.id +
          "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&rel=0&showinfo=0"
      ),
        t.setAttribute("allowfullscreen", ""),
        (t.style.width = this.style.width),
        (t.style.height = this.style.height),
        this.parentNode.replaceChild(t, this);
    });
    $(document).on("click", 'a[href^="#"]', function(i) {
        var t = $(this).attr("href"),
          e = $(t);
        if (0 !== e.length) {
          i.preventDefault();
          var r = e.offset().top;
          $("body, html").animate({ scrollTop: r });
        }
      });
