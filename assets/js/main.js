//variable
    var c = document.getElementById('canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var canvas = c.getContext("2d");






//Choices
    var options_ball = {
        number : 200,
        ray: {
            min : 1,
            max : 3
        },
        value: {
            min : -3,
            max : 3
        },
        line: {
            display : true,
            size: 1,
            distance: 15000
        },
        //don't display collision if line it's displayed
        collision: {
            display: false,
            color: '#7C2F1F',
            incrementation: 20
        }
    };






///////////////random choices
var random = {
    between : function (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    color : function () {
        var letters = '0123456789ABCDEF';
        var result = '#';
        for (var i = 0; i < 6; i++ ) {
            result += letters[Math.floor(Math.random() * 16)];
        }
        return result;
    },
}

//our convas ball
    //variable
    var balls = new Array();

    //our ball
    function createBall(i) {
        return {
            id: i,
            ray:random.between(options_ball.ray.min, options_ball.ray.max),
            x:random.between(options_ball.ray.max, c.width),
            y:random.between(options_ball.ray.max, c.height),
            //color:random.color(),
            incrementation:0,
            color:'#fff',
            value:{
                x: random.between(options_ball.value.min, options_ball.value.max),
                y: random.between(options_ball.value.min, options_ball.value.max),
            },
            draw: drawBall,
            move: moveBall,
            collision: collision,
            checkVoisin:checkVoisin
        };
    }
    //build a ball
    function buildBall(i) {
        var ball = createBall(i);
        //Verification
            ball.x = ((ball.x+ball.ray)>c.width)? c.width/2 : ball.x;
            ball.y = ((ball.y+ball.ray)>c.height)? c.height/2 : ball.y;
            ball.value.x = (ball.value.x==0)? 1 : ball.value.x ;
            ball.value.y = (ball.value.y==0)? 1 : ball.value.y ;
        //collision
        if(i==0){
            balls.forEach(function (ball_tab) {
                if(ball.collision(ball_tab)){
                    buildBall(i);
                }
            });
        }
        return ball;
    }
    //init balls
    function initBalls() {
        var i=0 ;
        var l = options_ball.number;
        for ( i; i < l; i++){
            balls.push(buildBall(i));
        }
    }

    function drawBall() {
        canvas.beginPath();
        if(this.incrementation>0){
            canvas.fillStyle= options_ball.collision.color;
            canvas.strokeStyle = options_ball.collision.color;
        } else {
            canvas.fillStyle= this.color;
            canvas.strokeStyle = this.color;
        }
        canvas.arc(this.x,this.y,this.ray,0,2*Math.PI);
        canvas.fill();
    }
    //move ball in canvas
    function moveBall() {
        this.x += this.value.x;
        if ((this.x + this.ray) >= c.width) {
            this.value.x = -Math.abs(this.value.x);
        }
        if ((this.x - this.ray) <= 0) {
            this.value.x = Math.abs(this.value.x);
        }

        this.y += this.value.y;
        if ((this.y + this.ray) >= c.height) {
            this.value.y = -Math.abs(this.value.y);
        }
        if ((this.y - this.ray) <= 0) {
            this.value.y = Math.abs(this.value.y);
        }
    }
    //BOOLEAN collision des balls
    function collision(ball){
        var r = sqr(this.ray + ball.ray);
        var d = sqr(this.x - ball.x)+sqr(this.y - ball.y);

        return (d <= r);
    }
    //x²
    function sqr(x) {
        return Math.pow(x,2);
    }
    //resolve collision
    function manageCollision(ball, ball2) {
        if(ball.x<ball2.x){
            ball.value.x=-Math.abs(ball.value.x);
            ball2.value.x=Math.abs(ball2.value.x);
        }
        if(ball.x>ball2.x){
            ball.value.x=Math.abs(ball.value.x);
            ball2.value.x=-Math.abs(ball2.value.x);
        }
        if(ball.y<ball2.y){
            ball.value.y=-Math.abs(ball.value.y);
            ball2.value.y=Math.abs(ball2.value.y);
        }
        if(ball.y>ball2.y){
            ball.value.y=Math.abs(ball.value.y);
            ball2.value.y=-Math.abs(ball2.value.y);
        }

        if(options_ball.collision.display) {
            ball.incrementation = options_ball.collision.incrementation;
            ball2.incrementation = options_ball.collision.incrementation;
        }
    }

    function checkVoisin(ball) {
        var d = sqr(this.x - ball.x)+sqr(this.y - ball.y);
        if(d<options_ball.line.distance){
            canvas.lineWidth = options_ball.line.size;
            if(this.incrementation>0||ball.incrementation>0){
                canvas.strokeStyle =  options_ball.collision.color;
            } else {
                canvas.strokeStyle= this.color;
            }
            canvas.stroke();
            canvas.beginPath();
            canvas.moveTo(this.x, this.y);
            canvas.lineTo(ball.x, ball.y);
        }
    }

//////CANVAS PART draw and setup
    function setup() {
        initBalls();
    }

    function draw() {
        clear();
        //var balls_tab = balls;
        balls.forEach(function (ball) {
            ball.draw();
            balls.forEach(function (ball2) {
                if(ball.id!=ball2.id){
                   if(ball.collision(ball2)){
                       manageCollision(ball, ball2);
                   }
                   if(options_ball.line.display) {
                       ball.checkVoisin(ball2);
                   }
                }
            });
            if(options_ball.collision.display) {
                ball.incrementation--;
            }
            ball.move();
        })
        window.setTimeout(function () {
            requestAnimationFrame(draw);
        }, 6);
    }

    function clear(){
        canvas.clearRect(0, 0, c.width, c.height);
    }

//launch animation
    setup();
    window.requestAnimationFrame(draw);
