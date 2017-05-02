(function() {

  window.Fixer = {
    fix: function(el) {
      var rect = el.getBoundingClientRect();
      el.style.top = rect.top + document.body.scrollTop + 'px';
      el.style.left = rect.left + document.body.scrollLeft + 'px';
      el.style.position = 'fixed';
    },

    unfix: function(el) {
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
    }
  };

})();
