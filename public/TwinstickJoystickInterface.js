
class TwinstickJoystickInterface {

    constructor (){
        this.inputs = 
        {
            leftStick: {x:0, y:0, z:0},
            leftStickX: 0,
            leftStickY: 0,
            leftStickXNormalized: 0,
            leftStickYNormalized: 0,
            rightStick: {x:0, y:0, z:0},
            rightStickX: 0,
            rightStickY: 0,
            rightStickXNormalized: 0,
            rightStickYNormalized: 0,
            buttonSouth: false,
            buttonEast: false,
            buttonWest: false,
            buttonNorth: false,
        }
    }
    
    enable() {
        $('#controls').load('/html/TwinstickJoystick.html', ()=> this.setupListeners());
    }

    setupListeners(){
        $('.svg').each(function () {
            $(this).load($(this).attr("src"));
        })
        let parent = '#controls #joystick';
        let leftJoystick = new JoystickElement($(`${parent} #left-joystick`), (event)=>this.onLeftStickChange(event));
        let rightJoystick = new JoystickElement($(`${parent} #right-joystick`), (event)=>this.onRightStickChange(event));

        $(`${parent} #a-button`).on("touchstart", () => {this.buttonPressed("buttonSouth") });
        $(`${parent} #a-button`).on("touchend", () => { this.buttonReleased("buttonSouth")});
        $(`${parent} #b-button`).on("touchstart", () => { this.buttonPressed("buttonEast")});
        $(`${parent} #b-button`).on("touchend", () => { this.buttonReleased("buttonEast")});
        $(`${parent} #x-button`).on("touchstart", () => { this.buttonPressed("buttonWest") });
        $(`${parent} #x-button`).on("touchend", () => {this.buttonReleased("buttonWest") });
        $(`${parent} #y-button`).on("touchstart", () => { this.buttonPressed("buttonNorth") });
        $(`${parent} #y-button`).on("touchend", () => {this.buttonReleased("buttonNorth") });

        $(`${parent} #dpad-up-button`).on("touchstart", () => {this.buttonPressed("dpad/up") });
        $(`${parent} #dpad-up-button`).on("touchend", () => { this.buttonReleased("dpad/up")});
        $(`${parent} #dpad-down-button`).on("touchstart", () => { this.buttonPressed("dpad/down")});
        $(`${parent} #dpad-down-button`).on("touchend", () => { this.buttonReleased("dpad/down")});
        $(`${parent} #dpad-left-button`).on("touchstart", () => { this.buttonPressed("dpad/left") });
        $(`${parent} #dpad-left-button`).on("touchend", () => {this.buttonReleased("dpad/left") });
        $(`${parent} #dpad-right-button`).on("touchstart", () => { this.buttonPressed("dpad/right") });
        $(`${parent} #dpad-right-button`).on("touchend", () => {this.buttonReleased("dpad/right") });
    }

    disable(){
        
    }

    onLeftStickChange(joystickPosition){

        this.inputs.leftStickX = joystickPosition.unnormalized.x;
        this.inputs.leftStickY = -joystickPosition.unnormalized.y;
        this.inputs.leftStickXNormalized = joystickPosition.normalized.x;
        this.inputs.leftStickYNormalized = joystickPosition.normalized.y;
        this.inputs.leftStick = joystickPosition.normalized;

        this.send();
    }

    onRightStickChange(joystickPosition){

        this.inputs.rightStickX = joystickPosition.unnormalized.x;
        this.inputs.rightStickY = -joystickPosition.unnormalized.y;
        this.inputs.rightStickXNormalized = joystickPosition.normalized.x;
        this.inputs.rightStickYNormalized = joystickPosition.normalized.y;
        this.inputs.rightStick = joystickPosition.normalized;

        this.send();
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