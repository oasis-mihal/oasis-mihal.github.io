
class InputFieldInterface {

    constructor (){
        this.inputs = 
        {
            text : ""
        }
    }
    
    enable() {
        $('#controls').load('/html/InputField.html', ()=> this.setupListeners());
    }

    setupListeners(){
        let parent = '#controls #joystick';
        
        $(`${parent} #text-field`).on("focus", ()=>{this.enterKeyboardMode();})
        $(`${parent} #text-field`).on("blur", ()=>{this.exitKeyboardMode();})
        $(`${parent} #submit`).on("click", () => { this.submit()});

        window.addEventListener('resize', () => {
            // For the rare legacy browsers that don't support it
            if (!window.visualViewport) {
              return
            }
          
            console.log(window.visualViewport.height)
          })
    }

    disable(){
    }

    enterKeyboardMode(){
        $(`#controls #input-block`).css("top","15%")
        $(`#connection-status`).fadeOut(300);
    }
    exitKeyboardMode(){
        $(`#controls #input-block`).css("top","60%")
        $(`#connection-status`).fadeIn(300);
    }

    submit(){
        this.inputs.text = $('#controls #input-field').val();
        doSend(this.inputs);
    }
    
}