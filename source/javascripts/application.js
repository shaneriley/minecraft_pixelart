$(function() {
  var block_size = 48,
      $c = $("canvas"),
      img = document.createElement("img"),
      ctx = $c[0].getContext("2d"),
      color = 0,
      rows = ctx.canvas.width / block_size,
      cols = ctx.canvas.height / block_size,
      matrix = [];

  img.onload = run;
  img.src = "/images/wool.png";

  for (var r = 0; r < rows; r++) {
    matrix.push([]);
    for (var c = 0; c < cols; c++) {
      matrix[r].push(-1);
    }
  }

  var canvas_actions = {
    press: function(e) {
      $c.on("mousemove.fill", canvas_actions.fill);
    },
    fill: function(e) {
      var offset = getCursorOffset(e),
          b = block_size,
          r = offset.left * b,
          c = offset.top * b;
      ctx.drawImage(img, color * b, 0, b, b, r, c, b, b);
      matrix[offset.top][offset.left] = color;
    },
    unbindFill: function() {
      $c.off("mousemove.fill");
    },
    release: function(e) {
      canvas_actions.fill(e);
      canvas_actions.unbindFill();
    }
  };

  function run() {
    $("#wool").on("click", "a", function(e) {
      e.preventDefault();
      var $li = $(e.target).closest("li").addClass("active");
      $li.closest("ul").find("li").not($li).removeClass("active");
      color = $li.index();
    });

    $("form").on("submit", function(e) {
      e.preventDefault();
      var $f = $(this),
          json = {
            name: $f.find("#name").val(),
            data: matrix
          };
      if (!json.name) {
        $f.find(".error").show();
        return;
      }
      $f.find(".error").hide();
      console.dir(json);
    });

    $c.on({
      mousedown: canvas_actions.press,
      mouseup: canvas_actions.release,
      mouseleave: canvas_actions.unbindFill
    });
  }

  function getCursorOffset(e) {
    var offset = {
      left: ~~((e.clientX - $c.offset().left) / block_size),
      top: ~~((e.clientY - $c.offset().top) / block_size)
    };
    return offset;
  }
});
