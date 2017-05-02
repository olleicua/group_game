(function() {

  window.GroupGame = {

    // Draw a gradient background with green increasing from bottom to top
    // and blue increasing from left to right
    drawBackground: function() {
      if (this.backgroundCanvas) return;

      var height = window.innerHeight - 20;
      var width = window.innerWidth;

      this.backgroundCanvas = document.createElement('canvas');
      this.backgroundCanvas.height = height;
      this.backgroundCanvas.width = width;
      var ctx = this.backgroundCanvas.getContext('2d');

      for (var i = height - 1; i >= 0; i--) {
        for (var j = 0; j < width; j++) {
          var color = 'rgb(0, ' +
              Math.floor((255 / (height - 1)) * i) + ', ' +
              Math.floor((255 / (width - 1)) * j) + ')';

          ctx.fillStyle = color;
          ctx.fillRect(j, height - i, 1, 1);
        }
      }

      document.body.append(this.backgroundCanvas);
    },

    newGame: function(options) {
      _.extend(this, options);

      this.permutors = [];
      this.container.style.height = window.innerHeight - 20;
      this.boxHeight = Math.floor(
        ((this.container.offsetHeight - 10) / options.rows) - 10
      );
      this.boxWidth = Math.floor(
        ((this.container.offsetWidth - 10) / options.columns) - 10
      );

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.buildBox(i, j);
          this.generatePermutation();
        }
      }
    },

    scramble: function(n) {
      for (var i = 0; i < n; i++) {
        this.permutors[Math.floor(Math.random() * this.rows * this.columns)]();
      }
    },

    buildBox: function(row, column) {
      var that = this;

      var space = (row * this.rows) + column;
      var postion = this.pixelPosition(row, column);
      var box = document.createElement('div');
      box.dataset.space = space;
      box.innerHTML = space.toString();
      box.column = column;
      box.classList.add('box');
      box.style.height = this.boxHeight + 'px';
      box.style.width = this.boxWidth + 'px';
      box.style.transform = 'translate(' +
        postion.x + 'px, ' +
        postion.y + 'px)';
      box.style.backgroundColor = this.color(row, column);
      box.addEventListener('click', function() {
        console.log(box.dataset.space);
        that.permutors[box.dataset.space]();
      });
      box.addEventListener('animationend', function() {
        box.style.zIndex = '';
        box.style.animationDuration = '';
        box.style.animationName = '';
      });
      this.container.append(box);
    },

    pixelPosition: function(row, column) {
      return {
        x: (column * (this.boxWidth + 10)),
        y: (row * (this.boxHeight + 10))
      }
    },

    color: function(row, column) {
      return 'rgb(0, ' +
        Math.floor((255 / (this.rows - 1)) * (this.rows - row - 1)) + ', ' +
        Math.floor((255 / (this.columns - 1)) * column) + ')';
    },

    generatePermutation: function() {
      var that = this;

      var spaces = [this.permutors.length];
      for (var i = 0; i < 4; i++) {
        var n = Math.floor(Math.random() * this.rows * this.columns);
        if (spaces.indexOf(n) === -1) {
          spaces.push(n);
        }
      }
      var permutation = _.shuffle(spaces);

      this.permutors.push(function() {
        var i, box, destination, newRow, newColumn, newPosition;
        var boxes = [];
        var positions = [];
        var keyFrames = '';

        console.log('spaces', spaces, 'permutation', permutation);

        for (i = 0; i < spaces.length; i++) {
          destination = permutation[i];
          
          newRow = Math.floor(destination / that.rows);
          newColumn = destination % that.rows;
          newPosition = that.pixelPosition(newRow, newColumn);
          positions.push(newPosition);

          box = that.container.querySelector(
            '.box[data-space="' + spaces[i] + '"]'
          );
          boxes.push(box);

          keyFrames += '@keyframes move-' + i +
            '{ from { transform: ' + box.style.transform +
            '; } to { transform: translate( ' + newPosition.x + 'px, ' +
            newPosition.y + 'px); } }';
          // placeholder = $(box).clone()[0];
          // placeholder.classList.remove('box');
          // placeholder.classList.add('box-clone');
          // that.container.insertBefore(placeholder, box);
          // Fixer.fix(box);
          // document.body.append(box);
          // placeholders.push(placeholder);
          // positions.push([box.style.left, box.style.top]);
        }

        document.querySelector('style.keyframes').innerHTML = keyFrames;

        for (i = 0; i < spaces.length; i++) {
          box = boxes[i];

          box.dataset.space = permutation[i];

          box.style.zIndex = 5 + i;
          box.style.animationDuration = '1s';
          box.style.animationName = 'move-' + i;
          box.style.transform = 'translate(' + positions[i].x + 'px, ' + positions[i].y + 'px)';
        }

        console.log(_.map(_.range(that.rows * that.columns), function(s) {
          return that.container.querySelector('.box[data-space="' + s + '"]').innerHTML;
        }))

        //  (function() {
        //    var destination = permutation[i];
        //    var box = boxes[i];
        //    var placeholder = placeholders[spaces.indexOf(destination)];
        //    var newPosition = positions[spaces.indexOf(destination)];
       //
        //    /*
        //    $(box).animate(
        //      {
        //        height: that.boxHeight / 2,
        //        width: that.boxWidth / 2
        //      },
        //      {
        //        duration: 400,
        //        complete: function() {
        //          $(box).animate(
        //            {
        //              height: that.boxHeight,
        //              width: that.boxWidth
        //            },
        //            { duration: 400 }
        //          );
        //        }
        //      }
        //    );
        //    */
       //
        //    $(box).animate(
        //      {
        //        left: newPosition[0],
        //        top: newPosition[1]
        //      },
        //      {
        //        duration: 800,
        //        complete: function() {
        //          that.container.insertBefore(box, placeholder);
        //          that.container.removeChild(placeholder);
        //          box.space = destination;
        //          box.innerHTML = destination.toString();
        //          Fixer.unfix(box);
        //        }
        //      }
        //    );
        //  })();
        //}

        // FIXME: this shouldn't happen until the animation is complete.. also we should prevent clicks

        /*
        for (i = 0; i < spaces.length; i++) {
          destination = permutation[i];
          box = boxes[i];
          placeholder = placeholders[spaces.indexOf(destination)];
          that.container.insertBefore(box, placeholder);
          that.container.removeChild(placeholder);
          box.space = destination;
          box.innerHTML = destination.toString();
        }
        */
      });
    }
  };

})();
