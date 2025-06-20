const JOYSTICK_WIDTH = 300;

class JoystickElement {

    /**
     * 
     * @param {*} element 
     * @param {Function<>} event 
     */
    constructor (element, event){
        this.element = element;
        this.stickPosition = 
        {
            unnormalized: {x:0, y:0, z:0},
            normalized: {x:0, y:0, z:0},
        }
    
        this.changeEvent = event;

        $(element).on("mousedown", (e) => {
            this.joystickPressed(e.screenX, e.screenY);
        });
        $(element).on("mouseup", (e) => {
           this.joystickReleased()
        });
        $(element).on("mousemove", (e) => {
            this.joystickDrag(e.screenX, e.screenY);
        });
        $(element).on("touchstart", (e) => {
            console.log(e);
            this.joystickPressed(e.targetTouches[0].screenX, e.targetTouches[0].screenY);
        });

        $(element).on("touchmove", (e) => {
            this.joystickDrag(e.targetTouches[0].screenX, e.targetTouches[0].screenY);
        });

        $(element).on("touchend", (e) => {
           this.joystickReleased()
        });
    }


    joystickPressed(screenX, screenY){
        this.mouseCentre = {x:screenX, y:screenY}
        this.joystickDown = true
    }

    joystickReleased(){
        this.joystickDown = false
        this.stickPosition.unnormalized = {x: 0, y:0};
        this.stickPosition.normalized = {x: 0, y:0};
        $(this.element).find(".joystick-element").css({
            'bottom': `50%`,
            'left': `50%`
        });
        this.changeEvent(this.stickPosition);

    }

    joystickDrag(screenX, screenY){
        if (!this.joystickDown) {
            return;
        }
        let current = { x: screenX, y: screenY }
        let delta = {
            x: current.x - this.mouseCentre.x,
            y: current.y - this.mouseCentre.y
        }

        let joystickXNormalized = Util.clamp(2 * delta.x / $(this.element).width(), -1, 1);
        let joystickYNormalized = Util.clamp(2 * -delta.y / $(this.element).width(), -1, 1);

        $(this.element).find(".joystick-element").css({
            'bottom': `${(joystickYNormalized + 1) / 2 * 100}%`,
            'left': `${(joystickXNormalized + 1) / 2 * 100}%`
        });

        this.stickPosition.unnormalized = {x: delta.x, y:delta.y};
        this.stickPosition.normalized = {x: joystickXNormalized, y:joystickYNormalized};
        this.changeEvent(this.stickPosition);

    }
    
}