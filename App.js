function draw(){
    var canvas = document.getElementById('painting');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        var mouse = { x:0, y:0 };
        var draw = false;	
    
        // mouse events
        canvas.addEventListener("mousedown", function(event) {  
            mouse.x = event.pageX - this.offsetLeft;
            mouse.y = event.pageY - this.offsetTop;
            draw = true;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
        });

        canvas.addEventListener("mousemove", function(event) {
            if(draw == true) {
                mouse.x = event.pageX - this.offsetLeft;
                mouse.y = event.pageY - this.offsetTop;
                context.strokeStyle =  "rgba(220, 64, 248, 0.5)";
                context.lineCap = "round";
                context.lineWidth = 12;
                context.lineTo(mouse.x, mouse.y);
                context.stroke();
            }
        });
    
        canvas.addEventListener("mouseup", function(event) {
            mouse.x = event.pageX - this.offsetLeft;
            mouse.y = event.pageY - this.offsetTop;
            context.lineTo(mouse.x, mouse.y);
            context.closePath();
            draw = false;
        });
        
    } else {
        alert("Browser does not support canvas");
    }
}

function clean_canvas(element_id) {
    var canvas = document.getElementById(element_id);
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 700, 500);
        document.getElementById('check').innerHTML = '';
    }
}

function square() {
    var canvas = document.getElementById('figure');
    if (canvas.getContext){
        var context = canvas.getContext('2d');
        context.strokeRect(canvas.width/3,canvas.height/3,230,230);
    }
}

function triangle() {
    var canvas = document.getElementById('figure');
    if (canvas.getContext){
        var context = canvas.getContext('2d');
        context.beginPath(),
        context.moveTo(canvas.width/2,canvas.height/4),
        context.lineTo(550,370),
        context.lineTo(150,370),
        context.closePath(),
        context.stroke()
    }
}

function trapezoid() {
    var canvas = document.getElementById('figure');
    if (canvas.getContext){
        var context = canvas.getContext('2d');
        context.beginPath(),
        context.moveTo(canvas.width/3,canvas.height/4),
        context.lineTo(150,400),
        context.lineTo(550,400),
        context.lineTo(450,125),
        context.closePath(),
        context.stroke()
    }
}

function circle() {
    var canvas = document.getElementById('figure');
    if (canvas.getContext){
        var context = canvas.getContext('2d');
        context.beginPath(),
        context.arc(canvas.width/2, canvas.height/2, 130, 0, 2 * Math.PI),
        context.closePath(),
        context.stroke()
    }
}

function binarize(element_id) {
    var canvas = document.getElementById(element_id);
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data; // 4 layers RGB + Alpha	
                    
        // shade of gray
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        
        // finding the average value across the entire canvas
        var sum = 0;
        for (var i = 0; i < data.length/4; i += 4) {
            sum = sum + data[i];
        }
        var canvas_avg = sum / data.length/4;

        // image binarization
        window.black_pixel = 0;
        for (var i = 0; i < data.length; i += 4) {
            if(data[i] > canvas_avg){
                window.black_pixel++;
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 0;
            }
        }
            return data;
    }
}

function figure() {
    clean_canvas('figure');
    clean_canvas('painting');
    document.getElementById('check').innerHTML = '';

    var canvas = document.getElementById('figure');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.lineWidth = 12;
        context.strokeStyle = "rgb(150, 241, 5)";
        
        var img = ['square', 'triangle','circle','trapezoid'];
        var random = Math.floor(Math.random()*img.length);
        if (img[random] == 'square') {square();}
        if (img[random] == 'triangle') {triangle();}
        if (img[random] == 'circle') {circle();}
        if (img[random] == 'trapezoid') {trapezoid();}
        
        binarize('figure');
        window.binary_figure = binarize('figure');
        window.black_pixel_figure = window.black_pixel;
    }
}

function check() {
    binarize('painting');
	binary_painting = binarize('painting');

    var binary_figure = window.binary_figure;	
    
    var out_array = [];
    
    for(var i = 0; i < binary_figure.length; i++){
        if(binary_figure[i] == 255 && binary_painting[i] == 255){
            out_array.push(255);
        } else {
            out_array.push(0);
        }
    }
    
    var luck = 0;
    for(var j = 3; j < out_array.length; j += 4){
        if(out_array[j] == 255){
            luck++;
        }
    }
    
    var black_pixel_painting = window.black_pixel;
    var black_pixel_figure = window.black_pixel_figure;
    
    var lose = black_pixel_painting - luck;
    
    var percent_figure = Math.round((luck * 100)/black_pixel_figure);
    var percent_draw = Math.round((lose * 100)/black_pixel_figure);
    var percent = percent_figure - percent_draw;
    
    if (percent < 0 || luck == 0){
        document.getElementById('check').innerHTML = 'Drawing accuracy: 0%';
    } else {
        document.getElementById('check').innerHTML = 'Drawing accuracy: ' + percent + ' %';
    }
}
