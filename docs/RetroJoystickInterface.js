
class RetroJoystickInterface {

    constructor (){
        this.inputs = 
        {
            leftStick: {x:0, y:0, z:0},
            leftStickX: 0,
            leftStickY: 0,
            leftStickXNormalized: 0,
            leftStickYNormalized: 0,
            buttonSouth: false,
            buttonEast: false,
            buttonWest: false,
            buttonNorth: false,
        }
    }
    
    enable() {
        $('#controls').load('/html/RetroJoystick.html', ()=> this.setupListeners());
    }

    setupListeners(){
        let parent = '#controls #joystick';
        let joystick = new JoystickElement($(`${parent} #left-joystick`), (event)=>this.onJoystickChange(event));

        $(`${parent} #a-button`).on("touchstart", () => {this.buttonPressed("buttonSouth") });
        $(`${parent} #a-button`).on("touchend", () => { this.buttonReleased("buttonSouth")});
        $(`${parent} #b-button`).on("touchstart", () => { this.buttonPressed("buttonEast")});
        $(`${parent} #b-button`).on("touchend", () => { this.buttonReleased("buttonEast")});
        $(`${parent} #x-button`).on("touchstart", () => { this.buttonPressed("buttonWest") });
        $(`${parent} #x-button`).on("touchend", () => {this.buttonReleased("buttonWest") });
        $(`${parent} #y-button`).on("touchstart", () => { this.buttonPressed("buttonNorth") });
        $(`${parent} #y-button`).on("touchend", () => {this.buttonReleased("buttonNorth") });
    }

    disable(){
        
    }

    onJoystickChange(joystickPosition){

        this.inputs.leftStickX = joystickPosition.unnormalized.x;
        this.inputs.leftStickY = -joystickPosition.unnormalized.y;
        this.inputs.leftStickXNormalized = joystickPosition.normalized.x;
        this.inputs.leftStickYNormalized = joystickPosition.normalized.y;
        this.inputs.leftStick = joystickPosition.normalized;

        this.send();
    }

    disableTouchScaling() {
        // Prevent zooming with more than one finger
        document.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault(); // Prevent zoom
            }
        }, { passive: false });

        // Prevent pinch zooming with gestures
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault(); // Prevent zoom gesture
        }, { passive: false });
    }


    buttonPressed(key){
        this.inputs[key] = true;
        if(window.navigator.vibrate) window.navigator.vibrate(40);
        this.send();
    }

    buttonReleased(key){
        this.inputs[key] = false;
        if(window.navigator.vibrate) window.navigator.vibrate(40);
        this.send(true);
    }

    send(){
        doSend(this.inputs);
    }
    
}