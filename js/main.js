// GAME START
function game(){

    el('#soundOn').src = src="img/sound.png";

    let co = el('#canvas');
    let ctx = co.getContext('2d');

    // VARIABLEN START
    let animate = false;
    let tCode = false;
    let soundSwitch = false;
    let kreise  = 50;
    let animatekreis = false;
    // VARIABLEN ENDE

    // SCHLANGE START
    let snake = {
        x       : 300,
        y       : 230,
        w       : 300,
        h       : 300,
        col     : 'blue',
        spX     : 2,
        spY     : 2,
        shrink  : function(){   // LÄSST DIE SCHLANGE SCHRUMPFEN
            this.w = this.w - 30;
            this.h = this.h - 30;
            this.x = this.x + 15;
            this.y = this.y + 15;
            this.spY = this.spY + 0.5;
            this.spX = this.spX + 0.5;
        },
        move    : function(){

            if(this.w === 0){
                // GEWONNEN
                cancelAnimationFrame(animate);
                winner();
                apple.startTimer = false;
                konfetti();
            }
            // KOLLISION MIT WAND RECHTS START
            if(this.x > co.width - this.w - 3){
                // GAME OVER
                cancelAnimationFrame(animate);
                tot();
                ctx.fillStyle = 'black';
                ctx.font = '100px Delius Unicase';
                ctx.fillText('Game Over', 400, 400);  
                apple.startTimer = false;
            }
            // KOLLISION MIT WAND RECHTS ENDE
            // KOLLISION MIT WAND LINKS START
            if(this.x < 3){
                //GAME OVER
                cancelAnimationFrame(animate);
                tot();
                ctx.fillStyle = 'black';
                ctx.font = '100px Delius Unicase';
                ctx.fillText('Game Over', 400, 400);  
                apple.startTimer = false;

            }
            // KOLLISION MIT WAND LINKS ENDE
            // KOLLISION MIT WAND UNTEN START
            if(this.y > co.height - this.h - 3){
                //GAME OVER
                cancelAnimationFrame(animate);
                tot();
                ctx.fillStyle = 'black';
                ctx.font = '100px Delius Unicase';
                ctx.fillText('Game Over', 400, 400);  
                apple.startTimer = false;
            }
            // KOLLISION MIT WAND UNTEN ENDE
            // KOLLISION MIT WAND OBEN START
            if(this.y < 3){
                //GAME OVER
                cancelAnimationFrame(animate);
                tot();
                ctx.fillStyle = 'black';
                ctx.font = '100px Delius Unicase';
                ctx.fillText('Game Over', 400, 400);  
                apple.startTimer = false;
            }
            // KOLLISION MIT WAND OBEN START

            // PFEILTASTEN BELEGUNG START
            if(tCode === 'ArrowLeft'){
                this.x -= this.spX;
            }
            if(tCode === 'ArrowRight'){
                this.x += this.spX;
            }
            if(tCode === 'ArrowUp'){
                this.y -= this.spY;
            }
            if(tCode === 'ArrowDown'){
                this.y += this.spY;
            }
            // PFEILTASTEN BELEGUNG ENDE
        },
        // ZEICHNEN DER SCHLANGE START
        draw: function(){
            ctx.fillStyle = this.col;
            ctx.fillRect(this.x,this.y,this.w,this.h)
        },
        // ZEICHNEN DER SCHLANGE ENDE
    };
    // SCHLANGE ENDE

    // APFEL START
    let apple =  {
        x           : 1000,
        y           : 380,
        r           : 15,
        zaehle      : 0,
        max         : [0,1,2,3,4,5,6,7,8,9],
        counter     : 0,
        col         : 'red',
        startTimer  : false,
        // ZEICHNEN DES APFELS START
        draw        : function(){
            ctx.fillStyle = this.col;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,2 * Math.PI);
            ctx.fill();
        },
        // ZEICHNEN DES APFELS START

        // TIMER START
        timer : function(){
            
            erfolg = `${this.max[0]}`;
            erfolg = this.counter ++ / 60;

            el('#timer').innerText = Math.round(erfolg);        // AUSGABE DER ZEIT
        },
        // TIMER ENDE

        // ZÄHLER START
        zaehler : function(){

            this.zaehle === 10
            el('#counter').innerText = this.zaehle;             // AUSGABE DER PUNKTE
        },
        // ZÄHLER ENDE

        // NEUPOSITIONIERUNG DER ÄPFEL START
        kollision : function(){
            if(kollisionsAbfrage(this,snake)){
                this.x = Math.floor(Math.random() * (co.width - 100)) + 50;
                this.y = Math.floor(Math.random() * (co.height - 100)) + 50;

                snake.shrink();
                essen();
                this.zaehle ++;
                apple.zaehler();
            }
        },
        // NEUPOSITIONIERUNG DER ÄPFEL ENDE
    };
    // APFEL ENDE

    // KOLLISIONSABFRAGE START
    function kollisionsAbfrage(circle,rect){
        let distX = Math.abs(circle.x - rect.x-rect.w/2);
        let distY = Math.abs(circle.y - rect.y-rect.h/2);
        
        if (distX > (rect.w/2 + circle.r)) { return false; }
        if (distY > (rect.h/2 + circle.r)) { return false; }
        
        if (distX <= (rect.w/2)) { return true; } 
        if (distY <= (rect.h/2)) { return true; }
        
        let dx=distX-rect.w/2;
        let dy=distY-rect.h/2;
        
        return (dx*dx + dy*dy<=(circle.r*circle.r));
    };
    // KOLLISIONSABFRAGE ENDE

    // TASTE GEDRÜCKT START
    function checkDown(e){
            let legal = [
                "ArrowRight",
                "ArrowLeft",
                "ArrowUp",
                "ArrowDown"
            ];
            if (legal.includes (e.key)){
            apple.startTimer = true;
            tCode = e.key;
            e.preventDefault(); // BROWSER BEFEHLE AUSSCHALTEN
        }
    };

    document.addEventListener('keydown',checkDown);
    // TASTE GEDRÜCKT ENDE

    // RENDER START
    function render(){
        animate = requestAnimationFrame(render);
        ctx.clearRect(0,0,co.width,co.height);
        apple.draw();
        snake.draw();
        snake.move();
        apple.kollision();
        if (apple.startTimer){
            apple.timer();
        };
        apple.zaehler();
    };
    // RENDER ENDE

    // SOUNDS START
    function essen(){
        if(soundSwitch){
            let audio = new Audio();
            audio.src = "sound/shot.mp3";
            audio.volume = 0.2;
            audio.play();
        }
    };

        function tot(){
        if(soundSwitch){
            let audio = new Audio();
            audio.src = "sound/bomb2.mp3";
            audio.volume = 0.2;
            audio.play();
        }
    };

        function winner(){
        if(soundSwitch){
            let audio = new Audio();
            audio.src = "sound/winner.mp3";
            audio.volume = 0.2;
            audio.play();
        }
    };

    function soundOnOff(){
        if (soundSwitch){
            this.src = "img/sound.png";
        }else{
            this.src = "img/sound1.png";
        }
        soundSwitch = !soundSwitch;
    };
    // SOUNDS ENDE

    // BUTTONS AUFRUFE START
    el('#soundOn').addEventListener('click', soundOnOff);
    el('#start').addEventListener('click', function(){
        
        if (!animate){  
            render();
            this.src = "img/start.png";
        }
        else{
            this.src = "img/start.png";
            cancelAnimationFrame(animate);

        };
        animate = !animate;
    });
    // BUTTONS AUFRUFE ENDE

    render();

    // KONFETTI BEI GEWINN START
    function konfetti(){
    
    const collector = {};       //SAMMELOBJEKT FÜR DIE KLONE
    let index       = 0;

    // PROTOCIRCLE START
    const protoCircle = {
        x : 20,
        y : 20,
        r : 15,
        rx: 0,           // RICHTUNG x 0-> RECHTS 0-> LINKS
        ry: 0,           // RICHTUNG Y 0-> ABWÄRTS 1-> AUFWÄRTS
        spX: 2,
        spY: 3,
        id: 0,           // IDENTIFIKATION DES KLONS
        life: 0,         // LAUFENDE LEBENSZEIT
        maxLife: 0,      // LEBENSENDE
        col: 'black',
        init: function(){
            // KLON WIRD IN DAS OBJEKT COLLECTOR GESPEICHERT
            collector[index] = this;
            this.id = index;
            index ++;

            // INDIVIDUALITÄT
            // LEBENSDAUER
            this.maxLife = Math.floor(Math.random() * 600 ) + 200;      // DIE MINIMALE LEBENSDAUER IST "200" FALLS MATH RANDOM 0 AUSWÄHLT MAX:799

            // UNTERSCHIEDLICHE STARTPOSITIONEN / INDIVIDUALITÄT
            this.x = Math.floor(Math.random() * 750);
            this.y = Math.floor(Math.random() * 100);
            // UNTERSCHIEDLICHE GESCHWINDIGKEITEN
            this.spX = Math.random() * 3;
            this.spY = Math.random() * 3;
            // UNTERSCHIEDLICHE FARBEN
            this.col = color();
        },

        moveKonfi: function(){
            // BEREICH UND RICHTUNGSWECHSEL DEFINIEREN START
            if(this.x > co.width - this.r){this.rx = 1;}      // KUGEL IST RECHTS AN DER WAND
            if(this.x < 0 + this.r){this.rx = 0;}            // KUGEL IST LINKS AN DER WAND
            if(this.y > co.height - this.r){this.ry = 1;}    // KUGEL IST UNTEN AN DER WAND
            if(this.y < 0 + this.r){this.ry = 0;}            // KUGEL IST OBEN AN DER WAND
            // BEREICH UND RICHTUNGSWECHSEL DEFINIEREN ENDE

            // BERECHNUNG DER ANIMATION START
            if(this.rx === 0){this.x += this.spX;}   // BEWEGUNG NACH RECHTS
            if(this.rx === 1){this.x -= this.spX;}   // BEWEGUNG NACH LINKS
            if(this.ry === 0){this.y += this.spY;}   // BEWEGUNG NACH UNTEN
            if(this.ry === 1){this.y -= this.spY;}   // BEWEGUNG NACH OBEN
            // BERECHNUNG DER ANIMATION ENDE

            // LEBENSZEIT BERECHNEN START
            this.life ++;
            if(this.life >= this.maxLife){
                delete collector[this.id];
            };
            // LEBENSZEIT BERECHNEN ENDE

            // PRÜFEN OB ALLE WEG && PRÜFEN; OB DER COLLECTOR LEER IST START
            let props = Object.keys(collector)
            if(props.length === 0){
                klonFabrik(kreise += 10);
            }
            // PRÜFEN OB ALLE WEG && PRÜFEN; OB DER COLLECTOR LEER IST ENDE

            this.draw();
        },

        // ZEICHNE PROTOCIRCLE START
        draw: function(){
            ctx.lineWidth = 1;
            ctx.fillStyle = this.col;                                   // FARBE FÜLLEN
            ctx.beginPath();                                            // ERSTER PUNKT
            ctx.arc(this.x,this.y,this.r,0, 2 * Math.PI, false);        // POSITION KREIS
            ctx.fill();                                                 // FARBE FÜLLEN
            ctx.stroke();                                               // KONTUR
        }
        // ZEICHNE PROTOCIRCLE ENDE
    };
    // PROTOCIRCLE ENDE

    // FARBEN ZUFÄLLIG AUSWÄHLEN START
    function color(){
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        return `rgb(${r}, ${g}, ${b})`;
    };
    // FARBEN ZUFÄLLIG AUSWÄHLEN ENDE

    // KLONFABRIK START
    function klonFabrik(n){
        for(let i = 0; i < n; i++){
            let klon = Object.create(protoCircle);
            klon.init();    // SPEICHERT JEDEN KLON IN DEN COLLECTOR
        };
    }
    // KLONFABRIK ENDE

    // RENDER START
    function renderkreis(){
        animatekreis = requestAnimationFrame(renderkreis);
        // ALLE PIXEL TRANSPARENT
        ctx.clearRect(0,0,co.width,co.height)
        for( let i in collector){
            collector[i].moveKonfi();
        }
    }
    // RENDER ENDE

    klonFabrik(200);
    renderkreis();
    };
    // KONFETTI BEI GEWINN ENDE
};
// GAME ENDE

    el('#newgame').addEventListener('click', function()
    {location.reload();
    });

// GAME AUFRUF
game();


